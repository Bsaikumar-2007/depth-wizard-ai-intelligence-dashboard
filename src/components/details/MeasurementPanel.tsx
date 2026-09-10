import React from 'react';
import { Ruler, ArrowRight, X, CheckCircle2, RotateCcw, Crosshair } from 'lucide-react';

export interface MeasurementPoint {
  label: string;
  x: number;
  y: number;
  lat: string;
  lng: string;
  elevation: number;
}

interface MeasurementPanelProps {
  pointA: MeasurementPoint | null;
  pointB: MeasurementPoint | null;
  onResetPoints: () => void;
  onExitMeasureMode: () => void;
}

export const MeasurementPanel: React.FC<MeasurementPanelProps> = ({
  pointA,
  pointB,
  onResetPoints,
  onExitMeasureMode,
}) => {
  // Compute measurement metrics if both points exist
  const hasBoth = pointA !== null && pointB !== null;

  // Approximate horizontal distance in meters
  const horizontalDist = hasBoth
    ? Math.round(
        Math.sqrt(
          Math.pow((pointB.x - pointA.x) * 1.8, 2) +
            Math.pow((pointB.y - pointA.y) * 1.8, 2)
        )
      )
    : 0;

  const elevationDiff = hasBoth
    ? Math.round((pointB.elevation - pointA.elevation) * 10) / 10
    : 0;

  const slopeDist = hasBoth
    ? Math.round(Math.sqrt(Math.pow(horizontalDist, 2) + Math.pow(elevationDiff, 2)))
    : 0;

  const slopeAngle = hasBoth && horizontalDist > 0
    ? Math.round(Math.atan(Math.abs(elevationDiff) / horizontalDist) * (180 / Math.PI) * 10) / 10
    : 0;

  return (
    <div className="space-y-4 text-[13px]">
      {/* Mode Status Banner */}
      <div className="p-3 rounded bg-[#EFF6FF] border border-[#BFDBFE]">
        <div className="flex items-center justify-between text-[#1E40AF] font-bold mb-1">
          <span className="flex items-center gap-1.5 font-mono text-[11px]">
            <Crosshair className="w-3.5 h-3.5 text-[#1E40AF] animate-spin" />
            TERRAIN TRANSECT MEASURE TOOL
          </span>
          <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-[#BFDBFE]">
            ACTIVE
          </span>
        </div>
        <p className="text-[12px] text-[#1E3A8A]">
          Click any two points on the 3D surface to calculate 3D geodesic distance, elevation delta, and gradient profile.
        </p>
      </div>

      {/* Point Selection Status */}
      <div className="space-y-2 font-mono text-[11px]">
        {/* Point A */}
        <div
          className={`p-2.5 rounded border transition-colors ${
            pointA
              ? 'bg-white border-[#CBD5E1]'
              : 'bg-[#F8FAFC] border-dashed border-[#CBD5E1] text-[#64748B]'
          }`}
        >
          <div className="flex items-center justify-between font-sans">
            <span className="font-bold text-[#1E40AF] flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1E40AF] text-white flex items-center justify-center text-[8px] font-mono">
                A
              </span>
              POINT A {pointA ? '(LOCKED)' : '(AWAITING CLICK)'}
            </span>
            {pointA && (
              <span className="text-[#15803D] font-mono text-[10px] font-bold">
                ELEV: {pointA.elevation.toLocaleString()}m MSL
              </span>
            )}
          </div>
          {pointA ? (
            <div className="mt-1.5 text-[10px] text-[#475569] grid grid-cols-2 gap-2">
              <span>Coord: {pointA.lat}, {pointA.lng}</span>
              <span>Screen: X:{Math.round(pointA.x)}, Y:{Math.round(pointA.y)}</span>
            </div>
          ) : (
            <p className="text-[10px] text-[#94A3B8] mt-1 font-mono">
              Click anywhere on the 3D terrain canvas to place Point A.
            </p>
          )}
        </div>

        {/* Point B */}
        <div
          className={`p-2.5 rounded border transition-colors ${
            pointB
              ? 'bg-white border-[#CBD5E1]'
              : 'bg-[#F8FAFC] border-dashed border-[#CBD5E1] text-[#64748B]'
          }`}
        >
          <div className="flex items-center justify-between font-sans">
            <span className="font-bold text-[#DC2626] flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626] text-white flex items-center justify-center text-[8px] font-mono">
                B
              </span>
              POINT B {pointB ? '(LOCKED)' : '(AWAITING CLICK)'}
            </span>
            {pointB && (
              <span className="text-[#15803D] font-mono text-[10px] font-bold">
                ELEV: {pointB.elevation.toLocaleString()}m MSL
              </span>
            )}
          </div>
          {pointB ? (
            <div className="mt-1.5 text-[10px] text-[#475569] grid grid-cols-2 gap-2">
              <span>Coord: {pointB.lat}, {pointB.lng}</span>
              <span>Screen: X:{Math.round(pointB.x)}, Y:{Math.round(pointB.y)}</span>
            </div>
          ) : (
            <p className="text-[10px] text-[#94A3B8] mt-1 font-mono">
              Click another point on the 3D terrain to place Point B.
            </p>
          )}
        </div>
      </div>

      {/* Calculated Measurements Result Card */}
      {hasBoth ? (
        <div className="border border-[#CBD5E1] rounded bg-[#FAFBFD] p-3.5 space-y-3 font-mono text-[11px]">
          <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0] font-sans">
            <span className="font-bold text-[12px] text-[#0F172A] flex items-center gap-1.5">
              <Ruler className="w-3.5 h-3.5 text-[#1E40AF]" />
              Calculated Geodesic Vector
            </span>
            <span className="text-[10px] bg-[#DCFCE7] text-[#15803D] px-1.5 py-0.5 rounded font-bold">
              SOLVED
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-2 rounded bg-white border border-[#E2E8F0]">
              <span className="text-[#64748B] block text-[10px]">HORIZONTAL DISTANCE:</span>
              <strong className="text-[15px] text-[#0F172A]">{horizontalDist.toLocaleString()} meters</strong>
            </div>

            <div className="p-2 rounded bg-white border border-[#E2E8F0]">
              <span className="text-[#64748B] block text-[10px]">SLOPE 3D DISTANCE:</span>
              <strong className="text-[15px] text-[#1E40AF]">{slopeDist.toLocaleString()} meters</strong>
            </div>

            <div className="p-2 rounded bg-white border border-[#E2E8F0]">
              <span className="text-[#64748B] block text-[10px]">ELEVATION DIFFERENCE (ΔZ):</span>
              <strong className={`text-[15px] ${elevationDiff >= 0 ? 'text-[#15803D]' : 'text-[#DC2626]'}`}>
                {elevationDiff >= 0 ? `+${elevationDiff}` : elevationDiff} meters
              </strong>
            </div>

            <div className="p-2 rounded bg-white border border-[#E2E8F0]">
              <span className="text-[#64748B] block text-[10px]">AVERAGE GRADIENT / SLOPE:</span>
              <strong className="text-[15px] text-[#B45309]">{slopeAngle}° ({Math.round(Math.tan(slopeAngle * Math.PI / 180) * 100)}%)</strong>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded border border-dashed border-[#CBD5E1] text-center font-mono text-[11px] text-[#64748B]">
          Select both Point A and Point B on the terrain to see distance and elevation deltas.
        </div>
      )}

      {/* Control Buttons */}
      <div className="grid grid-cols-2 gap-2 border-t border-[#E2E8F0] pt-3">
        <button
          onClick={onResetPoints}
          className="py-2 px-3 rounded border border-[#CBD5E1] bg-white text-[#0F172A] text-[11px] font-semibold flex items-center justify-center gap-1.5 hover:bg-[#F8FAFC] transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#475569]" />
          <span>Reset Points</span>
        </button>

        <button
          onClick={onExitMeasureMode}
          className="py-2 px-3 rounded bg-[#0F172A] text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 hover:bg-[#1E293B] transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
          <span>Exit Measurement</span>
        </button>
      </div>
    </div>
  );
};
