"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";

const RolesPage = () => {
  return (
    <div className="flex flex-col h-full w-full">
      <header className="flex items-center sticky top-0 z-10 gap-4 border-b bg-white px-6 py-4">
        <SidebarTrigger />
        <h1 className="text-2xl font-bold ">Roles Management</h1>
      </header>

      <main className="flex-1 overflow-auto p-6 bg-gray-50"></main>
    </div>
  );
};

export default RolesPage;
