"use client";

import { useEffect, useState, useCallback } from "react";
import { PaginationState } from "@tanstack/react-table";
import AdminHeader from "@/components/admin/layout/AdminHeader";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { useCommentStore } from "@/stores/commentStore";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportsTable } from "./_components/reports-table";
import { Statistics } from "./_components/statistics";
import { useSearchParams, useRouter } from "next/navigation";
import { socket } from "@/lib/socket";
import { CommentFiltersComponent, CommentFilters } from "./_components/comment-filters";

const CommentsPage = () => {
    const { comments, meta, loading, fetchComments, deleteComment } = useCommentStore();
    const searchParams = useSearchParams();
    const router = useRouter();
    const tabParam = searchParams.get("tab");

    const [activeTab, setActiveTab] = useState<"comments" | "reports" | "statistics">("comments");
    const [filters, setFilters] = useState<CommentFilters>({});

    useEffect(() => {
        if (tabParam === "reports" || tabParam === "comments" || tabParam === "statistics") {
            setActiveTab(tabParam);
        }
    }, [tabParam]);

    const handleTabChange = (value: string) => {
        setActiveTab(value as "comments" | "reports" | "statistics");
        router.push(`/admin/comments?tab=${value}`);
    };

    const [pagination, setPagination] = useState<PaginationState>(() => {
        return { pageIndex: 0, pageSize: 10 };
    });

    const pageCount = meta ? meta.totalPages : 0;

    const handleFiltersChange = useCallback((newFilters: CommentFilters) => {
        setFilters(newFilters);
        setPagination((prev) => ({ ...prev, pageIndex: 0 })); 
    }, []);

    const handleResetFilters = useCallback(() => {
        setFilters({});
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }, []);

    useEffect(() => {
        if (activeTab === "comments") {
            const page = pagination.pageIndex + 1;
            const limit = pagination.pageSize;
            const apiFilter: Record<string, any> = {};
            if (filters.filmId) apiFilter.filmId = filters.filmId;
            if (filters.isHidden) apiFilter.isHidden = filters.isHidden === "true";
            if (filters.userName) apiFilter.userName = filters.userName;

            fetchComments(page, limit, undefined, Object.keys(apiFilter).length > 0 ? apiFilter : undefined);
        }
    }, [pagination.pageIndex, pagination.pageSize, activeTab, filters, fetchComments]);

    useEffect(() => {
        const handleNewComment = () => {
            if (activeTab === "comments") {
                const page = pagination.pageIndex + 1;
                const limit = pagination.pageSize;

                const apiFilter: Record<string, any> = {};
                if (filters.filmId) apiFilter.filmId = filters.filmId;
                if (filters.isHidden) apiFilter.isHidden = filters.isHidden === "true";
                if (filters.userName) apiFilter.userName = filters.userName;

                fetchComments(page, limit, undefined, Object.keys(apiFilter).length > 0 ? apiFilter : undefined);
            }
        };

        const handleUpdateComment = () => {
            if (activeTab === "comments") {
                const page = pagination.pageIndex + 1;
                const limit = pagination.pageSize;

                const apiFilter: Record<string, any> = {};
                if (filters.filmId) apiFilter.filmId = filters.filmId;
                if (filters.isHidden) apiFilter.isHidden = filters.isHidden === "true";
                if (filters.userName) apiFilter.userName = filters.userName;

                fetchComments(page, limit, undefined, Object.keys(apiFilter).length > 0 ? apiFilter : undefined);
            }
        };

        const handleDeleteComment = () => {
            if (activeTab === "comments") {
                const page = pagination.pageIndex + 1;
                const limit = pagination.pageSize;

                const apiFilter: Record<string, any> = {};
                if (filters.filmId) apiFilter.filmId = filters.filmId;
                if (filters.isHidden) apiFilter.isHidden = filters.isHidden === "true";
                if (filters.userName) apiFilter.userName = filters.userName;

                fetchComments(page, limit, undefined, Object.keys(apiFilter).length > 0 ? apiFilter : undefined);
            }
        };

        const handleHideComment = () => {
            if (activeTab === "comments") {
                const page = pagination.pageIndex + 1;
                const limit = pagination.pageSize;

                const apiFilter: Record<string, any> = {};
                if (filters.filmId) apiFilter.filmId = filters.filmId;
                if (filters.isHidden) apiFilter.isHidden = filters.isHidden === "true";
                if (filters.userName) apiFilter.userName = filters.userName;

                fetchComments(page, limit, undefined, Object.keys(apiFilter).length > 0 ? apiFilter : undefined);
            }
        };

        socket.on('newComment', handleNewComment);
        socket.on('updateComment', handleUpdateComment);
        socket.on('deleteComment', handleDeleteComment);
        socket.on('hideComment', handleHideComment);
        socket.on('unhideComment', handleUpdateComment);

        return () => {
            socket.off('newComment', handleNewComment);
            socket.off('updateComment', handleUpdateComment);
            socket.off('deleteComment', handleDeleteComment);
            socket.off('hideComment', handleHideComment);
            socket.off('unhideComment', handleUpdateComment);
        };
    }, [activeTab, pagination.pageIndex, pagination.pageSize, filters, fetchComments]);

    const handleDeleteSelected = async (ids: string[]) => {
        for (const id of ids) {
            await deleteComment(id);
        }
    };

    return (
        <div className="flex flex-col h-full w-full">
            <AdminHeader />
            <main className="flex-1 overflow-auto p-6 bg-gray-50">
                <Tabs value={activeTab} onValueChange={handleTabChange}>
                    <TabsList className="mb-4">
                        <TabsTrigger value="comments">Tất cả bình luận</TabsTrigger>
                        <TabsTrigger value="reports">Báo cáo</TabsTrigger>
                        <TabsTrigger value="statistics">Thống kê</TabsTrigger>
                    </TabsList>

                    <TabsContent value="comments">
                        <div className="space-y-4">
                            <CommentFiltersComponent
                                filters={filters}
                                onFiltersChange={handleFiltersChange}
                                onReset={handleResetFilters}
                            />

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
                                                <Skeleton className="h-4 w-[100px]" />
                                            </div>
                                        </div>

                                        {Array.from({ length: 8 }).map((_, i) => (
                                            <div key={i} className="border-b p-4 last:border-0">
                                                <div className="flex items-center gap-4">
                                                    <Skeleton className="h-4 w-4" />
                                                    <Skeleton className="h-4 w-[100px]" />
                                                    <Skeleton className="h-4 w-[150px]" />
                                                    <Skeleton className="h-4 w-[120px]" />
                                                    <Skeleton className="h-4 w-[100px]" />
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
                                    data={comments}
                                    pagination={pagination}
                                    pageCount={pageCount}
                                    hiddenColumns={["commentId", "totalChildrenComment"]}
                                    setPagination={setPagination}
                                    searchPlaceholder="Tìm theo tên người dùng..."
                                    onDeleteSelected={handleDeleteSelected}
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

export default CommentsPage;