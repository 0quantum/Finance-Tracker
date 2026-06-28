"use client";

import { useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { supabase } from "@/src/lib/supabase/browser";
import { Card } from "@/src/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/src/components/ui/field";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@/src/lib/utils";

// ─── client-only mounted flag без setState в ефекті ────────────────

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

// ─── Change Password ──────────────────────────────────────────────

function ChangePasswordCard() {
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

// ─── Theme ────────────────────────────────────────────────────────

type Theme = "light" | "dark" | "system";

function ThemeCard() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  const options: { value: Theme; label: string }[] = [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
    { value: "system", label: "System" },
  ];

  return (
    <Card className="p-5 rounded-2xl border bg-white dark:bg-muted shadow-sm">
      <p className="text-sm font-medium mb-0.5">Appearance</p>
      <p className="text-xs text-muted-foreground mb-4">
        Choose how FinanceApp looks for you
      </p>

      <div className="flex rounded-lg border overflow-hidden text-sm">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => setTheme(o.value)}
            className={cn(
              "flex-1 py-2 font-medium transition-colors whitespace-nowrap",
              mounted && theme === o.value
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </Card>
  );
}

// ─── Danger Zone ──────────────────────────────────────────────────

function DangerZoneCard() {
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const PHRASE = "delete my account";

  const handleDelete = async () => {
    if (confirm !== PHRASE) {
      setError(`Type "${PHRASE}" to confirm.`);
      return;
    }
    setError(null);
    setLoading(true);

    const res = await fetch("/api/delete-account", { method: "DELETE" });

    if (!res.ok) {
      setError("Failed to delete account. Try again.");
      setLoading(false);
      return;
    }

    supabase.auth.signOut().catch(() => {}); // ігноруємо 403
    window.location.href = "/login";
  };

  return (
    <Card className="p-5 rounded-2xl border border-red-200 dark:border-red-900 bg-white dark:bg-muted shadow-sm">
      <p className="text-sm font-medium text-red-600 dark:text-red-400 flex items-center gap-1.5 mb-0.5">
        <AlertTriangle className="h-4 w-4 shrink-0" /> Danger zone
      </p>
      <p className="text-xs text-muted-foreground mb-4">
        Permanently delete your account and all data. This cannot be undone.
      </p>

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="confirm-delete">
            Type <span className="font-mono font-semibold">{PHRASE}</span> to
            confirm
          </FieldLabel>
          <Input
            id="confirm-delete"
            type="text"
            placeholder={PHRASE}
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

        <Field>
          <Button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Delete account
          </Button>
        </Field>
      </FieldGroup>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────

export default function SettingsPage() {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 p-3 md:p-6">
          <div>
            <h1 className="text-xl font-semibold">Settings</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Manage your account preferences
            </p>
          </div>

          <ChangePasswordCard />
          <ThemeCard />
          <DangerZoneCard />

          <div className="pb-6" />
        </div>
      </div>
    </div>
  );
}
