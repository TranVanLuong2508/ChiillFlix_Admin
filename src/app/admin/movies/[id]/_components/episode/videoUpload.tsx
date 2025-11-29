"use client";

import { MutableRefObject } from "react";

import * as UpChunk from '@mux/upchunk';
import VideoService from "@/services/video.service";
import { toast } from "sonner";

interface UploadProgress {
  percentage: number;
  uploadedBytes: number;
  totalBytes: number;
}

interface VideoUploadProps {
  file: File | null;
  setFile: (file: File | null) => void;
  uploading: boolean;
  setUploading: (uploading: boolean) => void;
  progress: UploadProgress;
  setProgress: (progress: UploadProgress) => void;
  assetId: string | null;
  setAssetId: (assetId: string | null) => void;
  error: string | null;
  setError: (error: string | null) => void;
  playbackUrl: string | null;
  setPlaybackUrl: (playbackUrl: string | null) => void;
  uploadRef: MutableRefObject<any>;
  onPlaybackUrlChange: (url: string) => void;
}

export const VideoUpload = ({
  file,
  setFile,
  uploading,
  setUploading,
  progress,
  setProgress,
  assetId,
  setAssetId,
  error,
  setError,
  playbackUrl,
  setPlaybackUrl,
  uploadRef,
  onPlaybackUrlChange
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
      setError(null);
      setAssetId(null);
      setPlaybackUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Vui lòng chọn file để upload");
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const res = await VideoService.createURLUpload({
        title: file.name,
        description: 'Uploaded from web app',
      });

      if (res.EC !== 0 || !res.data) {
        toast.error(res.EM);
        setUploading(false);
        return;
      }

      const url = res.data?.url;
      const uploadId = res.data?.uploadId;

      if (!url || !uploadId) {
        toast.error("Lỗi không thể tạo video URL");
        setUploading(false);
        return;
      }

      const upload = UpChunk.createUpload({
        endpoint: url,
        file: file,
        chunkSize: 5120,
      });

      uploadRef.current = upload;
      upload.on('progress', (progressEvent) => {
        setProgress({
          percentage: Math.floor(progressEvent.detail),
          uploadedBytes: 0,
          totalBytes: file.size,
        });
      });

      upload.on('success', () => {
        console.log('Upload successful!');

        setTimeout(() => {
          checkVideoStatus(uploadId);
        }, 2000);
      });

      upload.on('error', (err) => {
        console.error('Upload error:', err);
        setError('Upload video thất bại. Vui lòng thử lại.');
        setUploading(false);
      });
    } catch (error: any) {
      console.error('Error creating upload URL:', error);
      setError(error.response?.data?.message || 'Lỗi không thể khởi tạo video upload');
      setUploading(false);
    }
  }

  const checkVideoStatus = async (uploadId: string) => {
    try {
      const res = await VideoService.getVideo(uploadId);

      if (res.EC !== 0 || !res.data) {
        toast.error(res.EM);
        setUploading(false);
        return;
      }

      if (res.data.id) {
        setAssetId(res.data.id);

        if (res.data.status === 'ready') {
          setPlaybackUrl(res.data.playbackUrl);
          onPlaybackUrlChange(res.data.playbackUrl);
        } else {
          setTimeout(() => checkVideoStatus(uploadId), 3000);
        }
      }
    } catch (err) {
      console.error('Error checking video status:', err);
    }
  };

  const handleCancel = () => {
    if (uploadRef.current) {
      uploadRef.current.abort();
      setUploading(false);
      setProgress({ percentage: 0, uploadedBytes: 0, totalBytes: 0 });
    }
  };

  console.log("my check: ", file);

  return (
    <div className="w-full border border-gray-200 rounded-lg p-4 mt-2">
      <div className="bg-white rounded-lg ">
        {/* File Input */}
        <div className="mb-4">
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
            disabled:opacity-50"
          />
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

        {assetId && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md mb-4">
            <h3 className="text-sm font-semibold text-green-800 mb-2">
              Upload video thành công!
            </h3>
            <p className="text-sm text-green-700">Asset ID: {assetId}</p>
            {playbackUrl && (
              <a
                href={playbackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline mt-2 inline-block"
              >
                View Video
              </a>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {uploading && (
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Uploading...</span>
              <span className="text-sm font-medium text-gray-700">
                {progress.percentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress.percentage}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md
              hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed
              font-medium transition-colors"
          >
            {uploading ? 'Uploading...' : 'Upload Video'}
          </button>

          {uploading && (
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-md
                hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}