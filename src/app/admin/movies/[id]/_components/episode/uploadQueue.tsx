"use client";

import { useUploadStore } from "@/stores/upload.store";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CloudUpload, StepForward, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadQueueProps {
  onRestore: (uploadId: string) => void;
}

export const UploadQueue = ({ onRestore }: UploadQueueProps) => {
  const { uploads, removeFromQueue } = useUploadStore();

  if (uploads.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 w-[450px] bg-white border rounded-lg shadow-lg z-50 overflow-hidden">
      <Accordion type="single" collapsible>
        <AccordionItem value="upload-queue" className="border-none">
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-2">
              <CloudUpload size={20} className="text-blue-600" />
              <span className="font-semibold text-sm">
                Danh sách upload ({uploads.length})
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-0 pb-0 max-h-[300px] overflow-y-auto">
            <div className="divide-y">
              {uploads.map((upload) => (
                <div key={upload.id} className="py-2 px-3 m-1 hover:bg-gray-100 transition-colors rounded-lg border border-gray-150 hover:border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="min-w-[50px] pr-2">
                      <p className="text-sm font-medium truncate mb-1" title={upload.formData.title}>
                        {upload.formData.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(upload.fileSize / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <div className="flex-1 max-w-[220px] pl-2">
                      <div className="w-full bg-gray-200 rounded-full">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${upload.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 items-center">
                      <div className="flex-1">

                        {upload.status === 'processing' && (
                          <div className="w-full bg-gray-200 rounded-full h-1.5 animate-pulse">
                            <div className="bg-yellow-500 h-1.5 rounded-full w-full" />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center">
                        <div className="text-xs font-medium min-w-[80px] text-right">
                          {upload.status === 'pending' && <span className="text-gray-500">Pending</span>}
                          {upload.status === 'uploading' && <span className="text-blue-600">{upload.progress}%</span>}
                          {upload.status === 'processing' && <span className="text-yellow-600">Processing</span>}
                          {upload.status === 'completed' && (
                            <Button
                              variant="link"
                              className="p-0 text-blue-600 font-semibold flex items-center gap-1 cursor-pointer"
                              onClick={() => onRestore(upload.id)}
                            >
                              <StepForward className="size-4" /> Tiếp tục
                            </Button>
                          )}
                          {upload.status === 'error' && <span className="text-red-600">Error</span>}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-gray-400/20 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromQueue(upload.id);
                          }}
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* <div className="flex items-center gap-3">
                    <div className="flex-1">
                      {upload.status === 'uploading' && (
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${upload.progress}%` }}
                          />
                        </div>
                      )}
                      {upload.status === 'processing' && (
                        <div className="w-full bg-gray-200 rounded-full h-1.5 animate-pulse">
                          <div className="bg-yellow-500 h-1.5 rounded-full w-full" />
                        </div>
                      )}
                    </div>

                    <div className="text-xs font-medium min-w-[80px] text-right">
                      {upload.status === 'pending' && <span className="text-gray-500">Pending</span>}
                      {upload.status === 'uploading' && <span className="text-blue-600">{upload.progress}%</span>}
                      {upload.status === 'processing' && <span className="text-yellow-600">Processing</span>}
                      {upload.status === 'completed' && (
                        <Button
                          variant="link"
                          className="h-auto p-0 text-green-600 font-semibold"
                          onClick={() => onRestore(upload.id)}
                        >
                          Hoàn tất
                        </Button>
                      )}
                      {upload.status === 'error' && <span className="text-red-600">Error</span>}
                    </div>
                  </div> */}

                  {upload.error && (
                    <p className="text-xs text-red-500 mt-1">{upload.error}</p>
                  )}
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
