"use client";

import { useRef, useState } from "react";

import * as UpChunk from '@mux/upchunk';
import VideoService from "@/services/video.service";
import { toast } from "sonner";

interface UploadProgress {
  percentage: number;
  uploadedBytes: number;
  totalBytes: number;
}

export const VideoUpload = () => {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
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
        toast.error("Failed to create upload URL");
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
        setUploading(false);

        setTimeout(() => {
          checkVideoStatus(uploadId);
        }, 2000);
      });

      upload.on('error', (err) => {
        console.error('Upload error:', err);
        setError('Upload failed. Please try again.');
        setUploading(false);
      });
    } catch (error: any) {
      console.error('Error creating upload URL:', error);
      setError(error.response?.data?.message || 'Failed to initialize upload');
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

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Upload Video to Mux</h2>

        {/* File Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Video File
          </label>
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
            <p className="mt-2 text-sm text-gray-600">
              Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Progress Bar */}
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

        {/* Upload Button */}
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

        {/* Asset Info */}
        {assetId && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <h3 className="text-sm font-semibold text-green-800 mb-2">
              Upload Successful!
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
      </div>
    </div>
  );
}