"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { VideoUpload } from "./videoUpload";
import { useEffect, useState } from "react";
import { useUploadStore } from "@/stores/upload.store";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";
import { useFormContext } from "react-hook-form";

interface FormUploadVideoProps {
  field: any;
  onAddToQueue?: () => void;
}

export const FormUploadVideo = ({ field, onAddToQueue }: FormUploadVideoProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [playbackUrl, setPlaybackUrl] = useState<string | null>(null);
  const { addToQueue } = useUploadStore();
  const form = useFormContext();

  useEffect(() => {
    if (!playbackUrl) return;
    field.onChange(playbackUrl);
  }, [playbackUrl])

  useEffect(() => {
    if (field.value && field.value !== playbackUrl) {
      setPlaybackUrl(field.value);
    }
  }, [field.value]);

  const handleAddToQueue = () => {
    if (!file) {
      toast.error("Vui lòng chọn video để upload");
      return;
    }

    const formData = form.getValues();
    const id = uuidv4();

    addToQueue({
      id,
      file,
      fileName: file.name,
      fileSize: file.size,
      formData,
    });

    toast.success("Đã thêm vào hàng chờ upload");
    if (onAddToQueue) {
      onAddToQueue();
    }
  };

  return (
    <FormItem>
      <FormLabel>Video<span className="text-red-500">*</span></FormLabel>
      <FormControl>
        <div className="flex flex-col gap-2">
          <Input
            {...field}
            placeholder="URL video"
          />
          <Accordion type="single" collapsible>
            <AccordionItem value="upload-video" >
              <AccordionTrigger
                className="border px-4 py-2"
              >
                Chọn video để upload
              </AccordionTrigger>
              <AccordionContent className="p-0">
                <VideoUpload
                  file={file}
                  setFile={setFile}
                  playbackUrl={playbackUrl}
                  setPlaybackUrl={setPlaybackUrl}
                  onPlaybackUrlChange={setPlaybackUrl}
                  handleAddToQueue={handleAddToQueue}
                  disabled={!!playbackUrl}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </FormControl>
      <FormMessage />
      <div className="text-muted-foreground text-xs space-y-2">
        <span>Lưu ý:</span>
        <ul className="list-decimal pl-6">
          <li>Nhập video URL hoặc upload video từ máy tính</li>
          <li>Video upload phải có định dạng .mp4</li>
          <li>Video upload phải có kích thước <strong>nhỏ hơn 5GB</strong></li>
        </ul>
      </div>
    </FormItem>
  )
}