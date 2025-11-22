"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

export function CreateRoleModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    const payload = {
      roleName,
      description,
      isActive,
    };

    const res = await fetch("/api/roles/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (res.ok) {
      onSuccess();
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Thêm vai trò mới</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="flex flex-col gap-2">
            <Label>Tên vai trò</Label>
            <Input value={roleName} onChange={(e) => setRoleName(e.target.value)} placeholder="Nhập tên vai trò" />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Mô tả</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Nhập mô tả" />
          </div>

          <div className="flex items-center justify-between">
            <Label>Trạng thái</Label>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button disabled={loading} onClick={handleSubmit}>
              {loading ? "Đang lưu..." : "Lưu"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
