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
import { ActorColumn, CreateActorDto } from "@/types/actor.type";
import { DirectorColumn } from "@/types/director.type";
import { allCodeService } from "@/services/allCodeService";
import { AllCodeRow } from "@/types/backend.type";
import { useActorStore } from "@/stores/actorStore";

interface ActorDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    actor?: ActorColumn | null;
    mode: "create" | "edit";
}

interface ActorFormData {
    actorName: string;
    birthDate: string;
    genderCode: string;
    shortBio: string;
    avatarUrl: string;
    nationalityCode: string;
}

export function ActorDialog({
    open,
    onOpenChange,
    actor,
    mode,
}: ActorDialogProps) {
    const { createActor, updateActor } = useActorStore();
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
    } = useForm<ActorFormData>({
        defaultValues: {
            actorName: "",
            birthDate: "",
            genderCode: "M",
            shortBio: "",
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
        if (actor && mode === "edit") {
            reset({
                actorName: actor.actorName,
                birthDate: actor.birthDate,
                genderCode: actor.genderCode,
                shortBio: actor.shortBio,
                avatarUrl: actor.avatarUrl,
                nationalityCode: actor.nationalityCode,
            });
        } else {
            reset({
                actorName: "",
                birthDate: "",
                genderCode: "M",
                shortBio: "",
                avatarUrl: "",
                nationalityCode: "",
            });
        }
    }, [actor, mode, reset]);

    const onSubmit = async (data: ActorFormData) => {
        setIsSubmitting(true);
        try {
            const defaultAvatar = "https://ui-avatars.com/api/?name=Actor&background=random";
            const dto: CreateActorDto = {
                actorName: data.actorName,
                birthDate: data.birthDate || undefined,
                genderCode: data.genderCode || undefined,
                shortBio: data.shortBio || undefined,
                avatarUrl: data.avatarUrl?.trim() ? data.avatarUrl : defaultAvatar,
                nationalityCode: data.nationalityCode || undefined,
            };

            let success = false;
            if (mode === "create") {
                success = await createActor(dto);
                if (success) {
                    toast.success("Thêm diễn viên thành công!");
                } else {
                    toast.error("Thêm diễn viên thất bại!");
                }
            } else if (actor) {
                success = await updateActor(parseInt(actor.actorId), dto);
                if (success) {
                    toast.success("Cập nhật diễn viên thành công!");
                } else {
                    toast.error("Cập nhật diễn viên thất bại!");
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
                        {mode === "create" ? "Thêm Diễn Viên Mới" : "Chỉnh Sửa Diễn Viên"}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === "create"
                            ? "Điền thông tin để thêm diễn viên mới"
                            : "Cập nhật thông tin diễn viên"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="actorName">
                            Tên Diễn Viên <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="actorName"
                            {...register("actorName", {
                                required: "Tên diễn viên là bắt buộc",
                            })}
                            placeholder="Nhập tên diễn viên"
                        />
                        {errors.actorName && (
                            <p className="text-sm text-red-500">
                                {errors.actorName.message}
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
                        <Label htmlFor="shortBio">Tiểu Sử</Label>
                        <Textarea
                            id="shortBio"
                            {...register("shortBio")}
                            placeholder="Nhập tiểu sử diễn viên..."
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
                                    ? "Thêm Diễn Viên"
                                    : "Cập Nhật"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
