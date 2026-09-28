# Registration Flow Demo

A step-by-step guide to completing registration in this project, following the same feature structure and UI conventions as login while not writing registration data to the authenticated-user React Query cache.

Registration still benefits from a TanStack Query mutation: `useMutation` provides pending state and lifecycle callbacks. It does not imply that the result must be saved in the query cache. The registration endpoint sends a verification email and does not log the user in, so do not call `setQueryData(QUERY_KEYS.user, ...)` here.

## Current State

These are the relevant project files and what they currently do:

| Step | File | Current responsibility |
| --- | --- | --- |
| 1 | `web/src/features/auth/validations.ts` | Registration Zod schema, role options, defaults, and backend request DTO. |
| 2 | `web/src/features/auth/types.ts` | Existing login types; registration types can be added here. |
| 3 | `web/src/lib/api.ts` | Shared Axios instances, response types, and error helpers. |
| 4 | `web/src/features/auth/api.ts` | Login request; `registerApi` is currently only a placeholder. |
| 5 | `web/src/features/auth/useRegister.ts` | Registration hook scaffold; currently incomplete. |
| 6 | `web/src/features/auth/register-form.tsx` | Registration UI and client validation; currently calls a non-existing `register` API export directly. |
| 7 | `api/src/modules/auth/auth.route.ts` | Connects `POST /register` to server validation and controller. |
| 8 | `api/src/modules/auth/auth.validation.ts` | Server-side registration validation. |
| 9 | `api/src/modules/auth/auth.controller.ts` and `auth.service.ts` | Creates the account and sends its verification email. |

## 1. Keep Client Validation In The Feature Schema

**File:** `web/src/features/auth/validations.ts`

Your current `registerSchema` already checks the registration fields, role, password strength, and password confirmation. Keep the password-match refinement attached to `confirmPassword`, so React Hook Form displays that error beside the confirmation input.

One detail to resolve: `lastName` is currently optional but has `.min(3, ...)`. An empty string is still a string, so it fails that minimum. Decide whether blank last names are allowed. If they are, preprocess a blank value to `undefined` or make the schema accept blank values; otherwise mark the input required and validate it accordingly.

The UI currently renders last name as a plain input, not a React Hook Form `Controller` or registered field. Connect it to the form if its value should be submitted. Also add a matching default value if you want an always-controlled input.

## 2. Infer Form Values And Separate The Request DTO

**Files:** `web/src/features/auth/types.ts`, `web/src/features/auth/validations.ts`

The form submits `confirmPassword` to the client-side schema, but the backend `RegisterUserDto` does not accept that field. Keep those types distinct: infer all form values from the schema, then define the request data as the form values without `confirmPassword`.

For example, in `web/src/features/auth/types.ts`:

```ts
import type z from "zod";
import type { registerSchema } from "@/features/auth/validations";

export type RegisterFormValues = z.infer<typeof registerSchema>;
export type RegisterRequest = Omit<RegisterFormValues, "confirmPassword">;
```

Then use `RegisterRequest` as the frontend request parameter type for `registerApi`. It should agree with the backend `RegisterUserDto` in `api/src/modules/auth/auth.types.ts`.

## 3. Type The Registration Response

**Files:** `web/src/features/auth/types.ts`, `api/src/modules/auth/auth.controller.ts`

The backend controller returns this shape after successful registration:

```json
{
  "status": "Success",
  "message": "Email Registered Successfully. Check you email for activation",
  "data": {
    "id": "...",
    "email": "user@example.com",
    "firstName": "..."
  }
}
```

The exact returned user fields follow the Prisma user model with the password omitted. Since the registration flow only needs the response message, it can type the unused payload as `unknown` rather than duplicating the whole Prisma user shape. Add this to `features/auth/types.ts`:

```ts
import type { ApiResponse } from "@/lib/api";

export type RegisterSuccessResponse = ApiResponse<unknown>;
```

If the UI later needs returned user fields, replace `unknown` with an explicit public response type. Do not include a password hash or refresh token.

## 4. Implement The API Request

**File:** `web/src/features/auth/api.ts`

Replace the current placeholder `registerApi` (which logs form data) with an Axios request to `/auth/register`. Return the Axios response body's `data` property, just like `loginApi`:

```ts
export async function registerApi(
  values: RegisterFormValues,
): Promise<RegisterSuccessResponse> {
  const { confirmPassword, ...request } = values;
  const response = await api.post<RegisterSuccessResponse>(
    "/auth/register",
    request,
  );
  return response.data;
}
```

This version accepts the complete form values and strips confirmation before sending it. Alternatively, let `registerApi` accept `RegisterRequest` and strip `confirmPassword` in the form submit handler. Pick one boundary and do the omission there, not in both places.

Do not log credentials or catch and swallow request errors here. Let Axios reject so the mutation can handle success and failure consistently.

## 5. Add A Registration Mutation Without Cache Writes

**File:** `web/src/features/auth/useRegister.ts`

Use the same React Query mutation style as `useLogin`, but do not call `useQueryClient` and do not write to `QUERY_KEYS.user`:

```ts
import { useMutation } from "@tanstack/react-query";

import { getAxiosErrorMsg } from "@/lib/api";
import { toast } from "@/components/ui/toast";
import { registerApi } from "@/features/auth/api";

export function useRegister() {
  const mutation = useMutation({
    mutationFn: registerApi,
    onSuccess: (response) => {
      toast.add({ type: "success", description: response.message });
    },
    onError: (error: unknown) => {
      const message = getAxiosErrorMsg(error);
      toast.add({
        type: "error",
        description: message ?? "Unable to create your account. Please try again.",
      });
    },
  });

  return {
    register: mutation.mutate,
    isPending: mutation.isPending,
  };
}
```

If you want to navigate to login after registration, do that from a success callback or the registration page. The success message should tell the user to verify their email. Do not treat this response as an authenticated session: the registration controller does not return a login access token or set the login refresh cookie.

## 6. Connect The Existing Form To The Hook

**File:** `web/src/features/auth/register-form.tsx`

Replace the direct API import with the hook, use the schema-derived form type, and pass the pending state to the existing submit button. The shape is:

```tsx
const { register, isPending } = useRegister();

const form = useForm<RegisterFormValues>({
  resolver: zodResolver(registerSchema),
  defaultValues: registerDefaultValues,
});

function onSubmit(values: RegisterFormValues) {
  form.clearErrors();
  register(values, {
    onError: (error) => handleValidationErrors<RegisterFormValues>(form, error),
  });
}
```

Then wire the button to the mutation state:

```tsx
<SubmitBtn
  title="Register"
  isPending={isPending}
  pendingTitle="Registering your account..."
/>
```

Keep the hook-level `onError` responsible for the toast and the form-level `onError` responsible for field errors. This avoids showing duplicate notifications while preserving inline validation feedback.

Every input that should be submitted must be registered with React Hook Form. Your existing `Controller` fields are registered; the last-name input currently is not. Use `Controller` for it too, or use `register("lastName")` and render its field error.

## 7. Reuse The Shared Validation Error Helper Carefully

**File:** `web/src/lib/api.ts`

The backend validation middleware returns `{ status, message, data: { errors } }`, so the Axios error body is accessed at:

```ts
error.response?.data?.data?.errors
```

The current `handleValidationErrors` implementation should be hardened before registration uses it. In particular, guard a missing HTTP response and `data: null`, verify that `errors` is an object, set only fields belonging to the form, and ensure each message is a string. A non-validation error (for example, an already-registered email) may have `data: null`; a network error has no `response` at all.

The registration controller may also return a general conflict error when an account already exists. That should produce the hook's toast rather than being treated as a set of field errors unless the backend explicitly returns field errors for that condition.

## 8. Follow The Backend Request Path

**Files:** `api/src/modules/auth/auth.route.ts`, `api/src/modules/auth/auth.validation.ts`, `api/src/common/middlewares/validate.middleware.ts`, `api/src/modules/auth/auth.controller.ts`, `api/src/modules/auth/auth.service.ts`

The route is registered as:

```ts
router.post("/register", validate(registerRules), register);
```

The server validates all submitted fields independently. The controller then calls `AuthService.register`, returns a success envelope, and the service hashes the password, creates the user, and sends the verification email. The browser must not decide whether an account is valid or active.

## Complete Registration Flow

1. `register-form.tsx` gathers values and runs the Zod schema from `validations.ts`.
2. Invalid client values render through the form's existing `FieldError` components; no request is made.
3. The form calls the `register` mutation from `useRegister.ts`.
4. `registerApi` in `features/auth/api.ts` removes `confirmPassword` and posts the request through the shared Axios instance.
5. The server route and `validate` middleware validate the request.
6. On a validation error, the mutation displays the top-level message and the per-call callback maps valid field messages into React Hook Form errors.
7. On success, the mutation shows the backend's “check your email” message. The result is not written to the logged-in user cache.
8. The user verifies their email, then signs in through the separate login flow.

## Verification

From the repository root:

```sh
npm --prefix web run typecheck
npm --prefix web run build
```

Manually check:

- Invalid email, phone number, or password is stopped by client-side validation.
- Password mismatch appears beside the confirmation field.
- Registration request body does not contain `confirmPassword`.
- An HTTP 400 response displays recognized server field errors without throwing.
- An already-registered account shows a useful API error message.
- Network failure shows a fallback message.
- Successful registration shows the verification message and does not set `QUERY_KEYS.user`.

## Current Work Still Needed

The project currently has an unfinished `useRegister`, a placeholder `registerApi`, and `register-form.tsx` imports `register` directly even though the API module exports `registerApi`. The form also passes `isPending={false}`. Use the steps above to connect these pieces in order; no React Query cache update is needed for registration.
