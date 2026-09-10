import React, { useState, useEffect } from 'react';
import { Radio, Activity, Cpu, ShieldCheck, AlertTriangle, RefreshCw } from 'lucide-react';
import { NavModule } from '../../types';

interface LiveAnalysisScreenProps {
  onNavigate: (module: NavModule) => void;
  onOpenSlideDetails: (sourceKey?: string) => void;
}

export const LiveAnalysisScreen: React.FC<LiveAnalysisScreenProps> = ({
  onNavigate,
  onOpenSlideDetails,
}) => {
  const [ticks, setTicks] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTicks((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div id="live-analysis-screen" className="flex-1 flex flex-col overflow-y-auto bg-[#F5F7FA]">
      <div className="bg-white border-b border-[#CBD5E1] p-4 shrink-0 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[20px] font-bold text-[#0F172A] tracking-tight">
              Live Sensor Ingestion & Stream Processing
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#DCFCE7] text-[#15803D] font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse"></span>
              STREAM ACTIVE (12.4 Gbps)
            </span>
          </div>
          <p className="text-[13px] text-[#475569] mt-0.5">
            Real-time Cartosat-3 and RISAT-1A orbital downlinks fused with ground hydrological telemetry.
          </p>
        </div>

        <button
          onClick={() => onOpenSlideDetails('TRIGGER_LIVE_SYNC')}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[12px] font-medium bg-[#1E40AF] text-white rounded hover:bg-[#1D4ED8] cursor-pointer shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          <span>Synchronize Node Ephemeris</span>
        </button>
      </div>

      <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1">
        {/* Real-time Feeds Card */}
        <div className="bg-white rounded border border-[#CBD5E1] p-4 shadow-2xs font-mono text-[11px] space-y-3">
          <div className="font-bold text-[13px] text-[#0F172A] flex items-center gap-2 font-sans">
            <Radio className="w-4 h-4 text-[#1E40AF]" />
            <span>Active Orbital Pass Telemetry</span>
          </div>

          <div className="p-3 bg-[#F8FAFC] rounded border border-[#E2E8F0] space-y-2">
            <div className="flex justify-between">
              <span className="text-[#64748B]">Satellite:</span>
              <strong className="text-[#0F172A]">ISRO Cartosat-3 (Flight #C47)</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Sub-satellite Nadir:</span>
              <strong className="text-[#0F172A]">30°29'N / 79°41'E</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Optical Sensor Mode:</span>
              <strong className="text-[#15803D]">VNIR High-Res (0.50m GSD)</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Solar Elevation Angle:</span>
              <strong className="text-[#0F172A]">42.6° True</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Downlink Signal SNR:</span>
              <strong className="text-[#15803D]">38.4 dB (High Quality)</strong>
            </div>
          </div>
        </div>

        {/* Neural Engine Acceleration Card */}
        <div className="bg-white rounded border border-[#CBD5E1] p-4 shadow-2xs font-mono text-[11px] space-y-3">
          <div className="font-bold text-[13px] text-[#0F172A] flex items-center gap-2 font-sans">
            <Cpu className="w-4 h-4 text-[#0D9488]" />
            <span>AI Neural Inference Engine (A100)</span>
          </div>

          <div className="p-3 bg-[#F8FAFC] rounded border border-[#E2E8F0] space-y-2">
            <div className="flex justify-between">
              <span className="text-[#64748B]">Inference Pipeline:</span>
              <strong className="text-[#0F172A]">ISRO-DepthTransformer-v2</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Batch Latency:</span>
              <strong className="text-[#15803D]">4.82s per 16.7MP tile</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">GPU Utilization:</span>
              <strong className="text-[#1E40AF]">94% (CUDA 12.4)</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">VRAM Memory Footprint:</span>
              <strong className="text-[#0F172A]">14.2 / 80 GB</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Validation GCP RMSE:</span>
              <strong className="text-[#15803D]">0.42m (Calibrated)</strong>
            </div>
          </div>
        </div>

        {/* Real-time Alerts */}
        <div className="bg-white rounded border border-[#CBD5E1] p-4 shadow-2xs font-mono text-[11px] space-y-3">
          <div className="font-bold text-[13px] text-[#0F172A] flex items-center gap-2 font-sans">
            <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
            <span>Disaster Alert Subscriptions</span>
          </div>

          <div className="space-y-2">
            <div
              onClick={() => onOpenSlideDetails('ALERT_CHAMOLI')}
              className="p-2.5 rounded bg-[#FEF2F2] border border-[#FECACA] cursor-pointer hover:bg-[#FEE2E2]"
            >
              <div className="flex justify-between text-[#B91C1C] font-bold">
                <span>CHAMOLI GLOF INCIDENT</span>
                <span>CRITICAL</span>
              </div>
              <p className="text-[11px] text-[#7F1D1D] mt-1 font-sans">
                Debris accumulation 1.42M m³ impounding Rishiganga river head.
              </p>
            </div>

            <div
              onClick={() => onOpenSlideDetails('ALERT_TEHRI')}
              className="p-2.5 rounded bg-[#EFF6FF] border border-[#BFDBFE] cursor-pointer hover:bg-[#DBEAFE]"
            >
              <div className="flex justify-between text-[#1E40AF] font-bold">
                <span>TEHRI RESERVOIR INFLOW</span>
                <span>MONITORING</span>
              </div>
              <p className="text-[11px] text-[#1E3A8A] mt-1 font-sans">
                Upstream rainfall runoff nominal. Water table 814.2m MSL.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
