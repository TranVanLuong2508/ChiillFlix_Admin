"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useProducerStore } from "@/stores/producerStore"
import { useState } from "react"

interface DeleteProducerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  producerId: string
  producerName: string
  isBulk?: boolean
  onBulkDelete?: () => void
}

export function DeleteProducerDialog({
  open,
  onOpenChange,
  producerId,
  producerName,
  isBulk = false,
  onBulkDelete,
}: DeleteProducerDialogProps) {
  const { deleteProducer } = useProducerStore()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      if (isBulk && onBulkDelete) {
        await onBulkDelete()
        onOpenChange(false)
      } else {
        const success = await deleteProducer(Number.parseInt(producerId))
        if (success) {
          onOpenChange(false)
        }
      }
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
          <AlertDialogDescription>
            {isBulk ? (
              <>
                Hành động này không thể hoàn tác. Các nhà sản xuất sau sẽ bị xóa vĩnh viễn khỏi hệ thống:
                <br />
                <span className="font-semibold">{producerName}</span>
              </>
            ) : (
              <>
                Hành động này không thể hoàn tác. Nhà sản xuất <span className="font-semibold">{producerName}</span> sẽ
                bị xóa vĩnh viễn khỏi hệ thống.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
            {isDeleting ? "Đang xóa..." : "Xóa"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
