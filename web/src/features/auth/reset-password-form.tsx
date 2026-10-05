import { cn } from "cn";
import { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Lock, EyeIcon, EyeOffIcon } from "lucide-react";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  resetPasswordSchema,
  resetPasswordDefaultValues,
} from "@/features/auth/validations";
import { Button } from "@/components/ui/button";
import SubmitBtn from "@/components/submit-btn";
import { handleValidationErrors } from "@/lib/api";
import { useResetPassword } from "@/features/auth/useResetPassword";
import type { ResetPasswordFormValues } from "@/features/auth/types";

export function ResetPasswordForm({
  token,
  className,
}: {
  token: string;
  className?: string;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const { resetPassword, isPending } = useResetPassword();
  const hasActivatedRef = useRef<string | null>(null);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: resetPasswordDefaultValues,
  });

  function onSubmit(data: ResetPasswordFormValues) {
    form.clearErrors();
    resetPassword(
      { data, token },
      {
        onSuccess: () => (hasActivatedRef.current = token),
        onError: (err) =>
          handleValidationErrors<ResetPasswordFormValues>(form, err),
      },
    );
  }

  return (
    <form
      className={cn("flex flex-col gap-4", className)}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup>
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="password">
                Password <span className="text-destructive">*</span>
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder="********"
                  type={showPassword ? "text" : "password"}
                />
                <InputGroupAddon align="inline-start">
                  <Lock />
                </InputGroupAddon>
                <InputGroupAddon align="inline-end">
                  <Button
                    size="icon"
                    type="button"
                    variant="ghost"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </Button>
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <FieldGroup>
        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="confirmPassword">
                Repeat Password <span className="text-destructive">*</span>
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder="********"
                  type={showPassword ? "text" : "password"}
                />
                <InputGroupAddon align="inline-start">
                  <Lock />
                </InputGroupAddon>
                <InputGroupAddon align="inline-end">
                  <Button
                    size="icon"
                    type="button"
                    variant="ghost"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </Button>
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <SubmitBtn
        title="Reset Password"
        isPending={isPending}
        pendingTitle="Updating your password..."
      />
    </form>
  );
}
