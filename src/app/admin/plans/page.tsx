"use client";

import AdminHeader from "@/components/admin/layout/AdminHeader";
import { PlanTable } from "@/components/admin/plans/table/PlanTable";

const VipPlanPage = () => {

  return (
    <div className="flex flex-col h-full w-full">
      <AdminHeader />

      <main className="flex-1 overflow-auto p-6 bg-gray-50">
        <PlanTable />
      </main>
    </div>
  );
};

export default VipPlanPage;
