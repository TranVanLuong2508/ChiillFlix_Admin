"use client";

import { useEffect, useRef } from "react";
import * as UpChunk from '@mux/upchunk';
import { useUploadStore } from "@/stores/upload.store";
import VideoService from "@/services/video.service";
import { toast } from "sonner";

export const UploadManager = () => {
  const { uploads, updateProgress, updateStatus, updateResult, setUploadId } = useUploadStore();
  const activeUploads = useRef<Set<string>>(new Set());
  const uploadInstances = useRef<Map<string, UpChunk.UpChunk>>(new Map());

  useEffect(() => {
    const pendingUploads = uploads.filter(u => u.status === 'pending');
    pendingUploads.forEach(uploadItem => {
      if (activeUploads.current.has(uploadItem.id)) return;
      startUpload(uploadItem.id, uploadItem.file);
    });

    const currentUploadIds = new Set(uploads.map(u => u.id));
    activeUploads.current.forEach(id => {
      if (!currentUploadIds.has(id)) {
        const upload = uploadInstances.current.get(id);
        if (upload) {
          upload.abort();
          uploadInstances.current.delete(id);
          console.log(`Aborted upload ${id}`);
        }
        activeUploads.current.delete(id);
      }
    });

  }, [uploads]);

  const startUpload = async (id: string, file: File | null) => {
    if (!file) return;

    activeUploads.current.add(id);
    updateStatus(id, 'uploading');

    try {
      const res = await VideoService.createURLUpload({
        title: file.name,
        description: 'Uploaded from web app',
      });

      if (res.EC !== 0 || !res.data) {
        updateStatus(id, 'error', res.EM);
        activeUploads.current.delete(id);
        return;
      }

      const url = res.data?.url;
      const uploadId = res.data?.uploadId;

      if (!url || !uploadId) {
        updateStatus(id, 'error', "Lỗi không thể tạo video URL");
        activeUploads.current.delete(id);
        return;
      }

      setUploadId(id, uploadId);

      const upload = UpChunk.createUpload({
        endpoint: url,
        file: file,
        chunkSize: 5120,
      });

      uploadInstances.current.set(id, upload);

      upload.on('progress', (progressEvent) => {
        updateProgress(id, Math.floor(progressEvent.detail));
      });

      upload.on('success', () => {
        console.log('Upload successful for', id);
        updateStatus(id, 'processing');
        uploadInstances.current.delete(id);
        checkVideoStatus(id, uploadId);
      });

      upload.on('error', (err) => {
        console.error('Upload error:', err);
        if (err.detail?.message === "Upload aborted") {
          return;
        }
        updateStatus(id, 'error', 'Upload video thất bại.');
        activeUploads.current.delete(id);
        uploadInstances.current.delete(id);
      });

    } catch (error: any) {
      console.error('Error creating upload URL:', error);
      updateStatus(id, 'error', error.response?.data?.message || 'Lỗi không thể khởi tạo video upload');
      activeUploads.current.delete(id);
    }
  };

  const checkVideoStatus = async (id: string, uploadId: string) => {
    if (!activeUploads.current.has(id)) return;

    try {
      const res = await VideoService.getVideo(uploadId);

      if (res.EC !== 0 || !res.data) {
        updateStatus(id, 'error', res.EM);
        activeUploads.current.delete(id);
        return;
      }

      if (res.data.id) {
        if (res.data.status === 'ready') {
          updateResult(id, {
            assetId: res.data.id,
            playbackUrl: res.data.playbackUrl
          });
          updateStatus(id, 'completed');
          activeUploads.current.delete(id);
          toast.success(`Video ${id} đã sẵn sàng!`);
        } else {
          setTimeout(() => checkVideoStatus(id, uploadId), 3000);
        }
      }
    } catch (err) {
      console.error('Error checking video status:', err);
    }
  };

  return null;
};
