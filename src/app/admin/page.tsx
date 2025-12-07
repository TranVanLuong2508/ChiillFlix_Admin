"use client";

import { StatCard } from "@/components/admin/dashboard/StatCard";
import { FilmPieChart } from "@/components/admin/dashboard/FilmPieChart";
import { Users, DollarSign, Film } from "lucide-react";
import UserService from "@/services/userService";
import { useEffect, useState } from "react";
import PaymentService from "@/services/paymentService";
import { IPayment } from "@/types/payment.type";
import FilmService from "@/services/film.service";
import _ from "lodash";
import { FilmPieChartData } from "@/types/dashboard.type";

export default function AdminDashboard() {
  const [totalUsers, setTotalUser] = useState(0);
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [filmsByGenre, setFilmsByGenre] = useState<FilmPieChartData[]>([]);
  const [filmsByCountry, setFilmsByCountry] = useState<FilmPieChartData[]>([]);
  const [filmsByAgeRating, setFilmsByAgeRating] = useState<FilmPieChartData[]>([]);

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

        const revenue = paymentsData.reduce((sum: number, payment: IPayment) => {
          return sum + (parseFloat(payment.amount) || 0);
        }, 0);
        setTotalRevenue(revenue);
      }
    } catch (error) {
      console.log("Error from fetch payment data <<PayementTable>>: ", error);
    }
  };

  const fetchFilmAndGenre = async () => {
    try {
      const [genreRes, countryRes, ageRes] = await Promise.all([
        FilmService.getFilmListByGenreForDashBoard(),
        FilmService.getFilmListByCountryForDashBoard(),
        FilmService.getFilmListByAgeForDashBoard(),
      ]);
      if (genreRes && genreRes.EC === 1 && countryRes && countryRes.EC === 1) {
        setFilmsByGenre(buildDataForFilm(genreRes.data.result, "genre"));
        setFilmsByCountry(buildDataForFilm(countryRes.data.result, "country"));
        setFilmsByAgeRating(buildDataForFilm(groupBy(ageRes.data.result), "age"));
      }
    } catch (error) {
      console.log("Error from fetch payment data fetch film by genre: ", error);
    }
  };

  const buildDataForFilm = (data: any, type: string): FilmPieChartData[] => {
    const result: FilmPieChartData[] = [];
    console.log("Check data input", data);
    data.forEach((e: any) => {
      result.push({ name: e[type], value: e.filmList.length });
    });
    return result;
  };

  const groupBy = (data: any) => {
    return _(data)
      .groupBy((x) => x.age)
      .map((value, key) => {
        let arrayFilm: any = [];
        value.forEach((item) => {
          arrayFilm.push(item.film);
        });
        return {
          age: key,
          filmList: arrayFilm,
        };
      })
      .value();
  };

  useEffect(() => {
    fetchUserData();
    fetchPaymentData();
    fetchFilmAndGenre();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Tổng quan thống kê hệ thống</p>
      </div>

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
          value={totalRevenue}
          icon={DollarSign}
          description="Tổng doanh thu từ gói đăng ký"
          isCurrency={true}
          trend={{ value: 8.2, isPositive: true }}
        />
        <StatCard
          title="Tổng số phim"
          value={filmsByGenre.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
          icon={Film}
          description="Phim có sẵn trên nền tảng"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <FilmPieChart title="Phim theo thể loại" description="Phân bổ phim theo thể loại" data={filmsByGenre} />
        <FilmPieChart title="Phim theo độ tuổi" description="Phân loại phim theo độ tuổi" data={filmsByAgeRating} />
        <FilmPieChart
          title="Phim theo quốc gia"
          description="Phân bổ phim theo quốc gia sản xuất"
          data={filmsByCountry}
        />
      </div>
    </div>
  );
}
