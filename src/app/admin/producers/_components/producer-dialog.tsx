"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useProducerStore } from "@/stores/producerStore"
import type { CreateProducerDto } from "@/types/producer.type"
import type { ProducerColumn } from "@/types/producer.type"

interface ProducerDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    producer?: ProducerColumn | null
    mode: "create" | "edit"
}

interface ProducerFormData {
    producerName: string
}

export function ProducerDialog({ open, onOpenChange, producer, mode }: ProducerDialogProps) {
    const { createProducer, updateProducer } = useProducerStore()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProducerFormData>({
        defaultValues: {
            producerName: "",
        },
    })

    useEffect(() => {
        if (producer && mode === "edit") {
            reset({
                producerName: producer.producerName,
            })
        } else {
            reset({
                producerName: "",
            })
        }
    }, [producer, mode, reset])

    const onSubmit = async (data: ProducerFormData) => {
        setIsSubmitting(true)
        try {
            const dto: CreateProducerDto = {
                producerName: data.producerName,
            }

            let success = false
            if (mode === "create") {
                success = await createProducer(dto)
                if (success) {
                    toast.success("Thêm nhà sản xuất thành công!")
                } else {
                    toast.error("Thêm nhà sản xuất thất bại!")
                }
            } else if (producer) {
                success = await updateProducer(Number.parseInt(producer.producerId), dto)
                if (success) {
                    toast.success("Cập nhật nhà sản xuất thành công!")
                } else {
                    toast.error("Cập nhật nhà sản xuất thất bại!")
                }
            }

            if (success) {
                onOpenChange(false)
                reset()
            }
        } catch (error) {
            toast.error("Đã có lỗi xảy ra!")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{mode === "create" ? "Thêm Nhà Sản Xuất Mới" : "Chỉnh Sửa Nhà Sản Xuất"}</DialogTitle>
                    <DialogDescription>
                        {mode === "create" ? "Điền thông tin để thêm nhà sản xuất mới" : "Cập nhật thông tin nhà sản xuất"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="producerName">
                            Tên Nhà Sản Xuất <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="producerName"
                            {...register("producerName", {
                                required: "Tên nhà sản xuất là bắt buộc",
                            })}
                            placeholder="Nhập tên nhà sản xuất"
                        />
                        {errors.producerName && <p className="text-sm text-red-500">{errors.producerName.message}</p>}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                            Hủy
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                            {isSubmitting ? "Đang xử lý..." : mode === "create" ? "Thêm Nhà Sản Xuất" : "Cập Nhật"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
