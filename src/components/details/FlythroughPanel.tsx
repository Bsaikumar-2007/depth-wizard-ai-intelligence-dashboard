import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Plane,
  Compass,
  Gauge,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import { NavModule } from '../../types';

interface FlythroughPanelProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onRestart: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  elapsedSeconds: number;
  totalSeconds: number;
  cameraWaypoint: string;
  cameraElevation: number;
  distanceTraveled: number;
  onNavigate?: (module: NavModule) => void;
  onClose: () => void;
}

export const FlythroughPanel: React.FC<FlythroughPanelProps> = ({
  isPlaying,
  onTogglePlay,
  onRestart,
  speed,
  onSpeedChange,
  elapsedSeconds,
  totalSeconds,
  cameraWaypoint,
  cameraElevation,
  distanceTraveled,
  onNavigate,
  onClose,
}) => {
  const progressPercent = Math.min(100, Math.round((elapsedSeconds / totalSeconds) * 100));

  return (
    <div className="space-y-4 text-[13px]">
      {/* Flight Status Header */}
      <div className="p-3.5 rounded bg-[#FAFBFD] border border-[#CBD5E1]">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-mono text-[11px] font-bold text-[#1E40AF] flex items-center gap-1.5">
            <Plane className="w-3.5 h-3.5" />
            UAV FLIGHT TRAJECTORY // CORRIDOR #04
          </span>
          <span
            className={`text-[9px] font-mono px-2 py-0.5 rounded border font-bold uppercase tracking-wider ${
              isPlaying
                ? 'bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]'
                : 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]'
            }`}
          >
            {isPlaying ? 'ACTIVE FLIGHT' : 'PAUSED'}
          </span>
        </div>
        <p className="text-[12px] text-[#475569]">
          Autonomous drone inspection path along the Rishiganga river gorge chokepoints and debris barrier.
        </p>

        {/* Timeline Progress Bar */}
        <div className="mt-3 space-y-1">
          <div className="flex justify-between font-mono text-[10px] text-[#64748B]">
            <span>{Math.floor(elapsedSeconds / 60)}:{(elapsedSeconds % 60).toString().padStart(2, '0')}</span>
            <span>Progress {progressPercent}%</span>
            <span>{Math.floor(totalSeconds / 60)}:{(totalSeconds % 60).toString().padStart(2, '0')}</span>
          </div>
          <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1E40AF] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Flight Controls Bar */}
      <div className="p-3 bg-white rounded border border-[#CBD5E1] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePlay}
            className={`px-3 py-1.5 rounded text-white text-[12px] font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs ${
              isPlaying ? 'bg-[#D97706] hover:bg-[#B45309]' : 'bg-[#1E40AF] hover:bg-[#1D4ED8]'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <button
            onClick={onRestart}
            className="p-1.5 rounded bg-white border border-[#CBD5E1] text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer"
            title="Restart Flight"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-1 font-mono text-[11px]">
          <span className="text-[#64748B] text-[10px]">SPEED:</span>
          {[0.5, 1.0, 2.0].map((s) => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              className={`px-2 py-0.5 rounded border text-[10px] font-bold cursor-pointer transition-colors ${
                speed === s
                  ? 'bg-[#1E40AF] text-white border-[#1E40AF]'
                  : 'bg-white text-[#475569] border-[#CBD5E1] hover:bg-[#F8FAFC]'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Real-time Telemetry Metrics */}
      <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
        <div className="p-2.5 rounded bg-[#F8FAFC] border border-[#E2E8F0]">
          <span className="text-[#64748B] block text-[10px]">CAMERA POSITION</span>
          <strong className="text-[14px] text-[#0F172A]">{cameraWaypoint}</strong>
          <span className="text-[10px] text-[#64748B] block">30°29'44"N 79°41'32"E</span>
        </div>

        <div className="p-2.5 rounded bg-[#F8FAFC] border border-[#E2E8F0]">
          <span className="text-[#64748B] block text-[10px]">CAMERA ALTITUDE</span>
          <strong className="text-[14px] text-[#1E40AF]">{cameraElevation.toLocaleString()} m MSL</strong>
          <span className="text-[10px] text-[#1E3A8A] block">Rel Clearance: 180m</span>
        </div>

        <div className="p-2.5 rounded bg-[#F8FAFC] border border-[#E2E8F0]">
          <span className="text-[#64748B] block text-[10px]">DISTANCE TRAVELED</span>
          <strong className="text-[14px] text-[#15803D]">{distanceTraveled.toLocaleString()} m</strong>
          <span className="text-[10px] text-[#166534] block">Total Track: 2,400m</span>
        </div>

        <div className="p-2.5 rounded bg-[#F8FAFC] border border-[#E2E8F0]">
          <span className="text-[#64748B] block text-[10px]">CURRENT AIRSPEED</span>
          <strong className="text-[14px] text-[#0F172A]">{(24 * speed).toFixed(1)} km/h</strong>
          <span className="text-[10px] text-[#64748B] block">Gimbal: -28° Pitch</span>
        </div>
      </div>

      {/* Flight Path Waypoints Summary */}
      <div className="border border-[#CBD5E1] rounded bg-white p-3 space-y-2 font-mono text-[11px]">
        <span className="font-sans font-bold text-[#0F172A] text-[12px] block pb-1 border-b border-[#E2E8F0]">
          Waypoint Trajectory Spline
        </span>
        <div className="divide-y divide-[#E2E8F0]">
          <div className="py-1.5 flex justify-between">
            <span>WP-1: Inundation Tail</span>
            <span className="text-[#64748B]">Elev 2,340m • Solved</span>
          </div>
          <div className="py-1.5 flex justify-between">
            <span>WP-2: Raini Tributary Junction</span>
            <span className="text-[#64748B]">Elev 2,210m • Solved</span>
          </div>
          <div className="py-1.5 flex justify-between">
            <span className="text-[#DC2626] font-bold">WP-3: Breach Chokepoint #PT-4091</span>
            <span className="text-[#DC2626] font-bold">Elev 2,145m • ACTIVE</span>
          </div>
          <div className="py-1.5 flex justify-between">
            <span>WP-4: Debris Toe Front</span>
            <span className="text-[#64748B]">Elev 1,890m • Pending</span>
          </div>
        </div>
      </div>

      {/* Full screen viewer navigation option */}
      {onNavigate && (
        <div className="border-t border-[#E2E8F0] pt-2">
          <button
            onClick={() => {
              onClose();
              onNavigate('flythrough');
            }}
            className="w-full py-2 px-3 rounded bg-white border border-[#CBD5E1] text-[#0F172A] text-[12px] font-semibold flex items-center justify-center gap-1.5 hover:bg-[#F8FAFC] transition-colors cursor-pointer"
          >
            <span>Open Dedicated Cinematic Flight View</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#475569]" />
          </button>
        </div>
      )}
    </div>
  );
};
