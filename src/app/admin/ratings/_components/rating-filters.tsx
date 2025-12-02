"use client";

import * as React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Filter, Search, ChevronDown, ChevronUp, Star } from "lucide-react";
import FilmService from "@/services/film.service";
import { IFilmPaginationRes } from "@/types/film.type";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

export interface RatingFilters {
    filmId?: string;
    isHidden?: string;
    userName?: string;
    ratingValue?: string;
}

interface RatingFiltersProps {
    filters: RatingFilters;
    onFiltersChange: (filters: RatingFilters) => void;
    onReset: () => void;
}

export function RatingFiltersComponent({
    filters,
    onFiltersChange,
    onReset,
}: RatingFiltersProps) {
    const [films, setFilms] = React.useState<IFilmPaginationRes[]>([]);
    const [loadingFilms, setLoadingFilms] = React.useState(false);
    const [searchUserName, setSearchUserName] = React.useState(filters.userName || "");
    const [isOpen, setIsOpen] = React.useState(true);

    React.useEffect(() => {
        const fetchFilms = async () => {
            setLoadingFilms(true);
            try {
                const res = await FilmService.getFilmPagination(1, 100);
                const response = res as any;
                const filmList = response.data?.result || response.result;
                if (filmList && Array.isArray(filmList)) {
                    setFilms(filmList);
                }
            } catch (error) {
                console.error("Error fetching films:", error);
            } finally {
                setLoadingFilms(false);
            }
        };
        fetchFilms();
    }, []);

    const handleFilmChange = (value: string) => {
        onFiltersChange({
            ...filters,
            filmId: value === "all" ? undefined : value,
        });
    };

    const handleStatusChange = (value: string) => {
        onFiltersChange({
            ...filters,
            isHidden: value === "all" ? undefined : value,
        });
    };

    const handleRatingChange = (value: string) => {
        onFiltersChange({
            ...filters,
            ratingValue: value === "all" ? undefined : value,
        });
    };

    const handleUserNameSearch = () => {
        onFiltersChange({
            ...filters,
            userName: searchUserName.trim() || undefined,
        });
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleUserNameSearch();
        }
    };

    const handleReset = () => {
        setSearchUserName("");
        onReset();
    };

    const hasActiveFilters = filters.filmId || filters.isHidden || filters.userName || filters.ratingValue;
    const activeFilterCount = [filters.filmId, filters.isHidden, filters.userName, filters.ratingValue].filter(Boolean).length;

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <div className="bg-white rounded-lg border shadow-sm">
                <CollapsibleTrigger asChild>
                    <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">Bộ lọc</span>
                            {activeFilterCount > 0 && (
                                <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                    {activeFilterCount}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            {hasActiveFilters && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleReset();
                                    }}
                                    className="h-7 text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                                >
                                    <X className="h-3 w-3 mr-1" />
                                    Xóa lọc
                                </Button>
                            )}
                            {isOpen ? (
                                <ChevronUp className="h-4 w-4 text-gray-400" />
                            ) : (
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                            )}
                        </div>
                    </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                    <div className="px-3 pb-3 border-t">
                        <div className="flex flex-wrap items-end gap-3 pt-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium text-gray-500">Phim</label>
                                <Select
                                    value={filters.filmId || "all"}
                                    onValueChange={handleFilmChange}
                                >
                                    <SelectTrigger className="w-[200px] h-9 bg-white">
                                        <SelectValue placeholder="Tất cả phim" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tất cả phim</SelectItem>
                                        {loadingFilms ? (
                                            <SelectItem value="loading" disabled>
                                                Đang tải...
                                            </SelectItem>
                                        ) : (
                                            films.map((film) => (
                                                <SelectItem key={film.filmId} value={film.filmId}>
                                                    {film.title}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium text-gray-500">Số sao</label>
                                <Select
                                    value={filters.ratingValue || "all"}
                                    onValueChange={handleRatingChange}
                                >
                                    <SelectTrigger className="w-[130px] h-9 bg-white">
                                        <SelectValue placeholder="Tất cả" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tất cả</SelectItem>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <SelectItem key={star} value={star.toString()}>
                                                <span className="flex items-center gap-1">
                                                    {star} <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium text-gray-500">Trạng thái</label>
                                <Select
                                    value={filters.isHidden || "all"}
                                    onValueChange={handleStatusChange}
                                >
                                    <SelectTrigger className="w-[140px] h-9 bg-white">
                                        <SelectValue placeholder="Tất cả" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tất cả</SelectItem>
                                        <SelectItem value="false">Đang hiển thị</SelectItem>
                                        <SelectItem value="true">Đã ẩn</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium text-gray-500">Người dùng</label>
                                <div className="flex items-center gap-1">
                                    <Input
                                        type="text"
                                        placeholder="Tìm theo tên..."
                                        value={searchUserName}
                                        onChange={(e) => setSearchUserName(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        className="w-40 h-9 bg-white"
                                    />
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={handleUserNameSearch}
                                        className="h-9 w-9 shrink-0"
                                    >
                                        <Search className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {hasActiveFilters && (
                            <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-dashed">
                                <span className="text-xs text-gray-400">Đang lọc:</span>
                                {filters.filmId && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-md border border-blue-200">
                                        <span className="font-medium">Phim:</span>
                                        {films.find((f) => f.filmId === filters.filmId)?.title || "..."}
                                        <button
                                            onClick={() => onFiltersChange({ ...filters, filmId: undefined })}
                                            className="ml-1 hover:text-blue-900"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </span>
                                )}
                                {filters.ratingValue && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-amber-50 text-amber-700 rounded-md border border-amber-200">
                                        <span className="font-medium">Số sao:</span>
                                        {filters.ratingValue} <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                        <button
                                            onClick={() => onFiltersChange({ ...filters, ratingValue: undefined })}
                                            className="ml-1 hover:text-amber-900"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </span>
                                )}
                                {filters.isHidden && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-yellow-50 text-yellow-700 rounded-md border border-yellow-200">
                                        <span className="font-medium">Trạng thái:</span>
                                        {filters.isHidden === "true" ? "Đã ẩn" : "Hiển thị"}
                                        <button
                                            onClick={() => onFiltersChange({ ...filters, isHidden: undefined })}
                                            className="ml-1 hover:text-yellow-900"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </span>
                                )}
                                {filters.userName && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-50 text-green-700 rounded-md border border-green-200">
                                        <span className="font-medium">Người dùng:</span>
                                        {filters.userName}
                                        <button
                                            onClick={() => {
                                                setSearchUserName("");
                                                onFiltersChange({ ...filters, userName: undefined });
                                            }}
                                            className="ml-1 hover:text-green-900"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </CollapsibleContent>
            </div>
        </Collapsible>
    );
}
