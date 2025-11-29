"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { VideoUpload } from "./videoUpload";
import { useEffect, useRef, useState } from "react";

interface UploadProgress {
  percentage: number;
  uploadedBytes: number;
  totalBytes: number;
}

interface FormUploadVideoProps {
  field: any;
}

export const FormUploadVideo = ({ field }: FormUploadVideoProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress>({
    percentage: 0,
    uploadedBytes: 0,
    totalBytes: 0,
  });
  const [assetId, setAssetId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [playbackUrl, setPlaybackUrl] = useState<string | null>(null);
  const uploadRef = useRef<any>(null);

  useEffect(() => {
    if (!playbackUrl) return;

    field.onChange(playbackUrl);
    setUploading(false);
  }, [playbackUrl])

  return (
    <FormItem>
      <FormLabel>Video<span className="text-red-500">*</span></FormLabel>
      <FormControl>
        <div className="flex flex-col gap-2">
          <Input
            {...field}
            placeholder="URL video" />
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
                  uploading={uploading}
                  setUploading={setUploading}
                  progress={progress}
                  setProgress={setProgress}
                  assetId={assetId}
                  setAssetId={setAssetId}
                  error={error}
                  setError={setError}
                  playbackUrl={playbackUrl}
                  setPlaybackUrl={setPlaybackUrl}
                  uploadRef={uploadRef}
                  onPlaybackUrlChange={setPlaybackUrl}
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
          <li>Nhập video URL hoặc chọn upload video từ máy tính</li>
          <li>Video upload phải có định dạng .mp4</li>
          <li>Video upload phải có kích thước <strong>nhỏ hơn 5GB</strong></li>
        </ul>
      </div>
    </FormItem>
  )
}