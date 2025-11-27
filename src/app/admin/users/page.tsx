"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, Mail, Ban, User } from "lucide-react";
import { usersData } from "@/data/user";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores/authStore";
import AdminHeader from "@/components/admin/layout/AdminHeader";
import { SquarePen, Trash2 } from "lucide-react";
import { UserTable } from "@/components/admin/users/table/UserTable";

const UsersPage = () => {
  const { authUser, isAuthenticated } = useAuthStore();
  console.log("chek isAuthenticated", isAuthenticated);
  return (
    <div className="flex flex-col h-full w-full">
      <AdminHeader />
      <main className="flex-1 overflow-auto p-6 bg-gray-50">
        <UserTable />
      </main>
    </div>
  );
};

export default UsersPage;
