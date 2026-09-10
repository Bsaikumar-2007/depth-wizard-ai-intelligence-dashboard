import React from 'react';
import {
  FolderClosed,
  Calendar,
  MapPin,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Rotate3d,
  Plane,
  Download,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { NavModule } from '../../types';

export interface ProjectData {
  id: string;
  name: string;
  state: string;
  locationCoord: string;
  sensor: string;
  risk: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  date: string;
  analysisMode: string;
  status: string;
  elevationMin: number;
  elevationMax: number;
  meanSlope: number;
  confidence: number;
  scenesCount: number;
  imagePreviewUrl?: string;
}

interface ProjectDetailsProps {
  project: ProjectData;
  onNavigate: (module: NavModule) => void;
  onOpenExport?: () => void;
  onClose: () => void;
}

const RISK_BADGES = {
  CRITICAL: 'bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]',
  HIGH: 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]',
  MODERATE: 'bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]',
  LOW: 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]',
};

export const ProjectDetails: React.FC<ProjectDetailsProps> = ({
  project,
  onNavigate,
  onOpenExport,
  onClose,
}) => {
  return (
    <div className="space-y-4 text-[13px]">
      {/* Top Status Banner */}
      <div className="p-3.5 rounded bg-[#FAFBFD] border border-[#CBD5E1]">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[11px] font-bold text-[#1E40AF]">
            {project.id}
          </span>
          <span
            className={`text-[9px] font-mono px-2 py-0.5 rounded border font-bold uppercase tracking-wider ${
              RISK_BADGES[project.risk]
            }`}
          >
            {project.risk} RISK
          </span>
        </div>
        <h3 className="text-[15px] font-bold text-[#0F172A] leading-snug">
          {project.name}
        </h3>
        <div className="flex items-center gap-3 text-[11px] text-[#64748B] mt-2 font-mono">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#1E40AF]" />
            {project.state}, India ({project.locationCoord})
          </span>
        </div>
      </div>

      {/* Two visual previews: Input Optical Image & 3D Reconstruction Preview */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Input Image Preview */}
        <div className="border border-[#CBD5E1] rounded overflow-hidden bg-[#0F172A] flex flex-col">
          <div className="px-2 py-1 bg-[#1E293B] text-[10px] font-mono text-white/80 border-b border-[#334155] flex justify-between">
            <span>INPUT OPTICAL</span>
            <span className="text-cyan-400 font-bold">RGB</span>
          </div>
          <div className="h-28 relative flex items-center justify-center p-2 bg-gradient-to-br from-[#1E293B] via-[#334155] to-[#1E40AF]/40">
            <div className="text-center font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] inline-block mb-1"></span>
              <p className="text-[10px] text-white font-semibold">{project.sensor}</p>
              <span className="text-[9px] text-[#94A3B8] block mt-0.5">0.50m GSD TrueColor</span>
            </div>
          </div>
        </div>

        {/* 3D Reconstruction Preview */}
        <div className="border border-[#CBD5E1] rounded overflow-hidden bg-[#090D16] flex flex-col">
          <div className="px-2 py-1 bg-[#141E33] text-[10px] font-mono text-white/80 border-b border-[#202E46] flex justify-between">
            <span>3D RECONSTRUCTION</span>
            <span className="text-[#38BDF8] font-bold">TIN MESH</span>
          </div>
          <div className="h-28 relative flex items-center justify-center p-2 bg-gradient-to-br from-[#0F172A] via-[#1E3A8A]/50 to-[#0284C7]/30">
            <div className="text-center font-mono">
              <Rotate3d className="w-5 h-5 text-[#38BDF8] mx-auto mb-1 animate-pulse" />
              <p className="text-[10px] text-white font-semibold">Calibrated DEM</p>
              <span className="text-[9px] text-[#94A3B8] block mt-0.5">EGM2008 ±0.42m</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metadata Specification Grid */}
      <div className="border border-[#CBD5E1] rounded bg-white p-3 space-y-2 font-mono text-[11px]">
        <div className="flex items-center justify-between pb-1.5 border-b border-[#E2E8F0] font-sans">
          <span className="font-bold text-[#0F172A] text-[12px]">Project Metadata & Processing</span>
          <span className="text-[10px] text-[#15803D] font-mono font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            {project.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pt-1">
          <div>
            <span className="text-[#64748B] block text-[10px]">ANALYSIS MODE:</span>
            <strong className="text-[#0F172A]">{project.analysisMode}</strong>
          </div>
          <div>
            <span className="text-[#64748B] block text-[10px]">ACQUISITION DATE:</span>
            <strong className="text-[#0F172A]">{project.date}</strong>
          </div>
          <div>
            <span className="text-[#64748B] block text-[10px]">ELEVATION RANGE:</span>
            <strong className="text-[#1E40AF]">
              {project.elevationMin}m – {project.elevationMax}m MSL
            </strong>
          </div>
          <div>
            <span className="text-[#64748B] block text-[10px]">MEAN SLOPE / DIP:</span>
            <strong className="text-[#B45309]">{project.meanSlope}° High Risk</strong>
          </div>
          <div>
            <span className="text-[#64748B] block text-[10px]">RELATIVE DEPTH (NORM):</span>
            <strong className="text-[#0D9488]">0.08 – 0.96 (Continuous)</strong>
          </div>
          <div>
            <span className="text-[#64748B] block text-[10px]">CONFIDENCE SCORE:</span>
            <strong className="text-[#15803D]">{project.confidence}% Calibrated</strong>
          </div>
        </div>
      </div>

      {/* Available Actions: Explore 3D, Launch Flythrough, Export GeoTIFF */}
      <div className="space-y-2 border-t border-[#E2E8F0] pt-3">
        <h4 className="text-[11px] font-mono uppercase text-[#64748B] font-semibold tracking-wider">
          Available Operations
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            onClick={() => {
              onClose();
              onNavigate('explore-3d');
            }}
            className="py-2 px-2.5 rounded bg-[#1E40AF] text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 hover:bg-[#1D4ED8] transition-colors cursor-pointer shadow-xs"
          >
            <Rotate3d className="w-3.5 h-3.5" />
            <span>Explore 3D</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onNavigate('flythrough');
            }}
            className="py-2 px-2.5 rounded bg-white border border-[#CBD5E1] text-[#0F172A] text-[11px] font-semibold flex items-center justify-center gap-1.5 hover:bg-[#F8FAFC] transition-colors cursor-pointer shadow-2xs"
          >
            <Plane className="w-3.5 h-3.5 text-[#1E40AF]" />
            <span>Flythrough</span>
          </button>

          <button
            onClick={() => {
              if (onOpenExport) {
                onOpenExport();
              } else {
                alert(`Export GeoTIFF package initialized for ${project.id}`);
              }
            }}
            className="py-2 px-2.5 rounded bg-white border border-[#CBD5E1] text-[#0F172A] text-[11px] font-semibold flex items-center justify-center gap-1.5 hover:bg-[#F8FAFC] transition-colors cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-[#475569]" />
            <span>Export GeoTIFF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
