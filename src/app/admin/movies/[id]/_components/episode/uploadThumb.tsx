import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UploadService from "@/services/upload.service";
import { Copy, ImageUp, Loader } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface UploadThumbProps {
  field: any;
}

export const UploadThumb = ({ field }: UploadThumbProps) => {

  const inputUploadRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [id, setId] = useState<string>("");

  const handleFileChange = async (id: string, file: File) => {
    if (!file) {
      toast.error("Vui lòng chọn ảnh trước khi upload");
      return;
    }

    if (file.size > 1024 * 1024 * 2) {
      toast.warning("File upload phải có kích thước nhỏ hơn 2MB");
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
    <div className="flex items-center gap-2 w-full">
      <div>
        <Input
          type="file"
          accept="image/*"
          className="cursor-pointer hidden"
          ref={inputUploadRef}
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
          onClick={() => inputUploadRef.current?.click()}
        >
          {
            loading && id === field.id ?
              (
                <Loader className=" h-4 w-4 animate-spin" />
              ) :
              (
                <ImageUp className=" h-4 w-4" />
              )
          }
          Upload
        </Button>
      </div>
      <div className="flex items-center gap-2 flex-1">
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