"use client";

import { useState } from "react";
import { supabase } from "@/src/lib/supabase/browser";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/src/components/ui/field";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Loader2, ArrowLeft, MailCheck } from "lucide-react";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/callback/reset-password`,
    });

    if (error) {
      setError("Не вдалось надіслати лист. Перевірте email.");
    } else {
      setSent(true);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-6">
         <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Forgot password</CardTitle>
          <CardDescription>
            {sent
              ? "Check your email for a reset link"
              : "Enter your email and we'll send a reset link"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {sent ? (
            <div className="flex flex-col items-center gap-4 py-4">
              <MailCheck className="h-10 w-10 text-muted-foreground" />
              <p className="text-center text-sm text-muted-foreground">
                Лист надіслано на{" "}
                <span className="font-medium text-foreground">{email}</span>.
                Перевірте папку «Спам» якщо не бачите.
              </p>
              <a
                href="/login"
                className="flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 hover:underline"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to login
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Field>

                {error && (
                  <Field>
                    <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-500">
                      {error}
                    </p>
                  </Field>
                )}

                <Field>
                  <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    Send reset link
                  </Button>
                </Field>

                <Field>
                  <a
                    href="/login"
                    className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground underline-offset-4 hover:underline"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to login
                  </a>
                </Field>
              </FieldGroup>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
