import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UploadItem {
  id: string;
  file: File | null;
  fileName: string;
  fileSize: number;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error';
  result?: {
    assetId: string;
    playbackUrl: string;
  };
  error?: string;
  uploadId?: string;

  formData: any;
}

interface UploadStoreState {
  uploads: UploadItem[];
}

interface UploadStoreAction {
  addToQueue: (item: Omit<UploadItem, 'progress' | 'status'>) => void;
  updateProgress: (id: string, progress: number) => void;
  updateStatus: (id: string, status: UploadItem['status'], error?: string) => void;
  updateResult: (id: string, result: UploadItem['result']) => void;
  setUploadId: (id: string, uploadId: string) => void;
  removeFromQueue: (id: string) => void;
  reset: () => void;
}

export const useUploadStore = create<UploadStoreState & UploadStoreAction>((set) => ({
  uploads: [],

  addToQueue: (item) => set((state) => ({
    uploads: [...state.uploads, { ...item, progress: 0, status: 'pending' }]
  })),

  updateProgress: (id, progress) => set((state) => ({
    uploads: state.uploads.map((u) => u.id === id ? { ...u, progress } : u)
  })),

  updateStatus: (id, status, error) => set((state) => ({
    uploads: state.uploads.map((u) => u.id === id ? { ...u, status, error } : u)
  })),

  updateResult: (id, result) => set((state) => ({
    uploads: state.uploads.map((u) => u.id === id ? { ...u, result } : u)
  })),

  setUploadId: (id, uploadId) => set((state) => ({
    uploads: state.uploads.map((u) => u.id === id ? { ...u, uploadId } : u)
  })),

  removeFromQueue: (id) => set((state) => ({
    uploads: state.uploads.filter((u) => u.id !== id)
  })),

  reset: () => set({ uploads: [] }),
}));
