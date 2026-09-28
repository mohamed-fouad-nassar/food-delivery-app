# Login Flow: Project Walkthrough

This is a file-by-file guide to the login flow as it is currently organized in this project. It covers the frontend's Zod form validation, shared Axios clients, API error helpers, React Query mutation/cache, and the backend validation and login response.

## File Map

| Step | File                                                | Responsibility                                                                |
| ---- | --------------------------------------------------- | ----------------------------------------------------------------------------- |
| 1    | `api/src/modules/auth/auth.route.ts`                | Connects `POST /login` to validation and controller middleware.               |
| 2    | `api/src/modules/auth/auth.validation.ts`           | Validates email format and minimum password length.                           |
| 3    | `api/src/common/middlewares/validate.middleware.ts` | Runs validators and returns field errors on HTTP 400.                         |
| 4    | `api/src/modules/auth/auth.controller.ts`           | Calls the service, sets the refresh cookie, and returns the success envelope. |
| 5    | `api/src/modules/auth/auth.service.ts`              | Looks up the account, verifies password/status, and creates tokens.           |
| 6    | `web/src/features/auth/validations.ts`              | Defines client-side login schema and default form values.                     |
| 7    | `web/src/features/auth/types.ts`                    | Derives form values from Zod and declares login response types.               |
| 8    | `web/src/lib/api.ts`                                | Creates Axios clients/interceptors and exports shared API/error helpers.      |
| 9    | `web/src/features/auth/api.ts`                      | Sends login credentials and returns the response body.                        |
| 10   | `web/src/lib/react-query.ts` and `web/src/App.tsx`  | Define the user query key/client and provide it to the app.                   |
| 11   | `web/src/features/auth/useLogin.ts`                 | Owns the mutation, success toast, cached login payload, and error toast.      |
| 12   | `web/src/features/auth/login-form.tsx`              | Connects form validation, mutation callbacks, and inline field errors.        |

## 1. Route The Login Request

**File:** `api/src/modules/auth/auth.route.ts`

The route runs the login validation rules before calling the controller:

```ts
router.post("/login", validate(loginRules), login);
```

The browser sends a `POST` to `http://localhost:3000/api/auth/login`; the `/api` prefix comes from the frontend Axios base URL and `/auth/login` from `loginApi`.

## 2. Validate On The Server

**File:** `api/src/modules/auth/auth.validation.ts`

The backend independently validates credentials. This remains necessary even though the frontend validates them too:

```ts
export const loginRules: ValidationChain[] = [
  body("email").isEmail().withMessage("Invalid email format").normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];
```

The frontend schema is for fast UX feedback; server validation is authoritative because clients can bypass browser code.

## 3. Return Validation Errors

**File:** `api/src/common/middlewares/validate.middleware.ts`

The middleware runs the rules and returns an envelope when any fail. The error body shape consumed by the frontend is:

```json
{
  "status": "Fail",
  "message": "Validation Error",
  "data": {
    "errors": {
      "email": "Invalid email format",
      "password": "Password must be at least 8 characters"
    }
  }
}
```

The HTTP status is `400`. Axios rejects non-2xx responses, so the form receives this body through the mutation's `onError` callback at `error.response.data`.

## 4. Authenticate And Build The Success Response

**Files:** `api/src/modules/auth/auth.controller.ts`, `api/src/modules/auth/auth.service.ts`

The route's controller delegates credential checks to `AuthService.login`. The service finds the account, compares the submitted password with the stored hash, checks account status, and generates access and refresh tokens. It returns the user without the password, the access token, and the refresh token.

The controller stores the refresh token in an HttpOnly cookie and returns the access token and user in the JSON response. The success body is:

```json
{
  "status": "Success",
  "message": "Welcome Back, User",
  "data": {
    "user": { "id": "...", "email": "user@example.com" },
    "token": "access-token"
  }
}
```

The refresh token is intentionally not part of the JSON body and should not be stored in frontend JavaScript. The Axios clients use `withCredentials: true` so the browser can send the cookie on eligible requests.

## 5. Validate The Form In The Browser

**File:** `web/src/features/auth/validations.ts`

Your login schema rejects a missing/invalid email and a password shorter than eight characters before sending the request:

```ts
export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const loginDefaultValues: LoginFormValues = {
  email: "",
  password: "",
};
```

The form's input and output type is inferred in `web/src/features/auth/types.ts`:

```ts
export type LoginFormValues = z.infer<typeof loginSchema>;
```

That avoids maintaining a separate form-values interface that could drift from the schema.

## 6. Define Shared API And Login Types

**Files:** `web/src/lib/api.ts`, `web/src/features/auth/types.ts`

`api.ts` defines the common response envelope and generic validation error shape:

```ts
export type ApiResponse<T> = {
  status: string;
  message: string;
  data: T;
};

export type ValidationErrorResponse<T> = ApiResponse<{
  errors: Partial<Record<keyof T, string>>;
}>;

export type ApiErrorResponse = ApiResponse<unknown>;
```

`features/auth/types.ts` derives `LoginFormValues` from the schema, declares `LoginUser`, and declares `LoginSuccessResponse`.

**Contract fix to make:** the current declaration is `ApiResponse<LoginUser>`, but the controller returns `data: { user, token }`. Make the frontend success type describe the actual response:

```ts
export type LoginSuccessData = {
  user: LoginUser;
  token: string;
};

export type LoginSuccessResponse = ApiResponse<LoginSuccessData>;
```

Without this correction TypeScript believes `response.data` is a user, while runtime data is an object containing both `user` and `token`. The cache and request interceptor currently rely on the latter shape.

## 7. Create And Configure The Axios Instances

**File:** `web/src/lib/api.ts`

The shared `api` instance points to the backend API and includes cookies. A separate `apiRefresh` instance targets the refresh endpoint:

```ts
export const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export const apiRefresh = axios.create({
  baseURL: "http://localhost:3000/api/auth/refresh",
  withCredentials: true,
});
```

The request interceptor reads the cached access token and adds an Authorization header. The response interceptor tries the refresh endpoint for a 401, updates the cached token, then retries the original request. If refreshing fails, it clears the user cache. `QUERY_KEYS` and `queryClient` are imported from `web/src/lib/react-query.ts`.

There is one robustness issue in the current interceptor: it reads `err.response.status` without checking whether an HTTP response exists. Offline/network failures can have no `response`. Guard it (`err.response?.status`) and verify the config exists before reading or setting `_retry`.

## 8. Centralize Error Helpers

**File:** `web/src/lib/api.ts`

`getAxiosErrorMsg(err)` uses Axios's type guard to extract the backend's top-level message. `handleValidationErrors(form, err)` uses React Hook Form's `setError` to transfer server field errors to the form. Its current implementation is:

```ts
export function handleValidationErrors<T extends FieldValues>(
  form: UseFormReturn<T>,
  err: unknown,
) {
  if (!isAxiosError(err)) return;
  const errors = Object.entries(err.response?.data.errors);
  errors?.map((errArr) => {
    form.setError(errArr[0] as any, {
      type: "server",
      message: errArr[1] as any,
    });
  });
}
```

The `UseFormReturn<T>` signature avoids explicitly passing `any` for React Hook Form's unused generic parameters. The current response access still needs correction and guarding:

- The backend validation envelope is `{ status, message, data: { errors } }`, so the field map is at `err.response.data.data.errors`, not `err.response.data.errors`.
- A network error has no `response`; a general backend error can have `data: null`. In either case, `Object.entries(...)` may receive `undefined` and throw. `errors?.map(...)` does not prevent this because `Object.entries` has already been called.
- `map` is intended to transform an array and its result is unused; use `forEach` or a `for...of` loop for the side effect.
- The `as any` assertions hide whether response keys are valid form fields and whether values are strings.

The guarded access should start by narrowing the Axios response and reading the correct nested field:

```ts
if (!isAxiosError<ValidationErrorResponse<T>>(err)) return;

const fieldErrors = err.response?.data?.data?.errors;
if (!fieldErrors) return;
```

Then iterate only after confirming a field map exists, check that each message is a string, and pass only recognized form fields to `form.setError`. This prevents a non-validation or network failure from causing a second exception while handling the original error.

Also note `getAxiosErrorMsg` can return `undefined`; `useLogin` should give the toast a fallback message for network errors or unexpected response shapes.

## 9. Send Credentials

**File:** `web/src/features/auth/api.ts`

`loginApi` accepts the inferred login values, makes the POST request with a response generic, and returns the Axios body's `data` property:

```ts
export async function loginApi(
  credentials: LoginFormValues,
): Promise<LoginSuccessResponse> {
  const res = await api.post<LoginSuccessResponse>("/auth/login", credentials);
  return res.data;
}
```

Returning `res.data` (not `res.data()`) gives React Query the backend envelope on success. Do not catch and swallow request errors here; the mutation needs to receive the Axios error.

## 10. Provide React Query And Define The User Key

**Files:** `web/src/lib/react-query.ts`, `web/src/App.tsx`

`react-query.ts` exports one `queryClient` and the `QUERY_KEYS.user` key. `App.tsx` wraps the app in `QueryClientProvider` using that same client. `useLogin` and the Axios interceptors import the shared key/client instead of creating separate caches.

The Query cache is your current in-memory store for the authenticated user/access token. It is not persistent across reloads unless persistence is added separately. The refresh cookie is the browser-managed, HttpOnly credential.

## 11. Run The Login Mutation And Store The Response

**File:** `web/src/features/auth/useLogin.ts`

`useLogin` connects `loginApi` to TanStack Query. Its hook-level handlers update the cache and show one toast for each success/failure:

```ts
onSuccess: (res) => {
  queryClient.setQueryData(QUERY_KEYS.user, res.data);
  toast.add({ type: "success", description: res.message });
},
onError: (err: unknown) => {
  const message = getAxiosErrorMsg(err);
  toast.add({ type: "error", description: message });
},
```

The cached runtime value is `{ user, token }` because that is the controller's `data`. Correct the frontend response type as in step 6 so the code reflects this shape. Also use a fallback toast description when `getAxiosErrorMsg` returns no message.

## 12. Connect The Form And Map Field Errors

**File:** `web/src/features/auth/login-form.tsx`

The form uses `zodResolver(loginSchema)`, `loginDefaultValues`, and the `LoginFormValues` type. The `Controller` components render the existing `FieldError` UI. On submit, your code clears old errors, starts the login mutation, and delegates server field errors to the shared helper:

```ts
async function onSubmit(credentials: LoginFormValues) {
  form.clearErrors();
  login(credentials, {
    onError: (err) => handleValidationErrors<LoginFormValues>(form, err),
  });
}
```

The mutation hook's `onError` is responsible for the toast. The per-call `onError` here is responsible only for translating field errors into React Hook Form state, so it does not create a duplicate toast.

## Full Request Flow

1. The user submits the login form in `web/src/features/auth/login-form.tsx`.
2. `zodResolver` applies `loginSchema` from `web/src/features/auth/validations.ts`. If client validation fails, the form displays its field errors and does not call the API.
3. The form calls `login`, returned by `web/src/features/auth/useLogin.ts`.
4. TanStack Query invokes `loginApi` in `web/src/features/auth/api.ts`.
5. The shared Axios instance from `web/src/lib/api.ts` sends `POST /auth/login` with credentials. Its request interceptor adds a cached access token when one exists.
6. The backend route in `api/src/modules/auth/auth.route.ts` runs `loginRules` from `api/src/modules/auth/auth.validation.ts`.
7. If validation fails, `api/src/common/middlewares/validate.middleware.ts` returns HTTP 400 with `data.errors`. The mutation hook shows the API message; the form callback calls `handleValidationErrors`, which sets individual errors for the existing field UI.
8. If validation passes, `api/src/modules/auth/auth.controller.ts` calls `AuthService.login` in `api/src/modules/auth/auth.service.ts`.
9. The controller sets the refresh token cookie and returns `{ status, message, data: { user, token } }`.
10. The mutation's `onSuccess` stores the returned `data` in `QUERY_KEYS.user` and shows a success toast.
11. Later requests use the cached access token. When a request receives a 401, the response interceptor attempts refresh and retries the original request once.

## Verification

From the project root:

```sh
npm --prefix web run typecheck
npm --prefix web run build
```

Test these behaviors manually:

- Empty or invalid email and a password shorter than eight characters show client-side errors without a network request.
- A backend 400 shows the matching email/password messages inline and does not throw while parsing the response.
- Invalid credentials show the API message, without attempting to treat a non-validation response as `data.errors`.
- An offline request produces a fallback message and does not crash in the Axios interceptor.
- Successful login stores `{ user, token }` under `QUERY_KEYS.user`; the refresh token remains in the HttpOnly cookie.
- A failed refresh clears the cached auth payload.
