import { AppSidebar } from "@/components/admin/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import "../globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />

      <SidebarInset className="flex-1 w-full min-w-0">{children}</SidebarInset>
    </div>
  );
}
