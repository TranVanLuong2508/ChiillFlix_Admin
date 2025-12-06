import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import UploadService from "@/services/upload.service";
import { Copy, CornerDownRight, ImageUp, Loader } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface UploadImageProps {
  fields: any[];
  form: any;
}

export const UploadImage = ({
  fields,
  form,
}: UploadImageProps) => {
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState<number | null>(null);

  const handleFileChange = async (index: number, file: File) => {
    if (!file) {
      toast.error("Vui lòng chọn ảnh trước khi upload");
      return;
    }

    if (file.size > 1024 * 1024 * 10) {
      toast.error("Kích thước ảnh không được vượt quá 10MB");
      return;
    }

    setLoading(true);
    try {
      setId(index);
      const res = await UploadService.uploadFile(file);
      if (res.data) {
        form.setValue(`filmImages.${index}.url`, res.data.url);
        toast.success("Upload ảnh thành công");
        setLoading(false);
        setId(null);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      setId(null);
      toast.error("Upload ảnh thất bại");
    }
  };

  const capitalize = (str?: string) => {
    if (!str) return "";
    const s = str.trim();
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  // Check data image
  // const values = form.watch("filmImages");
  // console.log("Check data image: ", values);
  // Check data image

  return (
    <div className="flex flex-col gap-4 pt-2">
      {fields.map((field, index) => {
        const fileInputRef = useRef<HTMLInputElement>(null);

        return (
          <FormField
            key={field.id}
            control={form.control}
            name={`filmImages.${index}.url`}
            render={({ field: fieldProps }) => (
              <FormItem>
                <FormLabel className="capitalize">
                  <CornerDownRight size={20} /> {capitalize(field.type)} <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2 pl-6 w-full">
                    <div>
                      <Input
                        type="file"
                        accept="image/*"
                        className="cursor-pointer hidden"
                        ref={fileInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileChange(index, file);
                          }
                        }}
                      />
                      <Button
                        type="button"
                        className="cursor-pointer"
                        variant={"outline"}
                        // onClick={() => handleUpload(field.id, index)}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {
                          loading && id === index ?
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
                    <div className="flex items-center gap-2 flex-1">
                      <Input {...fieldProps} placeholder="URL ảnh" readOnly />
                      <Button
                        type="button"
                        size={"icon"}
                        variant={"outline"}
                        className="cursor-pointer"
                        onClick={() => {
                          navigator.clipboard.writeText(fieldProps.value);
                          toast.success(`Đã sao chép ${capitalize(field.type)} URL`);
                        }}
                      >
                        <Copy size={4} />
                      </Button>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )
      })}
    </div>
  )
}