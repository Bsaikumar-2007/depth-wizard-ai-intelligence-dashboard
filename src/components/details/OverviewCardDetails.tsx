import React from 'react';
import {
  FolderClosed,
  Layers,
  ShieldCheck,
  Radio,
  ExternalLink,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { NavModule } from '../../types';

export type OverviewCardType =
  | 'TOTAL_PROJECTS'
  | 'RECONSTRUCTIONS'
  | 'CONFIDENCE'
  | 'LATEST_SCENE'
  | 'HAZARD_ASSESSMENT';

interface OverviewCardDetailsProps {
  cardType: OverviewCardType;
  onNavigate: (module: NavModule) => void;
  onClose: () => void;
}

export const OverviewCardDetails: React.FC<OverviewCardDetailsProps> = ({
  cardType,
  onNavigate,
  onClose,
}) => {
  switch (cardType) {
    case 'TOTAL_PROJECTS':
      return (
        <div className="space-y-4 text-[13px]">
          <div className="p-3.5 rounded bg-[#EFF6FF] border border-[#BFDBFE]">
            <div className="flex items-center justify-between text-[#1E40AF] font-bold mb-1">
              <span>PROJECT INVENTORY SUMMARY</span>
              <span className="font-mono text-[11px] bg-white px-1.5 py-0.5 rounded border border-[#BFDBFE]">
                142 Active Basins
              </span>
            </div>
            <p className="text-[12px] text-[#1E3A8A]">
              ISRO Disaster Management Support program maintains calibrated digital elevation baselines across India's active landslide and glacial hazard belts.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-[11px] font-mono uppercase text-[#64748B] font-semibold tracking-wider">
              Priority Hazard Distribution
            </h4>
            <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
              <div className="p-2.5 rounded bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[#64748B] block text-[10px]">CRITICAL GLOF ZONES</span>
                <strong className="text-[15px] text-[#DC2626]">28 Basins</strong>
                <span className="text-[10px] text-[#94A3B8] block">Uttarakhand, Sikkim, HP</span>
              </div>
              <div className="p-2.5 rounded bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[#64748B] block text-[10px]">MONSOON LANDSLIDE</span>
                <strong className="text-[15px] text-[#B45309]">46 Basins</strong>
                <span className="text-[10px] text-[#94A3B8] block">Western Ghats, Kerala</span>
              </div>
              <div className="p-2.5 rounded bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[#64748B] block text-[10px]">RESERVOIR RIM RISK</span>
                <strong className="text-[15px] text-[#1E40AF]">38 Sites</strong>
                <span className="text-[10px] text-[#94A3B8] block">Tehri, Bhakra, Idukki</span>
              </div>
              <div className="p-2.5 rounded bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[#64748B] block text-[10px]">RIVER FLOODPLAINS</span>
                <strong className="text-[15px] text-[#15803D]">30 Basins</strong>
                <span className="text-[10px] text-[#94A3B8] block">Brahmaputra, Ganga</span>
              </div>
            </div>
          </div>

          <div className="border-t border-[#E2E8F0] pt-3">
            <button
              onClick={() => {
                onClose();
                onNavigate('projects');
              }}
              className="w-full py-2 px-3 rounded bg-[#1E40AF] text-white text-[12px] font-semibold flex items-center justify-center gap-1.5 hover:bg-[#1D4ED8] transition-colors cursor-pointer"
            >
              <span>View All 142 Projects in Registry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      );

    case 'RECONSTRUCTIONS':
      return (
        <div className="space-y-4 text-[13px]">
          <div className="p-3.5 rounded bg-[#F0FDF4] border border-[#BBF7D0]">
            <div className="flex items-center justify-between text-[#15803D] font-bold mb-1">
              <span>NEURAL PIPELINE THROUGHPUT</span>
              <span className="font-mono text-[11px] bg-white px-1.5 py-0.5 rounded border border-[#BBF7D0]">
                94.2% Success
              </span>
            </div>
            <p className="text-[12px] text-[#166534]">
              High-throughput single-image stereo depth reconstruction powered by ISRO-DepthNet running on NVIDIA A100 Tensor Core GPUs.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-[11px] font-mono uppercase text-[#64748B] font-semibold tracking-wider">
              Reconstruction Metrics
            </h4>
            <div className="divide-y divide-[#E2E8F0] border border-[#E2E8F0] rounded bg-white text-[12px]">
              <div className="p-2.5 flex justify-between">
                <span className="text-[#64748B]">Total Processed Scenes:</span>
                <strong className="font-mono text-[#0F172A]">1,894 Scenes</strong>
              </div>
              <div className="p-2.5 flex justify-between">
                <span className="text-[#64748B]">Mean Latency per 16MP Scene:</span>
                <strong className="font-mono text-[#15803D]">4.82 seconds</strong>
              </div>
              <div className="p-2.5 flex justify-between">
                <span className="text-[#64748B]">Mesh Density Average:</span>
                <strong className="font-mono text-[#0F172A]">142,850 TIN Facets</strong>
              </div>
              <div className="p-2.5 flex justify-between">
                <span className="text-[#64748B]">Failed / Occluded Scenes:</span>
                <strong className="font-mono text-[#64748B]">110 (Heavy Cloud Cover)</strong>
              </div>
            </div>
          </div>

          <div className="border-t border-[#E2E8F0] pt-3">
            <button
              onClick={() => {
                onClose();
                onNavigate('new-analysis');
              }}
              className="w-full py-2 px-3 rounded bg-[#1E40AF] text-white text-[12px] font-semibold flex items-center justify-center gap-1.5 hover:bg-[#1D4ED8] transition-colors cursor-pointer"
            >
              <span>Launch New Reconstruction Run</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      );

    case 'CONFIDENCE':
      return (
        <div className="space-y-4 text-[13px]">
          <div className="p-3.5 rounded bg-[#F8FAFC] border border-[#CBD5E1]">
            <div className="flex items-center justify-between text-[#0F172A] font-bold mb-1">
              <span>GEODETIC ELEVATION CONFIDENCE</span>
              <span className="font-mono text-[11px] bg-[#DCFCE7] text-[#15803D] px-1.5 py-0.5 rounded font-bold">
                96.4% Accuracy
              </span>
            </div>
            <p className="text-[12px] text-[#475569]">
              Reconstructed 3D surfaces are benchmarked directly against Survey of India trigonometric pillars and Cartosat-3 RPC ground control points.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-[11px] font-mono uppercase text-[#64748B] font-semibold tracking-wider">
              Statistical Error Tolerances
            </h4>
            <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
              <div className="p-2.5 rounded bg-[#FAFBFD] border border-[#E2E8F0]">
                <span className="text-[#64748B] block text-[10px]">VERTICAL RMSE</span>
                <strong className="text-[15px] text-[#15803D]">±0.42 meters</strong>
                <span className="text-[10px] text-[#64748B] block">CartoDEM v3 standard</span>
              </div>
              <div className="p-2.5 rounded bg-[#FAFBFD] border border-[#E2E8F0]">
                <span className="text-[#64748B] block text-[10px]">HORIZONTAL LE90</span>
                <strong className="text-[15px] text-[#1E40AF]">±0.85 meters</strong>
                <span className="text-[10px] text-[#64748B] block">Sub-pixel registration</span>
              </div>
              <div className="p-2.5 rounded bg-[#FAFBFD] border border-[#E2E8F0]">
                <span className="text-[#64748B] block text-[10px]">PEARSON CORRELATION R²</span>
                <strong className="text-[15px] text-[#0F172A]">0.984</strong>
                <span className="text-[10px] text-[#64748B] block">Validation GCP test</span>
              </div>
              <div className="p-2.5 rounded bg-[#FAFBFD] border border-[#E2E8F0]">
                <span className="text-[#64748B] block text-[10px]">VERTICAL DATUM</span>
                <strong className="text-[15px] text-[#0F172A]">EGM2008</strong>
                <span className="text-[10px] text-[#64748B] block">WGS-84 Ellipsoid</span>
              </div>
            </div>
          </div>

          <div className="border-t border-[#E2E8F0] pt-3">
            <button
              onClick={() => {
                onClose();
                onNavigate('analytics');
              }}
              className="w-full py-2 px-3 rounded bg-[#1E40AF] text-white text-[12px] font-semibold flex items-center justify-center gap-1.5 hover:bg-[#1D4ED8] transition-colors cursor-pointer"
            >
              <span>Explore Full Verification Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      );

    case 'LATEST_SCENE':
      return (
        <div className="space-y-4 text-[13px]">
          <div className="p-3.5 rounded bg-[#FEF2F2] border border-[#FECACA]">
            <div className="flex items-center justify-between text-[#B91C1C] font-bold mb-1">
              <span>ACTIVE SCENE: CHAMOLI GLOF INCIDENT</span>
              <span className="font-mono text-[10px] bg-[#DC2626] text-white px-1.5 py-0.5 rounded font-bold uppercase">
                Critical Priority
              </span>
            </div>
            <p className="text-[12px] text-[#7F1D1D]">
              A landslide dam breach on the Rishiganga river has created a critical debris choke point threatening downstream hydropower infrastructure.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-[11px] font-mono uppercase text-[#64748B] font-semibold tracking-wider">
              Telemetry Parameters
            </h4>
            <div className="divide-y divide-[#E2E8F0] border border-[#E2E8F0] rounded bg-white font-mono text-[11px]">
              <div className="p-2 flex justify-between">
                <span className="text-[#64748B]">Geographic Coordinates:</span>
                <span className="text-[#0F172A] font-bold">30°29'44"N 79°41'32"E</span>
              </div>
              <div className="p-2 flex justify-between">
                <span className="text-[#64748B]">Impounded Water Volume:</span>
                <span className="text-[#DC2626] font-bold">3.85M m³ (74% capacity)</span>
              </div>
              <div className="p-2 flex justify-between">
                <span className="text-[#64748B]">Debris Barrier Height:</span>
                <span className="text-[#DC2626] font-bold">24.6 meters</span>
              </div>
              <div className="p-2 flex justify-between">
                <span className="text-[#64748B]">Optical Sensor Pass:</span>
                <span className="text-[#1E40AF]">Cartosat-3 VNIR (0.50m GSD)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 border-t border-[#E2E8F0] pt-3">
            <button
              onClick={() => {
                onClose();
                onNavigate('explore-3d');
              }}
              className="py-2 px-3 rounded bg-[#1E40AF] text-white text-[12px] font-semibold flex items-center justify-center gap-1.5 hover:bg-[#1D4ED8] transition-colors cursor-pointer"
            >
              <span>Inspect 3D Mesh</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                onClose();
                onNavigate('flythrough');
              }}
              className="py-2 px-3 rounded border border-[#CBD5E1] text-[#0F172A] bg-white text-[12px] font-semibold flex items-center justify-center gap-1.5 hover:bg-[#F8FAFC] transition-colors cursor-pointer"
            >
              <span>UAV Flythrough</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      );

    default:
      return null;
  }
};
