import { cn } from "cn";
import { MailIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

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
  forgetPasswordSchema,
  forgetPasswordDefaultValues,
} from "@/features/auth/validations";
import SubmitBtn from "@/components/submit-btn";
import { handleValidationErrors } from "@/lib/api";
import { useForgetPassword } from "@/features/auth/useForgetPassword";
import type { ForgetPasswordFormValues } from "@/features/auth/types";

export function ForgetPasswordForm({ className }: { className?: string }) {
  const { forgetPassword, isPending } = useForgetPassword();

  const form = useForm<ForgetPasswordFormValues>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: forgetPasswordDefaultValues,
  });

  function onSubmit(data: ForgetPasswordFormValues) {
    form.clearErrors();
    forgetPassword(data, {
      onError: (err) =>
        handleValidationErrors<ForgetPasswordFormValues>(form, err),
    });
  }

  return (
    <form
      className={cn("flex flex-col gap-4", className)}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">
                Email Address <span className="text-destructive">*</span>
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder="m@example.com"
                />
                <InputGroupAddon align="inline-start">
                  <MailIcon />
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <SubmitBtn
        title="Send Verification Code"
        isPending={isPending}
        pendingTitle="Sending you Code..."
      />
    </form>
  );
}
