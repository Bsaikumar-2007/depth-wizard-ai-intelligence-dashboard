import React, { useState } from 'react';
import {
  Map as MapIcon,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Compass,
  AlertTriangle,
  Download,
  Share2,
  Filter,
} from 'lucide-react';
import { NavModule } from '../../types';

interface TerrainMapScreenProps {
  onNavigate: (module: NavModule) => void;
  onOpenSlideDetails: (sourceKey?: string) => void;
}

export const TerrainMapScreen: React.FC<TerrainMapScreenProps> = ({
  onNavigate,
  onOpenSlideDetails,
}) => {
  const [inundationSim, setInundationSim] = useState<number>(45);
  const [selectedBasin, setSelectedBasin] = useState<string>('chamoli');

  return (
    <div id="terrain-map-screen" className="flex-1 flex flex-col overflow-y-auto bg-[#F5F7FA]">
      {/* Top Banner */}
      <div className="bg-white border-b border-[#CBD5E1] p-4 shrink-0 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[20px] font-bold text-[#0F172A] tracking-tight">
              ISRO Regional Terrain & Hydrological Basins
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#DCFCE7] text-[#15803D] font-bold">
              BHUVAN 2D/3D WMS SYNC
            </span>
          </div>
          <p className="text-[13px] text-[#475569] mt-0.5">
            Macro-scale terrain contours, drainage networks, and dynamic flood inundation modeling.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenSlideDetails('FILTER_BASINS')}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-[12px] font-medium bg-white text-[#0F172A] border border-[#CBD5E1] rounded hover:bg-[#F8FAFC] cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5 text-[#475569]" />
            <span>Filter Basins (28 Active)</span>
          </button>
          <button
            onClick={() => onNavigate('explore-3d')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[12px] font-medium bg-[#1E40AF] text-white rounded hover:bg-[#1D4ED8] cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Switch to 3D Mesh</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="p-4 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Large GIS Map Canvas Viewport (8 cols) */}
        <div className="lg:col-span-8 bg-[#1E293B] rounded border border-[#CBD5E1] overflow-hidden flex flex-col relative min-h-[460px]">
          {/* Map Surface SVG Vector Drawing */}
          <div
            onClick={() => onOpenSlideDetails('REGIONAL_MAP_CLICK')}
            className="flex-1 w-full h-full relative cursor-crosshair"
          >
            <svg viewBox="0 0 800 500" className="w-full h-full object-cover">
              {/* Hypsometric background gradient */}
              <defs>
                <linearGradient id="mapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1E293B" />
                  <stop offset="50%" stopColor="#334155" />
                  <stop offset="100%" stopColor="#475569" />
                </linearGradient>
              </defs>
              <rect width="800" height="500" fill="url(#mapGrad)" />

              {/* Topographic Contour Isobars */}
              <g stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none">
                <path d="M 50 80 Q 200 120 400 90 T 750 140" />
                <path d="M 40 140 Q 240 190 420 160 T 760 220" />
                <path d="M 30 210 Q 220 280 430 230 T 770 300" />
                <path d="M 20 290 Q 250 340 450 310 T 780 390" />
                <path d="M 10 380 Q 230 430 460 400 T 790 470" />
              </g>

              {/* River network in turquoise */}
              <path
                d="M 120 40 Q 280 180 380 260 T 580 380 T 740 490"
                stroke="#06B6D4"
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 380 260 Q 420 140 520 80"
                stroke="#06B6D4"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
              />

              {/* Inundation Water Pool Simulation Overlay */}
              <circle
                cx="380"
                cy="260"
                r={inundationSim * 1.2}
                fill="rgba(239, 68, 68, 0.35)"
                stroke="#EF4444"
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* Hotspot Markers */}
              <g transform="translate(380, 260)">
                <circle r="6" fill="#DC2626" />
                <circle r="14" fill="none" stroke="#DC2626" strokeWidth="2" />
                <text x="18" y="4" fill="#FFFFFF" fontSize="12" fontFamily="JetBrains Mono" fontWeight="bold">
                  Chamoli Breach Zone (GLOF-4091)
                </text>
              </g>

              <g transform="translate(520, 80)">
                <circle r="4" fill="#38BDF8" />
                <text x="10" y="4" fill="#94A3B8" fontSize="10" fontFamily="JetBrains Mono">
                  Nanda Devi Glacier Outflow
                </text>
              </g>

              <g transform="translate(210, 110)">
                <circle r="4" fill="#10B981" />
                <text x="10" y="4" fill="#94A3B8" fontSize="10" fontFamily="JetBrains Mono">
                  Tapovan Hydropower Barrage
                </text>
              </g>
            </svg>

            {/* Floating Navigation Controls */}
            <div className="absolute top-3 right-3 flex flex-col gap-1.5 bg-white/90 p-1 rounded border border-[#CBD5E1] shadow-xs">
              <button className="p-1.5 rounded hover:bg-[#F1F5F9] text-[#0F172A] cursor-pointer">
                <ZoomIn className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded hover:bg-[#F1F5F9] text-[#0F172A] cursor-pointer">
                <ZoomOut className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded hover:bg-[#F1F5F9] text-[#0F172A] cursor-pointer">
                <Compass className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded hover:bg-[#F1F5F9] text-[#0F172A] cursor-pointer">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="h-9 bg-white border-t border-[#CBD5E1] px-3 flex items-center justify-between font-mono text-[11px] text-[#475569]">
            <span>UTM ZONE 44N | WGS84 EGM2008</span>
            <span className="text-[#1E40AF] font-semibold">
              Rishiganga & Dhauliganga Confluence Basins
            </span>
          </div>
        </div>

        {/* Right Simulation & Inundation Controls (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Dynamic Flood Inundation Simulator */}
          <div className="bg-white rounded border border-[#CBD5E1] p-4 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0] mb-3">
              <div className="font-bold text-[13px] text-[#0F172A] flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
                <span>Dam Breach Flood Simulation</span>
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#FEE2E2] text-[#B91C1C] font-bold">
                HIGH RISK
              </span>
            </div>

            <div className="space-y-3 font-mono text-[11px]">
              <div>
                <div className="flex justify-between text-[#475569] mb-1">
                  <span>INUNDATION LEVEL ESTIMATE:</span>
                  <strong className="text-[#B91C1C]">{inundationSim} meters</strong>
                </div>
                <input
                  type="range"
                  min="10"
                  max="90"
                  value={inundationSim}
                  onChange={(e) => setInundationSim(Number(e.target.value))}
                  className="w-full cursor-pointer accent-[#1E40AF]"
                />
              </div>

              <div className="p-2.5 rounded bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Predicted Peak Influx:</span>
                  <strong className="text-[#0F172A]">{inundationSim * 72} m³/s</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Downstream Warning Time:</span>
                  <strong className="text-[#15803D]">38 Minutes</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">At-Risk Settlements:</span>
                  <strong className="text-[#DC2626]">Raini & Tapovan (2,400 cap)</strong>
                </div>
              </div>

              <button
                onClick={() => onOpenSlideDetails('RUN_HYDROLOGICAL_SIM')}
                className="w-full py-2 px-3 rounded bg-[#1E40AF] text-white hover:bg-[#1D4ED8] transition-colors font-medium text-[12px] font-sans shadow-xs cursor-pointer"
              >
                Broadcast Inundation Alert to SDMA
              </button>
            </div>
          </div>

          {/* Regional Station Health */}
          <div className="bg-white rounded border border-[#CBD5E1] p-3 shadow-2xs font-mono text-[11px]">
            <div className="font-bold text-[12px] text-[#0F172A] mb-2 font-sans">
              Ground Stations & Sensor Telemetry
            </div>
            <div className="space-y-2">
              <div className="flex justify-between p-2 rounded bg-[#F8FAFC] border border-[#E2E8F0]">
                <span>NRSC Bikaner Node #04</span>
                <span className="text-[#15803D] font-bold">100% ONLINE</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-[#F8FAFC] border border-[#E2E8F0]">
                <span>Dehradun Radar Doppler</span>
                <span className="text-[#15803D] font-bold">ACTIVE</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-[#F8FAFC] border border-[#E2E8F0]">
                <span>Joshimath Seismograph</span>
                <span className="text-[#0284C7] font-bold">0.82 Hz NOMINAL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
