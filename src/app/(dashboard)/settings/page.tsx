import SettingsClient from "@/src/features/settings/components/settings-client";

export default function SettingsPage() {
  return (
    <div className="flex-1 overflow-y-auto scrollbar-none rounded-tl-2xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
      <SettingsClient />
    </div>
  );
}