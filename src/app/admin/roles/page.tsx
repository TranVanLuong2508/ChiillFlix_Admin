"use client";

import AdminHeader from "@/components/admin/layout/AdminHeader";
import AccountDropDown from "@/components/admin/layout/AdminHeader";
import { SidebarTrigger } from "@/components/ui/sidebar";

const RolesPage = () => {
  return (
    <div className="flex flex-col h-full w-full">
      <AdminHeader />

      <main className="flex-1 overflow-auto p-6 bg-gray-50"></main>
    </div>
  );
};

export default RolesPage;
