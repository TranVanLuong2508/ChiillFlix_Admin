"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import UserService from "@/services/userService";
import { RoleService } from "@/services/roleService";
import { IUserCreate } from "@/types/user.type";
import { IRole } from "@/types/role.type";
import _ from "lodash";
import "@/styles/hideScroll.css";
import { allCodeService } from "@/services/allCodeService";
import { AllCodeRow } from "@/types/backend.type";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: (userId: number) => void;
    genderList: AllCodeRow[];
    roleList: IRole[]
}

export function CreateUserModal({ open, onClose, onSuccess, genderList, roleList }: ModalProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [age, setAge] = useState<string>("");
    const [genderCode, setGenderCode] = useState("");
    const [roleId, setRoleId] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState<IRole[]>([]);
    const [genderData, setGenderData] = useState<{ value: string; label: string }[]>([]);
    const [roleData, setRoleData] = useState<{ value: string; label: string }[]>([]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const res = await RoleService.CallFetchRolesList();
                if (res && res?.EC === 1 && res.data?.roles) {
                    // Filter out deleted roles
                    const activeRoles = res.data.roles.filter(role => !role.isDeleted);
                    setRoles(activeRoles);
                }
            } catch (error) {
                console.error("Error fetching roles:", error);
            }
        };

        if (open) {
            fetchRoles();
        }
    }, [open]);

    useEffect(() => {
        const data = buildGenderData(genderList)
        setGenderData(data)
    }, [genderList])

    useEffect(() => {
        const data = buildRoleData(roleList)
        setRoleData(data)
    }, [roleList])

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
        setEmail("");
        setPassword("");
        setFullName("");
        setPhoneNumber("");
        setAge("");
        setGenderCode("");
        setRoleId("");
    };

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhoneNumber = (phone: string) => {
        const phoneRegex = /^[0-9]{10,11}$/;
        return phoneRegex.test(phone);
    };

    const handleSubmit = async () => {
        // Validation
        if (!email.trim()) {
            toast.warning("Vui lòng nhập email!");
            return;
        }
        if (!validateEmail(email)) {
            toast.warning("Email không hợp lệ!");
            return;
        }
        if (!password.trim()) {
            toast.warning("Vui lòng nhập mật khẩu!");
            return;
        }
        if (password.length < 6) {
            toast.warning("Mật khẩu phải có ít nhất 6 ký tự!");
            return;
        }
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
            const payload: IUserCreate = {
                email: email.trim(),
                password: password.trim(),
                fullName: fullName.trim(),
                phoneNumber: phoneNumber.trim(),
                age: parseInt(age),
                genderCode,
                roleId: parseInt(roleId),
            };

            console.log("Check data to create user: ", payload)

            const res = await UserService.CallCreateUser(payload);

            if (res && res.EC === 1 && !_.isEmpty(res.data)) {
                toast.success("Tạo người dùng thành công!");
                handleCloseModal();
                onSuccess(res.data.userId);
            } else if (res && res.EC === 2) {
                toast.warning(res.EM || "Email đã tồn tại. Vui lòng dùng email khác!");
            } else {
                toast.error("Đã có lỗi xảy ra khi tạo người dùng!");
            }
        } catch (error) {
            console.error("Error creating user:", error);
            toast.error("Đã có lỗi xảy ra khi tạo người dùng!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleCloseModal} modal={true}>
            <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 hide-scrollbar">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Thêm Người dùng Mới</DialogTitle>
                </DialogHeader>

                <div className="mt-6 space-y-6">
                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-base font-medium">
                            Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@email.com"
                            className="h-11"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-base font-medium">
                            Mật khẩu <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Tối thiểu 6 ký tự"
                            className="h-11"
                        />
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
                                    {roles.map((role) => (
                                        <SelectItem key={role.roleId} value={role.roleId.toString()}>
                                            {role.roleName}
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
                            {loading ? "Đang lưu..." : "Tạo Người dùng"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
