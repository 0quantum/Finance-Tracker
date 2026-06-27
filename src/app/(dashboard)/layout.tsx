import SidebarDemo from "@/src/components/sidebar/sidebar-demo";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col md:flex-row dark:bg-muted">
      {/* <div className="flex h-screen overflow-hidden bg-neutral-100 dark:bg-neutral-900 p-2 gap-2"></div> */}
      {" "}
      <SidebarDemo />
      <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
      {/* <main className="flex flex-1 flex-col overflow-y-auto rounded-2xl bg-white dark:bg-neutral-900"></main> */}
    </div>
  );
}
