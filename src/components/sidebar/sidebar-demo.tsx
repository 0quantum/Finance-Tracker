"use client";

import React, { useEffect, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconHandStop,
  IconWallet,
  IconTrendingUp,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { supabase } from "@/src/lib/supabase/browser";
import { useSidebar } from "./sidebar";

type Profile = {
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
};

function UserAvatar({
  profile,
  size = 28,
}: {
  profile: Profile | null;
  size?: number;
}) {
  const initials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : (profile?.email?.[0]?.toUpperCase() ?? "?");

  if (profile?.avatar_url) {
    return (
      <img
        src={profile.avatar_url}
        alt={profile.full_name ?? "Avatar"}
        style={{ width: size, height: size }}
        className="rounded-full object-cover shrink-0"
      />
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center shrink-0"
    >
      <span className="text-xs font-medium text-neutral-600 dark:text-neutral-300">
        {initials}
      </span>
    </div>
  );
}

function LogoutButton() {
  const { open } = useSidebar();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center justify-start gap-2 group/sidebar py-2 w-full text-left"
    >
      <IconArrowLeft className="h-5 w-5 text-neutral-600 dark:text-neutral-300 shrink-0" />
      <motion.span
        animate={{
          display: open ? "inline-block" : "none",
          opacity: open ? 1 : 0,
        }}
        className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre !p-0 !m-0"
      >
        Вийти
      </motion.span>
    </button>
  );
}

const links = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <IconBrandTabler className="h-5 w-5 text-neutral-600 dark:text-neutral-300" />
    ),
  },
  {
    label: "Рахунки",
    href: "/accounts",
    icon: (
      <IconWallet className="h-5 w-5 text-neutral-600 dark:text-neutral-300" />
    ),
  },
  {
    label: "Борги",
    href: "/debts",
    icon: (
      <IconHandStop className="h-5 w-5 text-neutral-600 dark:text-neutral-300" />
    ),
  },
  {
    label: "Інвестиції",
    href: "/investment",
    icon: (
      <IconTrendingUp className="h-5 w-5 text-neutral-600 dark:text-neutral-300" />
    ),
  },
  {
    label: "Профіль",
    href: "/profile",
    icon: (
      <IconUserBolt className="h-5 w-5 text-neutral-600 dark:text-neutral-300" />
    ),
  },
  {
    label: "Налаштування",
    href: "/settings",
    icon: (
      <IconSettings className="h-5 w-5 text-neutral-600 dark:text-neutral-300" />
    ),
  },
];
export default function SidebarDemo() {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("full_name, email, avatar_url")
        .eq("id", user.id)
        .single();

      setProfile(
        data ?? {
          full_name: null,
          email: user.email ?? null,
          avatar_url: null,
        },
      );
    });
  }, []);

  const displayName =
    profile?.full_name || profile?.email?.split("@")[0] || "Завантаження...";

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
          {open ? <Logo /> : <LogoIcon />}

          <div className="mt-8 flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
            <LogoutButton />
          </div>
        </div>

        <SidebarLink
          link={{
            label: displayName,
            href: "/profile",
            icon: <UserAvatar profile={profile} size={28} />,
          }}
        />
      </SidebarBody>
    </Sidebar>
  );
}

export const Logo = () => (
  <a
    href="/dashboard"
    className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal"
  >
    <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="font-medium whitespace-pre text-black dark:text-white"
    >
      FinanceApp
    </motion.span>
  </a>
);

export const LogoIcon = () => (
  <a
    href="/dashboard"
    className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal"
  >
    <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
  </a>
);
