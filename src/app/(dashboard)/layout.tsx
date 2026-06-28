import SidebarDemo from "@/src/components/sidebar/sidebar-demo";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh flex-col md:flex-row bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
      <SidebarDemo />
      <main className="flex flex-1 flex-col min-h-0 md:p-2 md:pl-0">
        {children}
      </main>
    </div>
  );
}
