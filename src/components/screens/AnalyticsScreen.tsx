import React from 'react';
import { LineChart, BarChart2, ShieldCheck, Activity, Download } from 'lucide-react';
import { NavModule } from '../../types';

interface AnalyticsScreenProps {
  onNavigate: (module: NavModule) => void;
  onOpenSlideDetails: (sourceKey?: string) => void;
}

export const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({
  onNavigate,
  onOpenSlideDetails,
}) => {
  return (
    <div id="analytics-screen" className="flex-1 flex flex-col overflow-y-auto bg-[#F5F7FA]">
      <div className="bg-white border-b border-[#CBD5E1] p-4 shrink-0 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[20px] font-bold text-[#0F172A] tracking-tight">
              ISRO Disaster Operational Analytics & Accuracy Verification
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EFF6FF] text-[#1E40AF] font-bold">
              CARTOSAT-3 BENCHMARK
            </span>
          </div>
          <p className="text-[13px] text-[#475569] mt-0.5">
            Statistical elevation errors, neural depth confidence distributions, and regional hazard trends.
          </p>
        </div>

        <button
          onClick={() => onOpenSlideDetails('EXPORT_ANALYTICS_CSV')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium bg-white text-[#0F172A] border border-[#CBD5E1] rounded hover:bg-[#F8FAFC] cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-[#475569]" />
          <span>Export Analytics Matrix (.CSV)</span>
        </button>
      </div>

      <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
        {/* Elevation Accuracy vs Ground Survey GCPs */}
        <div
          onClick={() => onOpenSlideDetails('ELEVATION_ACCURACY_CHART')}
          className="bg-white rounded border border-[#CBD5E1] p-4 shadow-2xs cursor-pointer hover:border-[#1E40AF] transition-colors"
        >
          <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0] mb-3">
            <div className="font-bold text-[13px] text-[#0F172A]">
              Elevation Accuracy vs. Ground Control Points (GCP)
            </div>
            <span className="text-[10px] font-mono text-[#15803D] font-bold">
              RMSE: 0.42m
            </span>
          </div>

          {/* SVG Accuracy Curve */}
          <div className="h-44 w-full bg-[#FAFBFD] rounded border border-[#E2E8F0] p-2 flex items-center justify-center">
            <svg viewBox="0 0 400 120" className="w-full h-full overflow-visible">
              <line x1="20" y1="10" x2="20" y2="100" stroke="#CBD5E1" strokeWidth="1" />
              <line x1="20" y1="100" x2="380" y2="100" stroke="#CBD5E1" strokeWidth="1" />

              {/* Benchmark Reference Line (y=x) */}
              <line x1="20" y1="100" x2="380" y2="20" stroke="#94A3B8" strokeWidth="1" strokeDasharray="4 4" />

              {/* Sample points tightly clustered around reference line */}
              {[
                { x: 50, y: 92 },
                { x: 90, y: 81 },
                { x: 140, y: 73 },
                { x: 190, y: 60 },
                { x: 230, y: 52 },
                { x: 280, y: 41 },
                { x: 330, y: 31 },
                { x: 360, y: 24 },
              ].map((pt, i) => (
                <circle key={i} cx={pt.x} cy={pt.y} r="4" fill="#1E40AF" />
              ))}

              <text x="30" y="30" fill="#1E40AF" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">
                R² = 0.984 (CartoDEM v3 Calibration)
              </text>
            </svg>
          </div>
          <div className="flex justify-between font-mono text-[10px] text-[#64748B] mt-2">
            <span>Surveyed Theodolite Z (m)</span>
            <span>Reconstructed Z (m)</span>
          </div>
        </div>

        {/* Hazard Volume Assessment Distribution */}
        <div
          onClick={() => onOpenSlideDetails('HAZARD_VOLUME_CHART')}
          className="bg-white rounded border border-[#CBD5E1] p-4 shadow-2xs cursor-pointer hover:border-[#1E40AF] transition-colors"
        >
          <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0] mb-3">
            <div className="font-bold text-[13px] text-[#0F172A]">
              Historical Himalayan Gorge Breach Volume Trends
            </div>
            <span className="text-[10px] font-mono text-[#1E40AF] font-bold">
              2018 - 2024
            </span>
          </div>

          {/* SVG Bar Chart */}
          <div className="h-44 w-full bg-[#FAFBFD] rounded border border-[#E2E8F0] p-2 flex items-center justify-center">
            <svg viewBox="0 0 400 120" className="w-full h-full overflow-visible">
              <line x1="20" y1="100" x2="380" y2="100" stroke="#CBD5E1" strokeWidth="1" />

              {/* Bars for years */}
              {[
                { year: '2019', val: 35, color: '#38BDF8' },
                { year: '2020', val: 45, color: '#38BDF8' },
                { year: '2021', val: 95, color: '#DC2626' }, // Chamoli disaster peak
                { year: '2022', val: 50, color: '#38BDF8' },
                { year: '2023', val: 65, color: '#F59E0B' },
                { year: '2024', val: 82, color: '#DC2626' },
              ].map((item, idx) => {
                const x = 50 + idx * 55;
                const h = item.val;
                const y = 100 - h;
                return (
                  <g key={idx}>
                    <rect x={x} y={y} width="30" height={h} fill={item.color} rx="2" />
                    <text x={x + 3} y="115" fill="#64748B" fontSize="10" fontFamily="JetBrains Mono">
                      {item.year}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="flex justify-between font-mono text-[10px] text-[#64748B] mt-2">
            <span>Peak Breach Volume (10⁵ m³)</span>
            <span className="text-[#DC2626] font-bold">• 2021 & 2024 GLOF Events Highlighted</span>
          </div>
        </div>
      </div>
    </div>
  );
};
