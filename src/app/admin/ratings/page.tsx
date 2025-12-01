"use client";

import { useEffect, useState } from "react";
import { PaginationState } from "@tanstack/react-table";
import AdminHeader from "@/components/admin/layout/AdminHeader";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { useRatingStore } from "@/stores/ratingStore";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportsTable } from "./_components/reports-table";
import { Statistics } from "./_components/statistics";
import { useSearchParams, useRouter } from "next/navigation";
import { socket } from "@/lib/socket";

const RatingsPage = () => {
    const { ratings, meta, loading, fetchRatings } = useRatingStore();
    const searchParams = useSearchParams();
    const router = useRouter();
    const tabParam = searchParams.get("tab");

    const [activeTab, setActiveTab] = useState<"ratings" | "reports" | "statistics">("ratings");

    useEffect(() => {
        if (tabParam === "ratings" || tabParam === "reports" || tabParam === "statistics") {
            setActiveTab(tabParam);
        }
    }, [tabParam]);

    const handleTabChange = (value: string) => {
        setActiveTab(value as "ratings" | "reports" | "statistics");
        router.push(`/admin/ratings?tab=${value}`);
    };

    const [pagination, setPagination] = useState<PaginationState>(() => {
        return { pageIndex: 0, pageSize: 10 };
    });

    const pageCount = meta ? meta.totalPages : 0;

    useEffect(() => {
        if (activeTab === "ratings") {
            const page = pagination.pageIndex + 1;
            const limit = pagination.pageSize;
            fetchRatings(page, limit);
        }
    }, [pagination.pageIndex, pagination.pageSize, activeTab, fetchRatings]);

    // Socket listeners for realtime updates
    useEffect(() => {
        const handleNewRating = () => {
            if (activeTab === "ratings") {
                const page = pagination.pageIndex + 1;
                const limit = pagination.pageSize;
                fetchRatings(page, limit);
            }
        };

        const handleUpdateRating = () => {
            if (activeTab === "ratings") {
                const page = pagination.pageIndex + 1;
                const limit = pagination.pageSize;
                fetchRatings(page, limit);
            }
        };

        const handleDeleteRating = () => {
            if (activeTab === "ratings") {
                const page = pagination.pageIndex + 1;
                const limit = pagination.pageSize;
                fetchRatings(page, limit);
            }
        };

        const handleHideRating = () => {
            if (activeTab === "ratings") {
                const page = pagination.pageIndex + 1;
                const limit = pagination.pageSize;
                fetchRatings(page, limit);
            }
        };

        socket.on('ratingUpdated', handleNewRating);
        socket.on('ratingDeleted', handleDeleteRating);
        socket.on('hideRating', handleHideRating);

        return () => {
            socket.off('ratingUpdated', handleNewRating);
            socket.off('ratingDeleted', handleDeleteRating);
            socket.off('hideRating', handleHideRating);
        };
    }, [activeTab, pagination.pageIndex, pagination.pageSize, fetchRatings]);

    return (
        <div className="flex flex-col h-full w-full">
            <AdminHeader />
            <main className="flex-1 overflow-auto p-6 bg-gray-50">
                <Tabs value={activeTab} onValueChange={handleTabChange}>
                    <TabsList className="mb-4">
                        <TabsTrigger value="ratings">Tất cả đánh giá</TabsTrigger>
                        <TabsTrigger value="reports">Báo cáo</TabsTrigger>
                        <TabsTrigger value="statistics">Thống kê</TabsTrigger>
                    </TabsList>

                    <TabsContent value="ratings">
                        <div className="space-y-4">
                            {loading ? (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Skeleton className="h-10 w-[300px]" />
                                        <Skeleton className="h-10 w-[140px]" />
                                    </div>

                                    <div className="rounded-md border">
                                        <div className="border-b bg-muted/50 p-4">
                                            <div className="flex items-center gap-4">
                                                <Skeleton className="h-4 w-4" />
                                                <Skeleton className="h-4 w-[100px]" />
                                                <Skeleton className="h-4 w-[150px]" />
                                                <Skeleton className="h-4 w-[120px]" />
                                            </div>
                                        </div>

                                        {Array.from({ length: 8 }).map((_, i) => (
                                            <div key={i} className="border-b p-4 last:border-0">
                                                <div className="flex items-center gap-4">
                                                    <Skeleton className="h-4 w-4" />
                                                    <Skeleton className="h-4 w-[100px]" />
                                                    <Skeleton className="h-4 w-[150px]" />
                                                    <Skeleton className="h-4 w-[120px]" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <Skeleton className="h-8 w-[250px]" />
                                        <div className="flex gap-2">
                                            <Skeleton className="h-8 w-[100px]" />
                                            <Skeleton className="h-8 w-[70px]" />
                                            <Skeleton className="h-8 w-[70px]" />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <DataTable
                                    columns={columns}
                                    data={ratings}
                                    hiddenColumns={["ratingId"]}
                                    pagination={pagination}
                                    pageCount={pageCount}
                                    setPagination={setPagination}
                                    searchPlaceholder="Tìm theo tên người dùng..."
                                />
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="reports">
                        <ReportsTable />
                    </TabsContent>

                    <TabsContent value="statistics">
                        <Statistics />
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
};

export default RatingsPage;
