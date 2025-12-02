"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import PlansService from "@/services/planService";
import { toast } from "sonner";
import { allCodeService } from "@/services/allCodeService";
import { AllCodeRow } from "@/types/backend.type";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: (planId: number) => void;
}

export function CreatePlanModal({ open, onClose, onSuccess }: ModalProps) {
    const [planName, setPlanName] = useState("");
    const [price, setPrice] = useState("");
    const [planDurationValue, setPlanDurationValue] = useState("");
    const [planDurationUnit, setPlanDurationUnit] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [loading, setLoading] = useState(false);
    const [durationList, setDurationList] = useState<AllCodeRow[]>([]);

    useEffect(() => {
        fetchDurationList();
    }, []);

    const fetchDurationList = async () => {
        try {
            const res = await allCodeService.getPlanDurationsList();
            if (res && res?.EC === 1 && res.data?.TIME_UNIT && res.data.TIME_UNIT.length > 0) {
                setDurationList(res.data.TIME_UNIT);
            }
        } catch (error) {
            console.log("Error fetching duration list:", error);
        }
    };

    const handleCloseModal = () => {
        setLoading(false);
        onClose();
        setPlanName("");
        setPrice("");
        setPlanDurationValue("");
        setPlanDurationUnit("");
        setIsActive(true);
    };

    const handleSubmit = async () => {
        // Validation
        if (!planName.trim()) {
            toast.warning("Vui lòng nhập tên gói VIP!");
            return;
        }
        if (!price.trim() || parseFloat(price) <= 0) {
            toast.warning("Vui lòng nhập giá hợp lệ!");
            return;
        }
        if (!planDurationValue.trim() || parseInt(planDurationValue) <= 0) {
            toast.warning("Vui lòng nhập số lượng thời gian hợp lệ!");
            return;
        }
        if (!planDurationUnit) {
            toast.warning("Vui lòng chọn đơn vị thời gian!");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                planName: planName.trim(),
                price: price.trim(),
                planDuration: parseInt(planDurationValue),
                durationTypeCode: planDurationUnit,
                isActive,
            };

            console.log("Check payload: ", payload);

            const createPlanResponse = await PlansService.createPlan(payload);

            if (createPlanResponse?.EC === 1) {
                toast.success("Tạo gói VIP thành công!");
                if (createPlanResponse.data?.planId) onSuccess(createPlanResponse.data?.planId);
                handleCloseModal();
            } else if (createPlanResponse?.EC === 2) {
                toast.warning(createPlanResponse.EM || "Tên gói đã tồn tại!");
            } else {
                toast.error("Đã có lỗi xảy ra khi tạo gói VIP!");
            }
        } catch (error) {
            console.error("Error creating plan:", error);
            toast.error("Đã có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleCloseModal} modal={true}>
            <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 hide-scrollbar">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Thêm gói VIP mới</DialogTitle>
                </DialogHeader>

                <div className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="planName" className="text-base font-medium">
                                Tên gói <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="planName"
                                value={planName}
                                onChange={(e) => setPlanName(e.target.value)}
                                placeholder="Ví dụ: Basic, Premium, VIP..."
                                className="h-11"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="price" className="text-base font-medium">
                                Giá (VNĐ) <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="price"
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="Ví dụ: 100000"
                                className="h-11"
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="planDurationValue" className="text-base font-medium">
                                Thời gian <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="planDurationValue"
                                type="number"
                                value={planDurationValue}
                                onChange={(e) => setPlanDurationValue(e.target.value)}
                                placeholder="Ví dụ: 1, 3, 6..."
                                className="h-11"
                                min="1"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="planDurationUnit" className="text-base font-medium">
                                Đơn vị thời gian <span className="text-red-500">*</span>
                            </Label>
                            <Select value={planDurationUnit} onValueChange={setPlanDurationUnit}>
                                <SelectTrigger className="h-11 w-full">
                                    <SelectValue placeholder="Chọn đơn vị..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {durationList.map((duration) => (
                                        <SelectItem key={duration.keyMap} value={duration.keyMap}>
                                            {duration.valueVi}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div className="flex items-end justify-start gap-4">
                            <div className="space-y-2 flex-1">
                                <Label className="text-base font-medium">Trạng thái</Label>
                                <div className="flex items-center space-x-3">
                                    <Switch
                                        checked={isActive}
                                        onCheckedChange={setIsActive}
                                        className="data-[state=checked]:bg-blue-600 cursor-pointer"
                                    />
                                    <span className="text-sm font-medium">{isActive ? "Khả dụng" : "Không khả dụng"}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button className="cursor-pointer" variant="outline" onClick={handleCloseModal} disabled={loading}>
                            Hủy
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={loading || !planName.trim() || !price.trim() || !planDurationValue.trim() || !planDurationUnit}
                            className="bg-blue-600 hover:bg-blue-700 text-white min-w-32 cursor-pointer"
                        >
                            {loading ? "Đang lưu..." : "Lưu gói VIP"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
