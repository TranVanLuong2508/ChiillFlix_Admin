"use client";

import AdminHeader from "@/components/admin/layout/AdminHeader";
import { PaymentTable } from "@/components/admin/payments/table/PaymentTable";

const PaymentsPage = () => {
  return (
    <div className="flex flex-col h-full w-full">
      <AdminHeader />

      <main className="flex-1 overflow-auto p-6 bg-gray-50">
        <PaymentTable />
      </main>
    </div>
  );
};

export default PaymentsPage;
