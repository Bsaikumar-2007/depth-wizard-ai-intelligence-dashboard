import React from 'react';
import {
  TrendingUp,
  Activity,
  Layers,
  ShieldCheck,
  BarChart2,
  Compass,
  CheckCircle2,
  Info,
} from 'lucide-react';

export type AnalyticsSectionType =
  | 'ELEVATION_DISTRIBUTION'
  | 'SLOPE_DISTRIBUTION'
  | 'DEPTH_DISTRIBUTION'
  | 'CONFIDENCE_DETAILS'
  | 'RECONSTRUCTION_QUALITY';

interface AnalyticsDetailsProps {
  sectionType: AnalyticsSectionType;
  onClose: () => void;
}

export const AnalyticsDetails: React.FC<AnalyticsDetailsProps> = ({ sectionType }) => {
  switch (sectionType) {
    case 'ELEVATION_DISTRIBUTION':
      return (
        <div className="space-y-4 text-[13px]">
          <div className="p-3.5 rounded bg-[#EFF6FF] border border-[#BFDBFE]">
            <div className="flex items-center justify-between text-[#1E40AF] font-bold mb-1">
              <span>HYPSOMETRIC ELEVATION CURVE</span>
              <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-[#BFDBFE]">
                1,420m – 3,890m MSL
              </span>
            </div>
            <p className="text-[12px] text-[#1E3A8A]">
              Statistical elevation analysis across the 14.2 km² Chamoli basin derived from Cartosat-3 single-view neural photogrammetry calibrated to EGM2008 geoid.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-[11px] font-mono uppercase text-[#64748B] font-semibold tracking-wider">
              Statistical Hypsometry
            </h4>
            <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
              <div className="p-2.5 rounded bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[#64748B] block text-[10px]">MINIMUM ELEVATION</span>
                <strong className="text-[15px] text-[#0F172A]">1,420.4 m</strong>
                <span className="text-[10px] text-[#64748B] block">Tapovan Barrage Site</span>
              </div>
              <div className="p-2.5 rounded bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[#64748B] block text-[10px]">MAXIMUM ELEVATION</span>
                <strong className="text-[15px] text-[#0F172A]">3,892.1 m</strong>
                <span className="text-[10px] text-[#64748B] block">Ronti Peak Ridge Crest</span>
              </div>
              <div className="p-2.5 rounded bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[#64748B] block text-[10px]">MEAN BASIN ELEVATION</span>
                <strong className="text-[15px] text-[#1E40AF]">2,476.8 m</strong>
                <span className="text-[10px] text-[#64748B] block">Standard Dev: ±412m</span>
              </div>
              <div className="p-2.5 rounded bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[#64748B] block text-[10px]">TOTAL RELIEF DIFFERENCE</span>
                <strong className="text-[15px] text-[#15803D]">2,471.7 m</strong>
                <span className="text-[10px] text-[#64748B] block">Steep Himalayan Gorge</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#FAFBFD] rounded border border-[#CBD5E1] space-y-1 text-[12px]">
            <span className="font-bold text-[#0F172A] block flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#1E40AF]" />
              Terrain Interpretation
            </span>
            <p className="text-[#475569] text-[11px] leading-relaxed">
              The steep V-notch gorge profile channels high-velocity debris flows with severe kinetic energy. The sudden transition from 3,800m glacier cirque to 2,100m riverbed within a 4km horizontal span indicates extreme gravitational landslide susceptibility.
            </p>
          </div>
        </div>
      );

    case 'SLOPE_DISTRIBUTION':
      return (
        <div className="space-y-4 text-[13px]">
          <div className="p-3.5 rounded bg-[#FEF3C7] border border-[#FDE68A]">
            <div className="flex items-center justify-between text-[#B45309] font-bold mb-1">
              <span>SLOPE GRADIENT & ASPECT ANALYSIS</span>
              <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-[#FDE68A]">
                Mean Slope: 38.4°
              </span>
            </div>
            <p className="text-[12px] text-[#92400E]">
              Slope angle classification across the gorge walls. Slopes exceeding 35° are classified as high risk for secondary debris failures and avalanches.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-[11px] font-mono uppercase text-[#64748B] font-semibold tracking-wider">
              Slope Categorization Breakdown
            </h4>
            <div className="divide-y divide-[#E2E8F0] border border-[#E2E8F0] rounded bg-white font-mono text-[11px]">
              <div className="p-2.5 flex items-center justify-between">
                <span className="text-[#64748B]">Gentle / Valley Floor (0° - 15°):</span>
                <span className="font-bold text-[#15803D]">12.4% (1.76 km²)</span>
              </div>
              <div className="p-2.5 flex items-center justify-between">
                <span className="text-[#64748B]">Moderate Slopes (15° - 30°):</span>
                <span className="font-bold text-[#1E40AF]">28.6% (4.06 km²)</span>
              </div>
              <div className="p-2.5 flex items-center justify-between">
                <span className="text-[#64748B]">Steep Gorge Flanks (30° - 45°):</span>
                <span className="font-bold text-[#B45309]">44.8% (6.36 km²)</span>
              </div>
              <div className="p-2.5 flex items-center justify-between">
                <span className="text-[#64748B]">Precipitous Escarpments (&gt; 45°):</span>
                <span className="font-bold text-[#DC2626]">14.2% (2.02 km²)</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#FAFBFD] rounded border border-[#CBD5E1] space-y-1 text-[12px]">
            <span className="font-bold text-[#0F172A] block flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#B45309]" />
              Dominant Aspect Orientation
            </span>
            <p className="text-[#475569] text-[11px] leading-relaxed">
              Predominant slope aspect is 142° South-Southeast with an average 22° dip angle. South-facing slopes experience prolonged solar insolation and diurnal freeze-thaw cycles, weakening the underlying biotite gneiss bedrock.
            </p>
          </div>
        </div>
      );

    case 'DEPTH_DISTRIBUTION':
      return (
        <div className="space-y-4 text-[13px]">
          <div className="p-3.5 rounded bg-[#F0FDFA] border border-[#99F6E4]">
            <div className="flex items-center justify-between text-[#0F766E] font-bold mb-1">
              <span>NEURAL DISPARITY & RELATIVE DEPTH</span>
              <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-[#99F6E4]">
                Normalized [0.00 – 1.00]
              </span>
            </div>
            <p className="text-[12px] text-[#115E59]">
              Pixel-level depth maps generated by the transformer backbone before conversion to metric elevation via rational polynomial coefficients (RPC).
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-[11px] font-mono uppercase text-[#64748B] font-semibold tracking-wider">
              Disparity & Depth Metrics
            </h4>
            <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
              <div className="p-2.5 rounded bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[#64748B] block text-[10px]">MIN DISPARITY (FAR)</span>
                <strong className="text-[15px] text-[#0F172A]">0.082</strong>
                <span className="text-[10px] text-[#64748B] block">Glacier headwall</span>
              </div>
              <div className="p-2.5 rounded bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[#64748B] block text-[10px]">MAX DISPARITY (NEAR)</span>
                <strong className="text-[15px] text-[#0F172A]">0.964</strong>
                <span className="text-[10px] text-[#64748B] block">Downstream canyon toe</span>
              </div>
              <div className="p-2.5 rounded bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[#64748B] block text-[10px]">SENSOR DISPARITY RESIDUAL</span>
                <strong className="text-[15px] text-[#15803D]">0.18 px RMSE</strong>
                <span className="text-[10px] text-[#64748B] block">Sub-pixel precision</span>
              </div>
              <div className="p-2.5 rounded bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[#64748B] block text-[10px]">SCALE FACTOR (Z/D)</span>
                <strong className="text-[15px] text-[#1E40AF]">2,470 m/unit</strong>
                <span className="text-[10px] text-[#64748B] block">Metric mapping affine</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#FAFBFD] rounded border border-[#CBD5E1] space-y-1 text-[12px]">
            <span className="font-bold text-[#0F172A] block flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#0F766E]" />
              Relative vs Metric Conversion
            </span>
            <p className="text-[#475569] text-[11px] leading-relaxed">
              Relative depth captures fine structural contours and micro-gorge channels without requiring prior multi-temporal baselines. Ephemeris alignment links the relative depth field to true ellipsoidal heights.
            </p>
          </div>
        </div>
      );

    case 'CONFIDENCE_DETAILS':
      return (
        <div className="space-y-4 text-[13px]">
          <div className="p-3.5 rounded bg-[#F0FDF4] border border-[#BBF7D0]">
            <div className="flex items-center justify-between text-[#15803D] font-bold mb-1">
              <span>STATISTICAL CONFIDENCE & BENCHMARKING</span>
              <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-[#BBF7D0]">
                Overall Confidence: 96.4%
              </span>
            </div>
            <p className="text-[12px] text-[#166534]">
              Confidence metrics are calculated by matching neural surfaces against 18 surveyed permanent ground control benchmarks along the Alaknanda and Rishiganga valleys.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-[11px] font-mono uppercase text-[#64748B] font-semibold tracking-wider">
              Ground Validation Benchmarks
            </h4>
            <div className="divide-y divide-[#E2E8F0] border border-[#E2E8F0] rounded bg-white font-mono text-[11px]">
              <div className="p-2 flex justify-between">
                <span className="text-[#64748B]">Pillar SoI-CHM-01 (Tapovan):</span>
                <span className="text-[#15803D] font-bold">Δz = +0.28m (98.2% conf)</span>
              </div>
              <div className="p-2 flex justify-between">
                <span className="text-[#64748B]">Pillar SoI-CHM-04 (Raini Bridge):</span>
                <span className="text-[#15803D] font-bold">Δz = -0.34m (97.6% conf)</span>
              </div>
              <div className="p-2 flex justify-between">
                <span className="text-[#64748B]">Pillar SoI-CHM-09 (Debris Toe):</span>
                <span className="text-[#B45309] font-bold">Δz = +0.52m (94.8% conf)</span>
              </div>
              <div className="p-2 flex justify-between">
                <span className="text-[#64748B]">Pillar SoI-CHM-14 (Glacier Snout):</span>
                <span className="text-[#15803D] font-bold">Δz = -0.41m (95.1% conf)</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#FAFBFD] rounded border border-[#CBD5E1] space-y-1 text-[12px]">
            <span className="font-bold text-[#0F172A] block flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#15803D]" />
              Quality Assurance Compliance
            </span>
            <p className="text-[#475569] text-[11px] leading-relaxed">
              The RMSE of 0.42m satisfies ISRO Disaster Management Support Level-1 photogrammetry criteria for hydrological flood routing and emergency evacuation planning.
            </p>
          </div>
        </div>
      );

    case 'RECONSTRUCTION_QUALITY':
      return (
        <div className="space-y-4 text-[13px]">
          <div className="p-3.5 rounded bg-[#FAF5FF] border border-[#E9D5FF]">
            <div className="flex items-center justify-between text-[#7E22CE] font-bold mb-1">
              <span>RECONSTRUCTION QUALITY & MESH TOPOLOGY</span>
              <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-[#E9D5FF]">
                142,850 TIN Facets
              </span>
            </div>
            <p className="text-[12px] text-[#6B21A8]">
              Triangulated Irregular Network (TIN) surface topology analysis examining vertex density, triangle aspect ratios, and void-free continuous terrain bounds.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-[11px] font-mono uppercase text-[#64748B] font-semibold tracking-wider">
              TIN Mesh Characteristics
            </h4>
            <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
              <div className="p-2.5 rounded bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[#64748B] block text-[10px]">TOTAL 3D VERTICES</span>
                <strong className="text-[15px] text-[#0F172A]">72,140 Pts</strong>
                <span className="text-[10px] text-[#64748B] block">Non-degenerate</span>
              </div>
              <div className="p-2.5 rounded bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[#64748B] block text-[10px]">SURFACE AREA</span>
                <strong className="text-[15px] text-[#0F172A]">18.42 km²</strong>
                <span className="text-[10px] text-[#64748B] block">3D True Surface</span>
              </div>
              <div className="p-2.5 rounded bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[#64748B] block text-[10px]">MIN FACET ANGLE</span>
                <strong className="text-[15px] text-[#15803D]">24.8° (Delaunay)</strong>
                <span className="text-[10px] text-[#64748B] block">Well conditioned</span>
              </div>
              <div className="p-2.5 rounded bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[#64748B] block text-[10px]">OCCLUSION HOLES</span>
                <strong className="text-[15px] text-[#15803D]">0 (Infilled)</strong>
                <span className="text-[10px] text-[#64748B] block">Bilateral smoothed</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#FAFBFD] rounded border border-[#CBD5E1] space-y-1 text-[12px]">
            <span className="font-bold text-[#0F172A] block flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#7E22CE]" />
              Delaunay Quality Verification
            </span>
            <p className="text-[#475569] text-[11px] leading-relaxed">
              No inverted normals or sliver triangles detected along the steep canyon cliffs. The TIN surface is ready for direct export to GIS hydrological solvers (HEC-RAS, TUFLOW) or 3D graphics game engines (GLTF/OBJ).
            </p>
          </div>
        </div>
      );

    default:
      return null;
  }
};
