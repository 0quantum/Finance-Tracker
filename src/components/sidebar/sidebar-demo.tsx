"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import Dashboard from "../../app/(dashboard)/dashboard/page";

export default function SidebarDemo() {
  const [open, setOpen] = useState(false);

  const links = [
    { label: "Dashboard", href: "/", icon: <IconBrandTabler className="h-5 w-5" /> },
    { label: "Profile", href: "/profile", icon: <IconUserBolt className="h-5 w-5" /> },
    { label: "Settings", href: "/settings", icon: <IconSettings className="h-5 w-5" /> },
    { label: "Logout", href: "#", icon: <IconArrowLeft className="h-5 w-5" /> },
  ];

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
          {open ? <Logo /> : <LogoIcon />}

          <div className="mt-8 flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>
        </div>

        <SidebarLink
          link={{
            label: "Manu Arora",
            href: "#",
            icon: (
              <img
                src="https://assets.aceternity.com/manu.png"
                className="h-7 w-7 rounded-full"
                alt="Avatar"
              />
            ),
          }}
        />
      </SidebarBody>
    </Sidebar>
  );
}
export const Logo = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white"
      >
        Acet Labs
      </motion.span>
    </a>
  );
};
export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    </a>
  );
};
