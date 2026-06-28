"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/browser";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/src/components/ui/field";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/login/button";
import { Loader2 } from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword]   = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [success, setSuccess]     = useState(false);

  // Supabase після кліку на посилання в email кладе токен в хеш URL
  // і сам встановлює сесію — нам залишається лише оновити пароль
  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        // сесія встановлена, форма готова
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError("Не вдалось оновити пароль. Спробуйте ще раз.");
    } else {
      setSuccess(true);
      setTimeout(() => { window.location.href = "/dashboard"; }, 2000);
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted p-4">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">New password</CardTitle>
            <CardDescription>
              {success ? "Password updated! Redirecting…" : "Choose a new password"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {success ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="password">New password</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Min. 6 characters"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                      Update password
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}