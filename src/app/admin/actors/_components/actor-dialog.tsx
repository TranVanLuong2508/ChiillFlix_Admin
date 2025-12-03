"use client";
import { UploadThumb } from "./UploadThumb";
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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parse, format } from "date-fns";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ActorColumn, CreateActorDto } from "@/types/actor.type";
import { allCodeService } from "@/services/allCodeService";
import { AllCodeRow } from "@/types/backend.type";
import { useActorStore } from "@/stores/actorStore";
import { formatDate } from "@/utils/formateDate";
import "@/styles/hideScroll.css";
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
    createdAt: Date;
    updatedAt: Date;
}

export function ActorDialog({
    open,
    onOpenChange,
    actor,
    mode,
}: ActorDialogProps) {
    const { createActor, updateActor, fetchActors, actors, meta } = useActorStore();
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
            createdAt: new Date(),
            updatedAt: new Date(),
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
            let formattedBirthDate = "";
            if (actor.birthDate) {
                try {
                    const [year, month, day] = actor.birthDate.split("-");
                    if (year && month && day) {
                        formattedBirthDate = `${day}/${month}/${year}`;
                    }
                } catch (error) {
                    console.error("Error parsing birthDate:", error);
                }
            }

            reset({
                actorName: actor.actorName,
                birthDate: formattedBirthDate,
                genderCode: actor.genderCode,
                shortBio: actor.shortBio,
                avatarUrl: actor.avatarUrl,
                nationalityCode: actor.nationalityCode,
                createdAt: actor.createdAt,
                updatedAt: actor.updatedAt,

            });
        } else {
            reset({
                actorName: "",
                birthDate: "",
                genderCode: "M",
                shortBio: "",
                avatarUrl: "",
                nationalityCode: "",
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }
    }, [actor, mode, reset]);

    const onSubmit = async (data: ActorFormData) => {
        if (data.birthDate === "") {
            toast.error("Ngày sinh phải đúng định dạng dd/mm/yyyy");
            return;
        } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(data.birthDate)) {
            toast.error("Ngày sinh phải đúng định dạng dd/mm/yyyy");
            return;
        }
        if (data.nationalityCode === "") {
            toast.error("Vui lòng chọn quốc tịch");
            return;
        }
        if (data.avatarUrl?.trim()) {
            try {
                new URL(data.avatarUrl);
            } catch {
                toast.error("URL Avatar không hợp lệ");
                return;
            }
        }

        setIsSubmitting(true);
        try {
            const defaultAvatar = "https://ui-avatars.com/api/?name=Actor&background=random";
            let backendBirthDate = "";
            if (data.birthDate) {
                const [day, month, year] = data.birthDate.split("/");
                if (day && month && year) {
                    backendBirthDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
                }
            }

            const dto: CreateActorDto = {
                actorName: data.actorName,
                birthDate: backendBirthDate || undefined,
                genderCode: data.genderCode || undefined,
                shortBio: data.shortBio || undefined,
                avatarUrl: data.avatarUrl?.trim() ? data.avatarUrl : defaultAvatar,
                nationalityCode: data.nationalityCode || undefined,
            };

            let success = false;
            if (mode === "create") {
                success = await createActor(dto);
                if (success) {
                    await fetchActors(meta?.page || 1, meta?.limit || 10);
                    toast.success("Thêm diễn viên thành công!");
                } else {
                    toast.error("Thêm diễn viên thất bại!");
                }
            } else if (actor) {
                success = await updateActor(parseInt(actor.actorId), dto);
                if (success) {
                    await fetchActors(meta?.page || 1, meta?.limit || 10);
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
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto hide-scrollbar">
                <DialogHeader>
                    <DialogTitle>
                        {mode === "create" ? "Thêm Diễn Viên Mới" : "Chỉnh Sửa Diễn Viên"}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === "create"
                            ? "Điền thông tin để thêm diễn viên mới"
                            : "Cập nhật thông tin diễn viên"}
                        <span className="block mt-1 text-xs">
                            <span className="text-red-500">*</span> Trường bắt buộc
                        </span>
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
                            <Label htmlFor="birthDate">
                                Ngày Sinh <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <DatePicker
                                    id="birthDate"
                                    selected={
                                        !!watch('birthDate') && /^\d{2}\/\d{2}\/\d{4}$/.test(watch('birthDate'))
                                            ? parse(watch('birthDate'), 'dd/MM/yyyy', new Date())
                                            : null
                                    }
                                    onChange={(date: Date | null) => setValue('birthDate', date ? format(date, 'dd/MM/yyyy') : '')}
                                    dateFormat="dd/MM/yyyy"
                                    placeholderText="dd/mm/yyyy"
                                    className="w-full border rounded px-3 py-2 pr-10"
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    minDate={new Date(new Date().getFullYear() - 100, 0, 1)}
                                    maxDate={new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate())}
                                />
                                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>
                            {errors.birthDate && (
                                <p className="text-sm text-red-500">{errors.birthDate.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="genderCode">
                                Giới Tính <span className="text-gray-400 text-sm font-normal">(không bắt buộc)</span>
                            </Label>
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
                        <Label htmlFor="nationalityCode">
                            Quốc Tịch <span className="text-red-500">*</span>
                        </Label>
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
                        <Label htmlFor="avatarUrl">
                            Ảnh đại diện <span className="text-gray-400 text-sm font-normal">(không bắt buộc)</span>
                        </Label>
                        <UploadThumb field={{
                            ...register("avatarUrl"),
                            value: watch("avatarUrl"),
                            id: "avatarUrl",
                            onChange: (url: string) => setValue("avatarUrl", url)
                        }} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="shortBio">
                            Tiểu Sử <span className="text-gray-400 text-sm font-normal">(không bắt buộc)</span>
                        </Label>
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
