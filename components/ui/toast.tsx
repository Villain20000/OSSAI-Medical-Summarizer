'use client';

import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  type?: 'error' | 'info';
}

export function Toast({ message, isVisible, onClose, type = 'error' }: ToastProps) {
  const isError = type === 'error';
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className={cn(
            "fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-white border rounded-xl shadow-lg",
            isError ? "border-red-200" : "border-[#0000FF]/20 bg-[#0000FF]/5"
          )}
        >
          {isError ? (
            <AlertCircle className="w-5 h-5 text-red-600" />
          ) : (
            <Info className="w-5 h-5 text-[#0000FF]" />
          )}
          <span className="text-sm font-medium text-slate-800">{message}</span>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
