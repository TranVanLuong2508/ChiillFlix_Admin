"use client";

import { StatCard } from "@/components/admin/dashboard/StatCard";
import { FilmPieChart } from "@/components/admin/dashboard/FilmPieChart";
import { Users, DollarSign, Film } from "lucide-react";
import UserService from "@/services/userService";
import { useEffect, useState } from "react";
import PaymentService from "@/services/paymentService";
import { IPayment } from "@/types/payment.type";



export default function AdminDashboard() {

  const [totalUsers, setTotalUser] = useState(0);
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const stats = {
    filmsByGenre: [
      { name: "Hành động", value: 45 },
      { name: "Tâm lý", value: 30 },
      { name: "Hài", value: 25 },
      { name: "Kinh dị", value: 20 },
      { name: "Sci-Fi", value: 15 },
    ],
    filmsByAgeRating: [
      { name: "P - Mọi lứa tuổi", value: 50 },
      { name: "C13 - Trên 13 tuổi", value: 40 },
      { name: "C16 - Trên 16 tuổi", value: 30 },
      { name: "C18 - Trên 18 tuổi", value: 15 },
    ],
    filmsByCountry: [
      { name: "Việt Nam", value: 35 },
      { name: "Hàn Quốc", value: 40 },
      { name: "Mỹ", value: 50 },
      { name: "Nhật Bản", value: 25 },
      { name: "Trung Quốc", value: 20 },
    ],
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const fetchUserData = async () => {
    try {
      const res = await UserService.CallGetAllUserList();
      if (res?.EC === 1 && res.data?.users) {
        setTotalUser(res.data.users.length);
      }
    } catch (error) {
      console.log("Error loading total user:", error);
    }
  };

  const fetchPaymentData = async () => {
    try {
      const res = await PaymentService.CallGetPaymentList();

      if (res && res.EC === 1 && res.data) {
        const paymentsData = res.data.payments ?? [];
        setPayments(paymentsData);

        // Calculate total revenue from all payments
        const revenue = paymentsData.reduce((sum: number, payment: IPayment) => {
          return sum + (parseFloat(payment.amount) || 0);
        }, 0);
        setTotalRevenue(revenue);
      }
    } catch (error) {
      console.log("Error from fetch payment data <<PayementTable>>: ", error);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchPaymentData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Tổng quan thống kê hệ thống
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Tổng số người dùng"
          value={totalUsers.toLocaleString()}
          icon={Users}
          description="Người dùng đã đăng ký"
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatCard
          title="Doanh thu"
          value={formatCurrency(totalRevenue)}
          icon={DollarSign}
          description="Tổng doanh thu từ gói đăng ký"
          trend={{ value: 8.2, isPositive: true }}
        />
        <StatCard
          title="Tổng số phim"
          value={stats.filmsByGenre
            .reduce((sum, item) => sum + item.value, 0)
            .toLocaleString()}
          icon={Film}
          description="Phim có sẵn trên nền tảng"
        />
      </div>

      {/* Pie Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <FilmPieChart
          title="Phim theo thể loại"
          description="Phân bổ phim theo thể loại"
          data={stats.filmsByGenre}
        />
        <FilmPieChart
          title="Phim theo độ tuổi"
          description="Phân loại phim theo độ tuổi"
          data={stats.filmsByAgeRating}
        />
        <FilmPieChart
          title="Phim theo quốc gia"
          description="Phân bổ phim theo quốc gia sản xuất"
          data={stats.filmsByCountry}
        />
      </div>
    </div>
  );
}
