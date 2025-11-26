"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UploadService from "@/services/upload.service";
import { Copy, ImageUp, Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface UploadThumbProps {
  field: any;
}

export const UploadThumb = ({ field }: UploadThumbProps) => {
  const [files, setFiles] = useState<Record<string, File>>({});
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState<string>("");

  const handleFileChange = (id: string, file: File) => {
    setFiles((prev) => ({ ...prev, [id]: file }));
  };

  const handleUpload = async (id: string) => {
    const file = files[id];
    if (!file) {
      toast.error("Vui lòng chọn ảnh trước khi upload");
      return;
    }
    try {
      setLoading(true);
      setId(id);
      const res = await UploadService.uploadFile(file);
      if (res.data) {
        field.onChange(res.data.url);
        setLoading(false);
        toast.success("Upload ảnh thành công");
        setId("");
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      setId("");
      toast.error("Upload ảnh thất bại");
    }
  };

  const fileName = files[field.id]?.name || "Chưa chọn ảnh";
  const fileUrl = field.value;

  return (
    <div className="flex flex-col gap-3 w-full rounded-xl border border-gray-200 shadow-sm p-4 bg-white">
      <div className="flex flex-row items-center w-full justify-between gap-2">
        <label
          className="relative inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm cursor-pointer hover:bg-blue-50 transition-colors"
          style={{ minWidth: 120 }}
        >
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleFileChange(field.id, file);
              }
            }}
          />
          <ImageUp className="mr-2 h-5 w-5 text-blue-600" />
          <span className="text-sm font-medium text-gray-700 select-none">Chọn ảnh</span>
        </label>
        <span className="text-sm font-semibold truncate max-w-[180px] italic text-center flex-1 text-inherit">
          {fileName}
        </span>
        <Button
          type="button"
          className="cursor-pointer bg-white text-black border border-gray-300 hover:bg-blue-50 shadow-md"
          variant={"default"}
          onClick={() => handleUpload(field.id)}
          disabled={loading}
          style={{ minWidth: 100 }}
        >
          {loading && id === field.id ? (
            <Loader className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ImageUp className="mr-2 h-4 w-4 text-blue-600" />
          )}
          Upload
        </Button>
        {fileUrl && (
          <img
            src={fileUrl}
            alt="avatar preview"
            className="w-10 h-10 rounded-full object-cover border ml-4"
            style={{ minWidth: 40, minHeight: 40 }}
          />
        )}
      </div>
      <div className="flex items-center gap-2 mt-1 w-full">
        <Input {...field} placeholder="URL ảnh" readOnly />
        <Button
          type="button"
          size={"icon"}
          variant={"outline"}
          className="cursor-pointer"
          onClick={() => {
            navigator.clipboard.writeText(field.value);
            toast.success(`Đã sao chép Thumb URL`);
          }}
        >
          <Copy size={16} />
        </Button>
      </div>
    </div>
  );
};
