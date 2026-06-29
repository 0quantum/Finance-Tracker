"use client";

import { useState } from "react";
import { supabase } from "@/src/lib/supabase/browser";
import { Card } from "@/src/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/src/components/ui/field";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Loader2, CheckCircle2 } from "lucide-react";

export function ChangePasswordCard() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setSuccess(false);
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError("Failed to update password. Try again.");
    } else {
      setSuccess(true);
      setPassword("");
      setConfirm("");
      setTimeout(() => setSuccess(false), 3000);
    }
    setLoading(false);
  };

  return (
    <Card className="p-5 rounded-2xl border bg-white dark:bg-muted shadow-sm">
      <p className="text-sm font-medium mb-0.5">Change password</p>
      <p className="text-xs text-muted-foreground mb-4">
        Choose a new password for your account
      </p>

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="new-password">New password</FieldLabel>
          <Input
            id="new-password"
            type="password"
            placeholder="Min. 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm password</FieldLabel>
          <Input
            id="confirm-password"
            type="password"
            placeholder="Repeat your password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full"
          />
        </Field>

        {error && (
          <Field>
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-500">
              {error}
            </p>
          </Field>
        )}
        {success && (
          <Field>
            <p className="rounded-lg bg-green-500/10 px-3 py-2 text-xs text-green-600 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> Password updated
            </p>
          </Field>
        )}
        <Field>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Update password
          </Button>
        </Field>
      </FieldGroup>
    </Card>
  );
}