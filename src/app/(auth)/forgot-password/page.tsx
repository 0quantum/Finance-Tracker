import { ForgotPasswordForm } from "@/src/components/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-muted p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center justify-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <span className="text-xs font-bold text-primary-foreground">F</span>
          </div>
          <span className="font-semibold">FinanceApp</span>
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}