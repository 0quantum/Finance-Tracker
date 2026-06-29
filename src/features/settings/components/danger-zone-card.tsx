"use client";

import { useState } from "react";
import { supabase } from "@/src/lib/supabase/browser";
import { Card } from "@/src/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/src/components/ui/field";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";

export function DangerZoneCard() {
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