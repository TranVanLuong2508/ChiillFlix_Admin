"use client";

import { useEffect } from "react";
import { useCommentStore } from "@/stores/commentStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, TrendingUp, Users, BarChart3, Eye, EyeOff } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { socket } from "@/lib/socket";

export function Statistics() {
    const { statistics, loading, fetchStatistics } = useCommentStore();

    useEffect(() => {
        fetchStatistics();
    }, [fetchStatistics]);

    // Cập nhật realtime khi có thay đổi comment
    useEffect(() => {
        const handleCommentChange = () => {
            fetchStatistics();
        };

        socket.on('newComment', handleCommentChange);
        socket.on('deleteComment', handleCommentChange);
        socket.on('hideComment', handleCommentChange);
        socket.on('unhideComment', handleCommentChange);

        return () => {
            socket.off('newComment', handleCommentChange);
            socket.off('deleteComment', handleCommentChange);
            socket.off('hideComment', handleCommentChange);
            socket.off('unhideComment', handleCommentChange);
        };
    }, [fetchStatistics]);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <Skeleton className="h-4 w-[100px]" />
                                <Skeleton className="h-4 w-4" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-8 w-[60px] mb-2" />
                                <Skeleton className="h-3 w-[120px]" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (!statistics) {
        return <div className="text-center py-8 text-gray-500">Không có dữ liệu thống kê</div>;
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng bình luận</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{statistics.totalComments?.toLocaleString() || 0}</div>
                        <p className="text-xs text-muted-foreground">Tất cả bình luận trong hệ thống</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bình luận hiển thị</CardTitle>
                        <Eye className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{statistics.visibleComments?.toLocaleString() || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            {statistics.totalComments > 0
                                ? ((statistics.visibleComments / statistics.totalComments) * 100).toFixed(1)
                                : 0}% tổng số
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-orange-200 bg-orange-50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-orange-700">Bình luận bị ẩn</CardTitle>
                        <EyeOff className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{statistics.hiddenComments?.toLocaleString() || 0}</div>
                        <p className="text-xs text-orange-600/70">
                            {statistics.totalComments > 0
                                ? ((statistics.hiddenComments / statistics.totalComments) * 100).toFixed(1)
                                : 0}% tổng số
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Người dùng hoạt động</CardTitle>
                        <Users className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{statistics.activeUsers?.toLocaleString() || 0}</div>
                        <p className="text-xs text-muted-foreground">Đã bình luận ít nhất 1 lần</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Top 10 phim nhiều bình luận nhất</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {(statistics.mostCommented || []).slice(0, 10).map((film: any, index: number) => (
                                <div key={film.filmId} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 flex-1">
                                        <span className="text-xs font-bold text-gray-400 w-6">{index + 1}</span>
                                        <span className="text-sm truncate">{film.title}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MessageSquare className="h-3 w-3 text-blue-500" />
                                        <span className="text-sm font-semibold">{film.totalComments} bình luận</span>
                                    </div>
                                </div>
                            ))}
                            {(!statistics.mostCommented || statistics.mostCommented.length === 0) && (
                                <div className="text-center py-4 text-gray-400 text-sm">Chưa có dữ liệu</div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Top 10 người dùng bình luận nhiều nhất</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {(statistics.topCommenters || []).slice(0, 10).map((user: any, index: number) => (
                                <div key={user.userId} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 flex-1">
                                        <span className="text-xs font-bold text-gray-400 w-6">{index + 1}</span>
                                        <div className="flex items-center gap-2">
                                            {user.avatarUrl && (
                                                <img
                                                    src={user.avatarUrl}
                                                    alt={user.fullName}
                                                    className="w-6 h-6 rounded-full object-cover"
                                                />
                                            )}
                                            <span className="text-sm truncate">{user.fullName}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MessageSquare className="h-3 w-3 text-blue-500" />
                                        <span className="text-sm font-semibold">{user.totalComments} bình luận</span>
                                    </div>
                                </div>
                            ))}
                            {(!statistics.topCommenters || statistics.topCommenters.length === 0) && (
                                <div className="text-center py-4 text-gray-400 text-sm">Chưa có dữ liệu</div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Bình luận có nhiều phản hồi nhất</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {(statistics.mostReplied || []).slice(0, 10).map((comment: any, index: number) => (
                            <div key={comment.commentId} className="border-b pb-3 last:border-0">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-gray-400">{index + 1}</span>
                                        <div>
                                            <span className="text-sm font-medium">{comment.user?.fullName}</span>
                                            <span className="text-xs text-gray-500 ml-2">
                                                trong phim "{comment.film?.title}"
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-blue-600">
                                        <TrendingUp className="h-3 w-3" />
                                        <span className="text-sm font-semibold">{comment.totalChildrenComment} phản hồi</span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-2 ml-6">
                                    {comment.content}
                                </p>
                            </div>
                        ))}
                        {(!statistics.mostReplied || statistics.mostReplied.length === 0) && (
                            <div className="text-center py-4 text-gray-400 text-sm">Chưa có dữ liệu</div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
