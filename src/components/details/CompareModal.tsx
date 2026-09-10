import React, { useState } from 'react';
import { X, Layers, Sliders, ArrowLeftRight, CheckCircle2 } from 'lucide-react';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [sliderPos, setSliderPos] = useState<number>(50);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-lg shadow-2xl border border-[#CBD5E1] w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#FAFBFD] flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] font-mono text-[#1E40AF] font-bold">
              PRE / POST DISASTER ELEVATION COMPARISON
            </span>
            <h3 className="text-[16px] font-bold text-[#0F172A]">
              Baseline Pre-Event DEM vs. Post-Event Neural Reconstruction
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Comparison Viewer with Interactive Swipe Slider */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between text-[12px] font-mono">
            <span className="text-[#1E40AF] font-bold">
              ◀ PRE-EVENT: Baseline CartoDEM (2020)
            </span>
            <span className="text-[#DC2626] font-bold">
              POST-EVENT: Single-View Reconstructed DEM (2024) ▶
            </span>
          </div>

          {/* Interactive Split Canvas / Visual Area */}
          <div className="relative h-72 rounded border border-[#CBD5E1] overflow-hidden select-none bg-[#0F172A]">
            {/* Left side: Pre-event pristine valley */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-[#1E3A8A] to-[#0284C7] overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
              <div className="p-4 text-white font-mono">
                <span className="bg-black/60 px-2 py-1 rounded text-[11px] font-bold">
                  PRE-BREACH RIVER CANYON
                </span>
                <p className="text-[10px] text-white/80 mt-2">
                  Unobstructed Riverbed • Elevation 2,121m MSL • Impoundment: 0 m³
                </p>
              </div>
            </div>

            {/* Right side: Post-event debris impoundment */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-[#7F1D1D] to-[#B91C1C] overflow-hidden"
              style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
            >
              <div className="p-4 text-right text-white font-mono">
                <span className="bg-black/60 px-2 py-1 rounded text-[11px] font-bold">
                  POST-BREACH DAM ACCUMULATION
                </span>
                <p className="text-[10px] text-white/80 mt-2">
                  Debris Barrier (+24.6m Δz) • Impoundment: 3.85M m³ • High Risk
                </p>
              </div>
            </div>

            {/* Divider bar */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-lg flex items-center justify-center"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="w-6 h-6 rounded-full bg-white border border-[#CBD5E1] shadow-md flex items-center justify-center text-[#0F172A]">
                <ArrowLeftRight className="w-3 h-3" />
              </div>
            </div>
          </div>

          {/* Slider Input */}
          <div className="space-y-1">
            <div className="flex justify-between font-mono text-[11px] text-[#64748B]">
              <span>Pre-Event (0%)</span>
              <span>Split Position: {sliderPos}%</span>
              <span>Post-Event (100%)</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              className="w-full h-2 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer accent-[#1E40AF]"
            />
          </div>

          {/* Volumetric Change Table */}
          <div className="border border-[#CBD5E1] rounded bg-[#FAFBFD] p-3 font-mono text-[11px] space-y-2">
            <span className="font-sans font-bold text-[#0F172A] text-[12px] block pb-1 border-b border-[#E2E8F0]">
              Differential Volumetric Surface Analysis
            </span>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 rounded bg-white border border-[#E2E8F0]">
                <span className="text-[#64748B] block text-[10px]">DEBRIS ACCUMULATION:</span>
                <strong className="text-[14px] text-[#DC2626]">+1,420,000 m³</strong>
              </div>
              <div className="p-2 rounded bg-white border border-[#E2E8F0]">
                <span className="text-[#64748B] block text-[10px]">MAX CREST ELEVATION:</span>
                <strong className="text-[14px] text-[#1E40AF]">2,145.6 m MSL</strong>
              </div>
              <div className="p-2 rounded bg-white border border-[#E2E8F0]">
                <span className="text-[#64748B] block text-[10px]">WATER RETENTION CAPACITY:</span>
                <strong className="text-[14px] text-[#B45309]">3,850,000 m³</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-[#0F172A] text-[12px] font-semibold text-white hover:bg-[#1E293B] cursor-pointer"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
