"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase/browser";
import { Card } from "@/src/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/src/components/ui/field";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Loader2, CheckCircle2 } from "lucide-react";

type Profile = {
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
};

function UserAvatar({ profile }: { profile: Profile | null }) {
  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : profile?.email?.[0]?.toUpperCase() ?? "?";

  if (profile?.avatar_url) {
    return (
      <img
        src={profile.avatar_url}
        alt={profile.full_name ?? "Avatar"}
        className="w-16 h-16 rounded-full object-cover shrink-0"
      />
    );
  }

  return (
    <div className="w-16 h-16 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center shrink-0">
      <span className="text-xl font-medium text-neutral-600 dark:text-neutral-300">
        {initials}
      </span>
    </div>
  );
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data } = await supabase
  .from("profiles")
  .select("full_name, email, avatar_url")
  .eq("id", user.id)
  .maybeSingle(); // ← було .single()

      const p: Profile = data ?? { full_name: null, email: user.email ?? null, avatar_url: null };
      setProfile(p);
      setFullName(p.full_name ?? "");
      setLoading(false);
    });
  }, []);

const handleSave = async () => {
  setError(null);
  setSuccess(false);
  setSaving(true);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName })
    .eq("id", user.id);

  if (error) {
    setError("Не вдалось зберегти. Спробуйте ще раз.");
    setSaving(false);
    return;
  }

  // Рефетчимо актуальні дані з бази
  const { data } = await supabase
    .from("profiles")
    .select("full_name, email, avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  if (data) {
    setProfile(data);
    setFullName(data.full_name ?? "");
  }

  setSuccess(true);
  setTimeout(() => setSuccess(false), 3000);
  setSaving(false);
};

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 p-3 md:p-6">

          {/* header */}
          <div>
            <h1 className="text-xl font-semibold">Profile</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Manage your personal information</p>
          </div>

          {/* info card */}
          <Card className="p-5 rounded-2xl border bg-white dark:bg-muted shadow-sm">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="flex flex-col gap-5">

                {/* avatar row */}
                <div className="flex items-center gap-4 min-w-0">
                  <UserAvatar profile={profile} />
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">
                      {profile?.full_name || profile?.email?.split("@")[0] || "—"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{profile?.email}</p>
                  </div>
                </div>

                <div className="h-px bg-border" />

                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="fullName">Full name</FieldLabel>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Ivan Petrenko"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full"
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      value={profile?.email ?? ""}
                      disabled
                      className="w-full opacity-50 cursor-not-allowed"
                    />
                    <FieldDescription>Email cannot be changed</FieldDescription>
                  </Field>

                  {error && (
                    <Field>
                      <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-500">{error}</p>
                    </Field>
                  )}

                  {success && (
                    <Field>
                      <p className="rounded-lg bg-green-500/10 px-3 py-2 text-xs text-green-600 flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                        Changes saved
                      </p>
                    </Field>
                  )}

                  <Field>
                    <Button type="button" onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
                      {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                      Save changes
                    </Button>
                  </Field>
                </FieldGroup>
              </div>
            )}
          </Card>

          <div className="pb-6" />
        </div>
      </div>
    </div>
  );
}