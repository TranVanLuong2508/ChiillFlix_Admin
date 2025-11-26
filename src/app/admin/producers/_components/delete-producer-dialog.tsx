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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useProducerStore } from "@/stores/producerStore"
import { useState, useEffect } from "react"

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
  const { deleteProducer, producers } = useProducerStore()
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedNewProducerId, setSelectedNewProducerId] = useState<string>("")
  const [useReassignment, setUseReassignment] = useState(false)

  // Filter out the producer being deleted
  const availableProducers = producers.filter(
    (p) => p.producerId !== producerId
  )

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      if (isBulk && onBulkDelete) {
        await onBulkDelete()
        onOpenChange(false)
      } else {
        const newProducerId = useReassignment && selectedNewProducerId
          ? Number.parseInt(selectedNewProducerId)
          : undefined

        const success = await deleteProducer(
          Number.parseInt(producerId),
          newProducerId
        )
        if (success) {
          onOpenChange(false)
          setSelectedNewProducerId("")
          setUseReassignment(false)
        }
      }
    } finally {
      setIsDeleting(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setSelectedNewProducerId("")
      setUseReassignment(false)
    }
    onOpenChange(newOpen)
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa nhà sản xuất</AlertDialogTitle>
          <AlertDialogDescription>
            {isBulk ? (
              <>
                Hành động này sẽ xóa mềm các nhà sản xuất sau:
                <br />
                <span className="font-semibold">{producerName}</span>
              </>
            ) : (
              <>
                Bạn đang xóa nhà sản xuất{" "}
                <span className="font-semibold">{producerName}</span>
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          {availableProducers.length > 0 && !isBulk && (
            <div className="space-y-3 border-t pt-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="reassign-films"
                  checked={useReassignment}
                  onChange={(e) => {
                    setUseReassignment(e.target.checked)
                    if (!e.target.checked) {
                      setSelectedNewProducerId("")
                    }
                  }}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label
                  htmlFor="reassign-films"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Chuyển phim sang nhà sản xuất khác
                </label>
              </div>

              {useReassignment && (
                <div className="ml-6 space-y-2">
                  <label className="text-sm font-medium">
                    Chọn nhà sản xuất đích
                  </label>
                  <Select
                    value={selectedNewProducerId}
                    onValueChange={setSelectedNewProducerId}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn nhà sản xuất..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableProducers.map((producer) => (
                        <SelectItem
                          key={producer.producerId}
                          value={producer.producerId}
                        >
                          {producer.producerName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={
              isDeleting ||
              (useReassignment && !selectedNewProducerId)
            }
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? "Đang xóa..." : "Xóa"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
