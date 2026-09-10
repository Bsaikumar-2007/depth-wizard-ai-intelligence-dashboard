import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export interface DetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  badge?: {
    text: string;
    variant?: 'blue' | 'green' | 'amber' | 'red' | 'gray';
  };
  children: React.ReactNode;
  widthClass?: string;
}

const BADGE_STYLES = {
  blue: 'bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]',
  green: 'bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]',
  amber: 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]',
  red: 'bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]',
  gray: 'bg-[#F1F5F9] text-[#475569] border-[#CBD5E1]',
};

export const DetailPanel: React.FC<DetailPanelProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  badge,
  children,
  widthClass = 'w-full sm:w-[460px] md:w-[500px]',
}) => {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none flex justify-end">
          {/* Subtle backdrop scrim that doesn't perturb the background page */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={onClose}
            className="fixed inset-0 bg-black/25 pointer-events-auto"
            aria-hidden="true"
          />

          {/* Slide-in Detail Panel: Smooth ease-out, 350ms, translateX(100%) -> 0 on desktop, translateY(100%) -> 0 on mobile */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{
              opacity: 0,
              x: '100%',
              y: 0,
            }}
            animate={{
              opacity: 1,
              x: 0,
              y: 0,
            }}
            exit={{
              opacity: 0,
              x: '100%',
              y: 0,
            }}
            transition={{
              duration: 0.35,
              ease: [0.16, 1, 0.3, 1], // Smooth professional ease-out
            }}
            className={`pointer-events-auto relative h-full max-h-screen bg-white shadow-2xl border-l border-[#CBD5E1] flex flex-col z-50 ${widthClass} overflow-hidden`}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#FAFBFD] flex items-start justify-between gap-3 shrink-0">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h2 className="text-[15px] font-bold text-[#0F172A] tracking-tight truncate font-sans">
                    {title}
                  </h2>
                  {badge && (
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded border font-semibold tracking-wider uppercase ${
                        BADGE_STYLES[badge.variant || 'blue']
                      }`}
                    >
                      {badge.text}
                    </span>
                  )}
                </div>
                {subtitle && (
                  <p className="text-[11px] text-[#64748B] font-mono leading-relaxed truncate">
                    {subtitle}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close detail panel"
                className="p-1.5 rounded text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 font-sans text-[#334155]">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
