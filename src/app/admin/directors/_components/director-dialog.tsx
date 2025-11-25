"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useDirectorStore } from "@/stores/directorStore";
import { CreateDirectorDto } from "@/types/director.type";
import { DirectorColumn } from "@/types/director.type";
import { allCodeService } from "@/services/allCodeService";
import { AllCodeRow } from "@/types/backend.type";

interface DirectorDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    director?: DirectorColumn | null;
    mode: "create" | "edit";
}

interface DirectorFormData {
    directorName: string;
    birthDate: string;
    genderCode: string;
    story: string;
    avatarUrl: string;
    nationalityCode: string;
}

export function DirectorDialog({
    open,
    onOpenChange,
    director,
    mode,
}: DirectorDialogProps) {
    const { createDirector, updateDirector } = useDirectorStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [countries, setCountries] = useState<AllCodeRow[]>([]);
    const [genders, setGenders] = useState<AllCodeRow[]>([]);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<DirectorFormData>({
        defaultValues: {
            directorName: "",
            birthDate: "",
            genderCode: "M",
            story: "",
            avatarUrl: "",
            nationalityCode: "",
        },
    });

    const genderCode = watch("genderCode");
    const nationalityCode = watch("nationalityCode");

    useEffect(() => {
        const fetchAllCodes = async () => {
            try {
                const [countriesRes, gendersRes] = await Promise.all([
                    allCodeService.getCountriesList(),
                    allCodeService.getGendersList(),
                ]);

                if (countriesRes?.EC === 1 && countriesRes?.data?.COUNTRY) {
                    setCountries(countriesRes.data.COUNTRY);
                }
                if (gendersRes?.EC === 1 && gendersRes?.data?.GENDER) {
                    setGenders(gendersRes.data.GENDER);
                }
            } catch (error) {
                console.error("Error fetching allcodes:", error);
            }
        };
        fetchAllCodes();
    }, []);

    useEffect(() => {
        if (director && mode === "edit") {
            reset({
                directorName: director.directorName,
                birthDate: director.birthDate,
                genderCode: director.genderCode,
                story: director.story,
                avatarUrl: director.avatarUrl,
                nationalityCode: director.nationalityCode,
            });
        } else {
            reset({
                directorName: "",
                birthDate: "",
                genderCode: "M",
                story: "",
                avatarUrl: "",
                nationalityCode: "",
            });
        }
    }, [director, mode, reset]);

    const onSubmit = async (data: DirectorFormData) => {
        setIsSubmitting(true);
        try {
            const defaultAvatar = "https://ui-avatars.com/api/?name=Director&background=random";
            const dto: CreateDirectorDto = {
                directorName: data.directorName,
                birthDate: data.birthDate || undefined,
                genderCode: data.genderCode || undefined,
                story: data.story || undefined,
                avatarUrl: data.avatarUrl?.trim() ? data.avatarUrl : defaultAvatar,
                nationalityCode: data.nationalityCode || undefined,
            };

            let success = false;
            if (mode === "create") {
                success = await createDirector(dto);
                if (success) {
                    toast.success("Thêm đạo diễn thành công!");
                } else {
                    toast.error("Thêm đạo diễn thất bại!");
                }
            } else if (director) {
                success = await updateDirector(parseInt(director.directorId), dto);
                if (success) {
                    toast.success("Cập nhật đạo diễn thành công!");
                } else {
                    toast.error("Cập nhật đạo diễn thất bại!");
                }
            }

            if (success) {
                onOpenChange(false);
                reset();
            }
        } catch (error) {
            toast.error("Đã có lỗi xảy ra!");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {mode === "create" ? "Thêm Đạo Diễn Mới" : "Chỉnh Sửa Đạo Diễn"}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === "create"
                            ? "Điền thông tin để thêm đạo diễn mới"
                            : "Cập nhật thông tin đạo diễn"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="directorName">
                            Tên Đạo Diễn <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="directorName"
                            {...register("directorName", {
                                required: "Tên đạo diễn là bắt buộc",
                            })}
                            placeholder="Nhập tên đạo diễn"
                        />
                        {errors.directorName && (
                            <p className="text-sm text-red-500">
                                {errors.directorName.message}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="birthDate">Ngày Sinh</Label>
                            <Input
                                id="birthDate"
                                type="date"
                                {...register("birthDate")}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="genderCode">Giới Tính</Label>
                            <Select
                                value={genderCode}
                                onValueChange={(value) => setValue("genderCode", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn giới tính" />
                                </SelectTrigger>
                                <SelectContent>
                                    {genders && genders.length > 0 && genders.map((gender) => (
                                        <SelectItem key={gender.keyMap} value={gender.keyMap}>
                                            {gender.valueVi}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="nationalityCode">Quốc Tịch</Label>
                        <Select
                            value={nationalityCode}
                            onValueChange={(value) => setValue("nationalityCode", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn quốc tịch" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                                {countries && countries.length > 0 && countries.map((country) => (
                                    <SelectItem key={country.keyMap} value={country.keyMap}>
                                        {country.valueVi}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="avatarUrl">URL Avatar</Label>

                        <Input
                            id="avatarUrl"
                            {...register("avatarUrl")}
                            placeholder="https://example.com/avatar.jpg"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="story">Tiểu Sử</Label>
                        <Textarea
                            id="story"
                            {...register("story")}
                            placeholder="Nhập tiểu sử đạo diễn..."
                            rows={5}
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Hủy
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                            {isSubmitting
                                ? "Đang xử lý..."
                                : mode === "create"
                                    ? "Thêm Đạo Diễn"
                                    : "Cập Nhật"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
