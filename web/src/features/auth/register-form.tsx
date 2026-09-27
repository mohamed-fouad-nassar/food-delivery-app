import z from "zod";
import {
  Lock,
  Phone,
  EyeIcon,
  MailIcon,
  UserIcon,
  EyeOffIcon,
} from "lucide-react";
import { cn } from "cn";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldContent,
  FieldDescription,
} from "@/components/ui/field";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  userRoles,
  registerSchema,
  registerDefaultValues,
} from "@/features/auth/validations";
import { Button } from "@/components/ui/button";
import SubmitBtn from "@/components/submit-btn";

export function RegisterForm({ className }: { className?: string }) {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: registerDefaultValues,
  });

  function onSubmit(data: z.infer<typeof registerSchema>) {
    console.log(data);
  }

  return (
    <form
      className={cn("flex flex-col gap-4", className)}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup className="grid grid-col-1 sm:grid-cols-2">
        <Controller
          name="firstName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="firstName">
                First Name <span className="text-destructive">*</span>
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder="John"
                />
                <InputGroupAddon align="inline-start">
                  <UserIcon />
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field>
          <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
          <InputGroup>
            <InputGroupInput name="lastName" id="lastName" placeholder="Doe" />
            <InputGroupAddon align="inline-start">
              <UserIcon />
            </InputGroupAddon>
          </InputGroup>
        </Field>
      </FieldGroup>

      <FieldGroup>
        <Controller
          name="role"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field orientation="responsive" data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldLabel htmlFor="form-rhf-select-language">Role</FieldLabel>
                <FieldDescription>
                  Select what you will be in our platform.
                </FieldDescription>
              </FieldContent>
              <Select
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  id="form-rhf-select-language"
                  aria-invalid={fieldState.invalid}
                  className="min-w-30"
                >
                  <SelectValue placeholder="Select a Role" />
                </SelectTrigger>
                <SelectContent>
                  {userRoles.map(({ value, label }) => (
                    <SelectItem key={label} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">
                Email <span className="text-destructive">*</span>
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

      <FieldGroup>
        <Controller
          name="phoneNumber"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="phoneNumber">
                Phone Number <span className="text-destructive">*</span>
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder="01*********"
                />
                <InputGroupAddon align="inline-start">
                  <Phone />
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

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
        title="Register"
        isPending={false}
        pendingTitle="Registering you Account..."
      />
    </form>
  );
}
