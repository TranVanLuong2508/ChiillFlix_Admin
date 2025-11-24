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

  return (
    <div className="flex flex-col gap-2 pl-6 w-full">
      <div className="flex items-center gap-2">
        <Input
          type="file"
          accept="image/*"
          className="cursor-pointer"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleFileChange(field.id, file);
            }
          }}
        />
        <Button
          type="button"
          className="cursor-pointer"
          variant={"outline"}
          onClick={() => handleUpload(field.id)}
        >
          {
            loading && id === field.id ?
              (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              ) :
              (
                <ImageUp className="mr-2 h-4 w-4" />
              )
          }
          Upload
        </Button>
      </div>
      <div className="flex items-center gap-2">
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
          <Copy size={4} />
        </Button>
      </div>
    </div>
  )
}