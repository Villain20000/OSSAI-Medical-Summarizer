'use client';

import { useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
  onError?: (error: string) => void;
}

export function FileUpload({ onFileSelect, isLoading, onError }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0 && !isLoading) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect, isLoading]);

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0 && onError) {
      const { errors } = fileRejections[0];
      if (errors[0]?.code === 'file-too-large') {
        onError('File is too large. Maximum size is 5MB.');
      } else if (errors[0]?.code === 'file-invalid-type') {
        onError('Unsupported file type. Please upload PDF or TXT.');
      } else {
        onError(errors[0]?.message || 'Invalid file.');
      }
    }
  }, [onError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB limit
    maxFiles: 1,
    disabled: isLoading,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative group flex flex-col items-center justify-center w-full p-16 border-2 border-dashed rounded-2xl bg-white cursor-pointer transition-all duration-200 overflow-hidden shadow-sm",
        isDragActive ? "border-[#0000FF] bg-[#0000FF]/5" : "border-slate-300 hover:border-[#0000FF]/50 hover:bg-slate-50",
        isLoading && "opacity-50 cursor-not-allowed"
      )}
    >
      <input {...getInputProps()} />
      
      <div className="relative z-10 flex flex-col items-center gap-5">
        <div className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300",
          isDragActive ? "bg-[#0000FF]/10 text-[#0000FF] scale-110" : "bg-slate-100 text-slate-500 group-hover:bg-[#0000FF]/10 group-hover:text-[#0000FF]"
        )}>
          <UploadCloud className="w-8 h-8" />
        </div>
        
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-slate-700">
            {isDragActive ? "Drop document here" : "Click or drag document to upload"}
          </p>
          <p className="text-sm text-slate-500">
            Supports PDF and TXT up to 5MB
          </p>
        </div>
      </div>
    </div>
  );
}
