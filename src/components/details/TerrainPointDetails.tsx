import React from 'react';
import {
  MapPin,
  TrendingUp,
  Layers,
  ShieldCheck,
  Compass,
  AlertTriangle,
  Rotate3d,
  Ruler,
} from 'lucide-react';

export interface TerrainPointData {
  pinId: string;
  label: string;
  lat: string;
  lng: string;
  utmGrid: string;
  elevation: number;
  relativeDepth: number;
  slope: number;
  aspect: string;
  confidence: number;
  lithology: string;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
}

interface TerrainPointDetailsProps {
  point: TerrainPointData;
  onMeasureFromHere?: () => void;
  onClose: () => void;
}

export const TerrainPointDetails: React.FC<TerrainPointDetailsProps> = ({
  point,
  onMeasureFromHere,
  onClose,
}) => {
  return (
    <div className="space-y-4 text-[13px]">
      {/* Top Point Banner */}
      <div className="p-3.5 rounded bg-[#FAFBFD] border border-[#CBD5E1]">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-mono text-[12px] font-bold text-[#DC2626] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-pulse"></span>
            {point.pinId}: {point.label}
          </span>
          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] font-bold uppercase tracking-wider">
            {point.riskLevel} CHOKEPOINT
          </span>
        </div>
        <p className="text-[12px] text-[#475569]">
          Selected terrain surface node sampled from neural photogrammetric DEM mesh.
        </p>
      </div>

      {/* Grid Coordinates & Positioning */}
      <div className="border border-[#CBD5E1] rounded bg-white p-3 space-y-2 font-mono text-[11px]">
        <div className="flex items-center gap-1.5 font-sans font-bold text-[#0F172A] text-[12px] pb-1.5 border-b border-[#E2E8F0]">
          <MapPin className="w-3.5 h-3.5 text-[#1E40AF]" />
          <span>Geodetic & Grid Coordinates</span>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-1">
          <div>
            <span className="text-[#64748B] block text-[10px]">WGS84 LATITUDE / LONGITUDE:</span>
            <strong className="text-[#0F172A]">{point.lat}, {point.lng}</strong>
          </div>
          <div>
            <span className="text-[#64748B] block text-[10px]">UTM ZONE 44N PROJECTED:</span>
            <strong className="text-[#0F172A]">{point.utmGrid}</strong>
          </div>
        </div>
      </div>

      {/* Elevation, Depth, Slope, Confidence Statistics */}
      <div className="grid grid-cols-2 gap-2.5 font-mono text-[11px]">
        {/* Elevation */}
        <div className="p-3 rounded bg-[#EFF6FF] border border-[#BFDBFE]">
          <span className="text-[#64748B] block text-[10px]">METRIC ELEVATION</span>
          <strong className="text-[16px] text-[#1E40AF] block my-0.5">
            {point.elevation.toLocaleString()} m MSL
          </strong>
          <span className="text-[10px] text-[#1E3A8A]">EGM2008 Datum (±0.8m)</span>
        </div>

        {/* Relative Depth */}
        <div className="p-3 rounded bg-[#F0FDFA] border border-[#99F6E4]">
          <span className="text-[#64748B] block text-[10px]">RELATIVE DEPTH</span>
          <strong className="text-[16px] text-[#0F766E] block my-0.5">
            {point.relativeDepth.toFixed(3)} (Norm)
          </strong>
          <span className="text-[10px] text-[#115E59]">Normalized canyon depth</span>
        </div>

        {/* Slope */}
        <div className="p-3 rounded bg-[#FEF2F2] border border-[#FECACA]">
          <span className="text-[#64748B] block text-[10px]">SLOPE GRADIENT</span>
          <strong className="text-[16px] text-[#DC2626] block my-0.5">
            {point.slope.toFixed(1)}° (High Risk)
          </strong>
          <span className="text-[10px] text-[#991B1B]">Aspect: {point.aspect}</span>
        </div>

        {/* Confidence */}
        <div className="p-3 rounded bg-[#F0FDF4] border border-[#BBF7D0]">
          <span className="text-[#64748B] block text-[10px]">NEURAL CONFIDENCE</span>
          <strong className="text-[16px] text-[#15803D] block my-0.5">
            {point.confidence}%
          </strong>
          <span className="text-[10px] text-[#166534]">GCP residual: 0.38m</span>
        </div>
      </div>

      {/* Geological Lithology */}
      <div className="p-3 rounded bg-[#F8FAFC] border border-[#CBD5E1] text-[12px] space-y-1">
        <span className="font-bold text-[#0F172A] block font-mono text-[11px] uppercase tracking-wider text-[#64748B]">
          Geological Bedrock Lithology
        </span>
        <p className="text-[#334155] font-medium">{point.lithology}</p>
        <p className="text-[#64748B] text-[11px]">
          Colluvial moraine veneer overlying high-grade crystalline gneiss. High propensity for saturated soil creep during monsoon discharge.
        </p>
      </div>

      {/* Action: Use point for measurement */}
      {onMeasureFromHere && (
        <div className="border-t border-[#E2E8F0] pt-3">
          <button
            onClick={onMeasureFromHere}
            className="w-full py-2 px-3 rounded bg-[#1E40AF] text-white text-[12px] font-semibold flex items-center justify-center gap-1.5 hover:bg-[#1D4ED8] transition-colors cursor-pointer"
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>Measure Transect Distance From This Point</span>
          </button>
        </div>
      )}
    </div>
  );
};
