import { AppSidebar } from "@/components/admin/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SidebarProvider>
        <TooltipProvider>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <SidebarInset className="flex-1 w-full min-w-0">
              {children}
            </SidebarInset>
          </div>
        </TooltipProvider>
      </SidebarProvider>
    </>
  );
}
