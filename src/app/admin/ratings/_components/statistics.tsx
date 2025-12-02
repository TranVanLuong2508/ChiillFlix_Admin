"use client";

import { useEffect } from "react";
import { useRatingStore } from "@/stores/ratingStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, TrendingUp, Users, BarChart3, EyeOff } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { socket } from "@/lib/socket";

export function Statistics() {
    const { statistics, loading, fetchStatistics } = useRatingStore();

    useEffect(() => {
        fetchStatistics();
    }, [fetchStatistics]);
    useEffect(() => {
        const handleRatingChange = () => {
            fetchStatistics();
        };

        socket.on('ratingUpdated', handleRatingChange);
        socket.on('ratingDeleted', handleRatingChange);
        socket.on('hideRating', handleRatingChange);

        return () => {
            socket.off('ratingUpdated', handleRatingChange);
            socket.off('ratingDeleted', handleRatingChange);
            socket.off('hideRating', handleRatingChange);
        };
    }, [fetchStatistics]);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-5">
                    {[...Array(5)].map((_, i) => (
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

    const distributionData = statistics.distribution || {};
    const maxDistribution = Math.max(...Object.values(distributionData).map((v: any) => Number(v)));
    const hiddenRatings = statistics.hiddenRatings || 0;
    const totalWithHidden = statistics.totalRatings + hiddenRatings;

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-5">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng đánh giá</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{statistics.totalRatings.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Đánh giá đang hiển thị</p>
                    </CardContent>
                </Card>

                <Card className="border-orange-200 bg-orange-50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-orange-700">Đánh giá bị ẩn</CardTitle>
                        <EyeOff className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{hiddenRatings.toLocaleString()}</div>
                        <p className="text-xs text-orange-600/70">
                            {totalWithHidden > 0 ? ((hiddenRatings / totalWithHidden) * 100).toFixed(1) : 0}% tổng số
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Điểm trung bình</CardTitle>
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{statistics.averageRating.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">Đánh giá trung bình tất cả phim</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Đánh giá 5 sao</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{distributionData['5'] || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            {statistics.totalRatings > 0 ? ((distributionData['5'] / statistics.totalRatings) * 100).toFixed(1) : 0}% tổng số
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Đánh giá 1 sao</CardTitle>
                        <Users className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{distributionData['1'] || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            {statistics.totalRatings > 0 ? ((distributionData['1'] / statistics.totalRatings) * 100).toFixed(1) : 0}% tổng số
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Phân bổ đánh giá</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[5, 4, 3, 2, 1].map((stars) => {
                                const count = distributionData[stars.toString()] || 0;
                                const percentage = (count / statistics.totalRatings) * 100;
                                const barWidth = maxDistribution > 0 ? (count / maxDistribution) * 100 : 0;

                                return (
                                    <div key={stars} className="flex items-center gap-3">
                                        <div className="flex items-center gap-1 w-20">
                                            <span className="text-sm font-medium">{stars}</span>
                                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                        </div>
                                        <div className="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500 transition-all"
                                                style={{ width: `${barWidth}%` }}
                                            />
                                        </div>
                                        <div className="w-16 text-right">
                                            <span className="text-sm font-medium">{count}</span>
                                            <span className="text-xs text-gray-500 ml-1">({percentage.toFixed(1)}%)</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Top 10 phim đánh giá cao nhất</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {(statistics.topRated || []).slice(0, 10).map((film: any, index: number) => (
                                <div key={film.filmId} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 flex-1">
                                        <span className="text-xs font-bold text-gray-400 w-6">{index + 1}</span>
                                        <span className="text-sm truncate">{film.title}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1">
                                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                            <span className="text-sm font-semibold">{film.averageRating.toFixed(2)}</span>
                                        </div>
                                        <span className="text-xs text-gray-500">({film.totalRatings})</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Top 10 phim nhiều đánh giá nhất</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {(statistics.mostRated || []).slice(0, 10).map((film: any, index: number) => (
                            <div key={film.filmId} className="flex items-center justify-between">
                                <div className="flex items-center gap-3 flex-1">
                                    <span className="text-xs font-bold text-gray-400 w-6">{index + 1}</span>
                                    <span className="text-sm truncate">{film.title}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold">{film.totalRatings} đánh giá</span>
                                    <div className="flex items-center gap-1 text-gray-500">
                                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                        <span className="text-xs">{film.averageRating.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
