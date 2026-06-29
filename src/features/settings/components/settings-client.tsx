"use client";

import { ChangePasswordCard } from "./change-password-card";
import { ThemeCard } from "./theme-card";
import { DangerZoneCard } from "./danger-zone-card";

export default function SettingsClient() {
  return (
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
  );
}