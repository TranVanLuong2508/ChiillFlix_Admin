"use client";

import { Button } from "@/components/ui/button";
import { CloudUpload } from "lucide-react";
import { toast } from "sonner";

interface VideoUploadProps {
  file: File | null;
  setFile: (file: File | null) => void;
  playbackUrl: string | null;
  setPlaybackUrl: (playbackUrl: string | null) => void;
  onPlaybackUrlChange: (url: string) => void;
  handleAddToQueue: () => void;
  disabled?: boolean;
}

export const VideoUpload = ({
  file,
  setFile,
  playbackUrl,
  setPlaybackUrl,
  onPlaybackUrlChange,
  handleAddToQueue,
  disabled = false
}: VideoUploadProps) => {
  const checkFileSize = (file: File, maxGB = 5) => {
    const sizeInGB = file.size / 1024 / 1024 / 1024;
    return sizeInGB > maxGB;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {

      const isFileTooLarge = checkFileSize(e.target.files[0]);
      if (isFileTooLarge) {
        toast.error("Hệ thống chỉ hỗ trợ upload video nhỏ hơn 5GB");
        return;
      }

      setFile(e.target.files[0]);
      setPlaybackUrl(null);
    }
  };

  return (
    <div className="w-full border border-gray-200 rounded-lg p-4 mt-2">
      <div className="bg-white rounded-lg ">
        <div className="mb-2">
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              disabled={disabled}
              className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
            disabled:opacity-50 cursor-pointer"
            />
            {!playbackUrl && file && (
              <div>
                <Button
                  variant={"outline"}
                  size={"sm"}
                  onClick={handleAddToQueue}
                  className="cursor-pointer"
                >
                  <CloudUpload size={20} />
                  Upload
                </Button>
              </div>
            )}
          </div>
          {file && (
            <div className="mt-1">
              <p className="font-bold italic">Thông tin video:</p>
              <div className="space-y-1 mt-1">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold pr-1">
                    - Tên video:
                  </span>
                  {file.name}
                </p>
                <div className="flex items-center gap-2">
                  <p className="flex-1 text-sm text-gray-600">
                    <span className="font-semibold pr-1">
                      - Dung lượng:
                    </span>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <p className="flex-1 text-sm text-gray-600">
                    <span className="font-semibold pr-1">
                      - Định dạng:
                    </span>
                    {file.type}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {playbackUrl && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <h3 className="text-sm font-semibold text-green-800 mb-2">
              Video đã sẵn sàng!
            </h3>
            {/* <p className="text-sm text-green-700">
              Asset ID: {uploads.find(u => u.result?.playbackUrl === playbackUrl)?.result?.assetId}
            </p> */}
            {playbackUrl && (
              <a
                href={playbackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline mt-2 inline-block"
              >
                Xem Video
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}