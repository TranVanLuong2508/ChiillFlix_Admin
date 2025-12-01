"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import UserService from "@/services/userService";
import { IUserUpdate, IUserBasic } from "@/types/user.type";
import { IRole } from "@/types/role.type";
import _ from "lodash";
import "@/styles/hideScroll.css";
import { AllCodeRow } from "@/types/backend.type";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    user: IUserBasic | null;
    genderList: AllCodeRow[];
    roleList: IRole[];
}

export function EditUserModal({ open, onClose, onSuccess, user, genderList, roleList }: ModalProps) {
    const [fullName, setFullName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [age, setAge] = useState<string>("");
    const [genderCode, setGenderCode] = useState("");
    const [roleId, setRoleId] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [genderData, setGenderData] = useState<{ value: string; label: string }[]>([]);
    const [roleData, setRoleData] = useState<{ value: string; label: string }[]>([]);

    useEffect(() => {
        if (user && open) {
            setFullName(user.fullName || "");
            setPhoneNumber(user.phoneNumber || "");
            setAge(user.age ? user.age.toString() : "");
            setGenderCode(user.genderCode || "");
            setRoleId(user.roleId ? user.roleId.toString() : "");
        }
    }, [user, open]);

    useEffect(() => {
        const data = buildGenderData(genderList);
        setGenderData(data);
    }, [genderList]);

    useEffect(() => {
        const data = buildRoleData(roleList);
        setRoleData(data);
    }, [roleList]);

    const buildGenderData = (genderList: AllCodeRow[]) => {
        return genderList.map(gender => ({
            value: gender.keyMap,
            label: gender.valueVi,
        }));
    };

    const buildRoleData = (roleList: IRole[]) => {
        return roleList.map(role => ({
            value: role.roleId.toString(),
            label: role.roleName,
        }));
    };

    const handleCloseModal = () => {
        setLoading(false);
        onClose();
        // Reset form
        setFullName("");
        setPhoneNumber("");
        setAge("");
        setGenderCode("");
        setRoleId("");
    };

    const validatePhoneNumber = (phone: string) => {
        const phoneRegex = /^[0-9]{10,11}$/;
        return phoneRegex.test(phone);
    };

    const handleSubmit = async () => {
        if (!user) {
            toast.error("Không tìm thấy thông tin người dùng!");
            return;
        }

        // Validation
        if (!fullName.trim()) {
            toast.warning("Vui lòng nhập họ tên!");
            return;
        }
        if (!phoneNumber.trim()) {
            toast.warning("Vui lòng nhập số điện thoại!");
            return;
        }
        if (!validatePhoneNumber(phoneNumber)) {
            toast.warning("Số điện thoại không hợp lệ (10-11 số)!");
            return;
        }
        if (!age || parseInt(age) <= 0) {
            toast.warning("Vui lòng nhập tuổi hợp lệ!");
            return;
        }
        if (!genderCode) {
            toast.warning("Vui lòng chọn giới tính!");
            return;
        }
        if (!roleId) {
            toast.warning("Vui lòng chọn vai trò!");
            return;
        }

        setLoading(true);
        try {
            const payload: IUserUpdate = {
                userId: user.userId,
                fullName: fullName.trim(),
                phoneNumber: phoneNumber.trim(),
                age: parseInt(age),
                genderCode,
                roleId: parseInt(roleId),
            };

            console.log("Check data to update user: ", payload);

            const res = await UserService.CallUpdateUser(payload);

            if (res && res.EC === 1 && !_.isEmpty(res.data)) {
                toast.success("Cập nhật người dùng thành công!");
                handleCloseModal();
                onSuccess();
            } else if (res && res.EC === 2) {
                toast.warning(res.EM || "Có lỗi xảy ra khi cập nhật!");
            } else {
                toast.error("Đã có lỗi xảy ra khi cập nhật người dùng!");
            }
        } catch (error) {
            console.error("Error updating user:", error);
            toast.error("Đã có lỗi xảy ra khi cập nhật người dùng!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleCloseModal} modal={true}>
            <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 hide-scrollbar">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Chỉnh Sửa Người Dùng</DialogTitle>
                </DialogHeader>

                <div className="mt-6 space-y-6">
                    {/* Email - Read Only */}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-base font-medium">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={user?.email || ""}
                            disabled
                            className="h-11 bg-gray-100 cursor-not-allowed"
                        />
                        <p className="text-sm text-gray-500">Email không thể chỉnh sửa</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-base font-medium">
                            Họ và tên <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="fullName"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Nguyễn Văn A"
                            className="h-11"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber" className="text-base font-medium">
                                Số điện thoại <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="phoneNumber"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="0912345678"
                                className="h-11"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="age" className="text-base font-medium">
                                Tuổi <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="age"
                                type="number"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                placeholder="18"
                                min="13"
                                max="120"
                                className="h-11"
                            />
                        </div>
                    </div>

                    {/* Gender & Role */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="gender" className="text-base font-medium">
                                Giới tính <span className="text-red-500">*</span>
                            </Label>
                            <Select value={genderCode} onValueChange={setGenderCode}>
                                <SelectTrigger className="h-11 w-full">
                                    <SelectValue placeholder="Chọn giới tính..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {genderData.map((gender) => (
                                        <SelectItem key={gender.value} value={gender.value}>
                                            {gender.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role" className="text-base font-medium">
                                Vai trò <span className="text-red-500">*</span>
                            </Label>
                            <Select value={roleId} onValueChange={setRoleId}>
                                <SelectTrigger className="h-11 w-full">
                                    <SelectValue placeholder="Chọn vai trò..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {roleData.map((role) => (
                                        <SelectItem key={role.value} value={role.value}>
                                            {role.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button className="cursor-pointer" variant="outline" onClick={handleCloseModal} disabled={loading}>
                            Hủy
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white min-w-32 cursor-pointer"
                        >
                            {loading ? "Đang lưu..." : "Cập Nhật"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
