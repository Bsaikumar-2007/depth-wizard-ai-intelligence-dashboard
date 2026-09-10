import React from 'react';
import {
  FileImage,
  Layers,
  MapPin,
  CheckCircle2,
  HardDrive,
  Maximize2,
  Cpu,
} from 'lucide-react';

interface NewAnalysisImageDetailsProps {
  onClose: () => void;
}

export const NewAnalysisImageDetails: React.FC<NewAnalysisImageDetailsProps> = () => {
  return (
    <div className="space-y-4 text-[13px]">
      {/* Top Banner */}
      <div className="p-3.5 rounded bg-[#FAFBFD] border border-[#CBD5E1]">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-mono text-[11px] font-bold text-[#1E40AF]">
            INGESTION PAYLOAD SPECIFICATION
          </span>
          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0] font-bold uppercase tracking-wider">
            STAGED // VALIDATED
          </span>
        </div>
        <h3 className="text-[15px] font-bold text-[#0F172A] leading-snug">
          CARTOSAT3_VNIR_CHAMOLI_20241018.TIF
        </h3>
        <p className="text-[12px] text-[#475569] mt-1">
          High-resolution panchromatic & multispectral optical capture over Rishiganga river head.
        </p>
      </div>

      {/* Visual Image Preview */}
      <div className="border border-[#CBD5E1] rounded overflow-hidden bg-[#0F172A] relative h-36 flex flex-col justify-between p-2">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0F172A] via-[#334155] to-[#64748B] opacity-75"></div>
        <div className="relative z-10 font-mono text-[10px] text-white/90 bg-black/40 px-2 py-1 rounded backdrop-blur-xs flex justify-between">
          <span>Rishiganga Gorge (VNIR 3-2-1 True Color)</span>
          <span className="text-cyan-400">100% ZOOM</span>
        </div>
        <div className="relative z-10 flex justify-between font-mono text-[9px] text-white/80 bg-black/60 px-2 py-1 rounded">
          <span>Sensor: Cartosat-3 Optical Camera</span>
          <span className="text-emerald-400 font-bold">BIT DEPTH: 16-BIT</span>
        </div>
      </div>

      {/* Required Specifications: Filename, File type, Resolution, File size, Location/metadata, Analysis mode */}
      <div className="border border-[#CBD5E1] rounded bg-white p-3 space-y-2 font-mono text-[11px]">
        <span className="font-sans font-bold text-[#0F172A] text-[12px] block pb-1 border-b border-[#E2E8F0]">
          Image & Sensor Metadata
        </span>

        <div className="divide-y divide-[#E2E8F0]">
          <div className="py-1.5 flex justify-between">
            <span className="text-[#64748B]">FILENAME:</span>
            <strong className="text-[#0F172A]">CARTOSAT3_VNIR_CHAMOLI_20241018.TIF</strong>
          </div>
          <div className="py-1.5 flex justify-between">
            <span className="text-[#64748B]">FILE TYPE:</span>
            <strong className="text-[#1E40AF]">GeoTIFF / Cloud-Optimized TIFF (COG)</strong>
          </div>
          <div className="py-1.5 flex justify-between">
            <span className="text-[#64748B]">SPATIAL RESOLUTION:</span>
            <strong className="text-[#0F172A]">8,192 × 8,192 px (0.50m GSD)</strong>
          </div>
          <div className="py-1.5 flex justify-between">
            <span className="text-[#64748B]">FILE SIZE:</span>
            <strong className="text-[#0F172A]">256.4 MB (Lossless LZW)</strong>
          </div>
          <div className="py-1.5 flex justify-between">
            <span className="text-[#64748B]">GEODETIC LOCATION:</span>
            <strong className="text-[#0F172A]">30°29'44.2"N 79°41'32.8"E (Uttarakhand)</strong>
          </div>
          <div className="py-1.5 flex justify-between">
            <span className="text-[#64748B]">PROJECTION & DATUM:</span>
            <strong className="text-[#0F172A]">UTM Zone 44N / WGS-84 / EGM2008</strong>
          </div>
          <div className="py-1.5 flex justify-between">
            <span className="text-[#64748B]">ANALYSIS MODE:</span>
            <strong className="text-[#15803D]">Single-View Neural Depth & TIN Mesh</strong>
          </div>
        </div>
      </div>

      {/* Radiometric Ingestion Check */}
      <div className="p-3 rounded bg-[#F0FDF4] border border-[#BBF7D0] text-[11px] font-mono space-y-1">
        <div className="flex items-center gap-1.5 text-[#15803D] font-bold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>EPHEMERIS & RPC EMBEDDED</span>
        </div>
        <p className="text-[#166534]">
          Rational Polynomial Coefficients (RPC00B) successfully decoded from TIFF geotags. Ready for instantaneous photogrammetric inversion without external GCP files.
        </p>
      </div>
    </div>
  );
};
