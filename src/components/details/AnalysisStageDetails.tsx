import React from 'react';
import {
  FileImage,
  Layers,
  Compass,
  Rotate3d,
  CheckCircle2,
  Cpu,
  Clock,
  Activity,
} from 'lucide-react';

export type LiveAnalysisStageKey =
  | 'IMAGE_PREPROCESSING'
  | 'DEPTH_ESTIMATION'
  | 'GEOSPATIAL_CALIBRATION'
  | 'RECONSTRUCTION_3D'
  | 'SCENE_PREPARATION';

interface AnalysisStageDetailsProps {
  stageKey: LiveAnalysisStageKey;
  onClose: () => void;
}

interface StageInfo {
  name: string;
  code: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'STANDBY';
  progress: number;
  description: string;
  input: string;
  output: string;
  hardware: string;
  latency: string;
  specs: { label: string; value: string }[];
}

const STAGES_DATA: Record<LiveAnalysisStageKey, StageInfo> = {
  IMAGE_PREPROCESSING: {
    name: 'Image Preprocessing & Ortho-Radiometry',
    code: 'STAGE_01_PREPROC',
    status: 'COMPLETED',
    progress: 100,
    description:
      'Performs atmospheric radiometric calibration, bilateral haze removal, sensor noise reduction, and tile slicing across high-resolution satellite imagery.',
    input: 'Raw Cartosat-3 Level-1G GeoTIFF / NITF (16-bit VNIR)',
    output: 'Bilateral-filtered ortho-radiometric image pyramid (RGB + NIR bands)',
    hardware: 'CPU Multi-thread (AMD EPYC 7763) + SIMD AVX-512',
    latency: '0.84 seconds per 16.7MP tile',
    specs: [
      { label: 'Radiometric Calibration:', value: 'Top-of-Atmosphere (TOA) Reflectance' },
      { label: 'Noise Filtering:', value: 'Edge-preserving Bilateral Filter (σ=1.8)' },
      { label: 'Tiling Resolution:', value: '4096 × 4096 px tiles with 128 px overlap' },
      { label: 'Dynamic Range:', value: 'Histogram stretched to 8-bit sRGB' },
    ],
  },
  DEPTH_ESTIMATION: {
    name: 'Neural Monocular Depth Inference',
    code: 'STAGE_02_DEPTH',
    status: 'COMPLETED',
    progress: 100,
    description:
      'Feeds multi-scale optical features through the ISRO-DepthTransformer-v2 neural backbone to infer pixel-level dense continuous disparity and relative depth fields.',
    input: 'Filtered optical image tile (3 channels RGB, 0.50m GSD)',
    output: 'Normalized dense disparity map [0.00 – 1.00] (Float32)',
    hardware: 'NVIDIA A100-SXM4-80GB (TensorRT FP16)',
    latency: '2.14 seconds per tile',
    specs: [
      { label: 'Model Backbone:', value: 'Vision Transformer (ViT-Large / 24 layers)' },
      { label: 'Quantization:', value: 'Mixed Precision FP16 TensorRT' },
      { label: 'Disparity Error RMSE:', value: '0.18 pixels on synthetic validation' },
      { label: 'GPU Memory Allocated:', value: '14.2 GB VRAM' },
    ],
  },
  GEOSPATIAL_CALIBRATION: {
    name: 'Geospatial Calibration & Geodetic Alignment',
    code: 'STAGE_03_GEOCAL',
    status: 'COMPLETED',
    progress: 100,
    description:
      'Applies satellite ephemeris, attitude matrices, and Rational Polynomial Coefficients (RPC) to transform relative depth into true metric elevation relative to EGM2008 geoid.',
    input: 'Normalized disparity map + RPC satellite telemetry coefficients',
    output: 'Metric Digital Elevation Model (DEM) with georeferenced bounding box',
    hardware: 'CUDA Geodetic Solver Kernel',
    latency: '0.62 seconds',
    specs: [
      { label: 'Vertical Datum:', value: 'EGM2008 Geoid (WGS-84 Ellipsoid)' },
      { label: 'Coordinate System:', value: 'UTM Zone 44N (EPSG: 32644)' },
      { label: 'Vertical RMSE:', value: '±0.42m against Survey of India GCPs' },
      { label: 'Planar LE90:', value: '±0.85m horizontal accuracy' },
    ],
  },
  RECONSTRUCTION_3D: {
    name: '3D Mesh Surface Reconstruction & TIN Triangulation',
    code: 'STAGE_04_RECON',
    status: 'COMPLETED',
    progress: 100,
    description:
      'Constructs a high-fidelity Triangulated Irregular Network (TIN) surface topology from calibrated elevation points, infilling steep gorge occlusions with bilateral interpolation.',
    input: 'Calibrated metric DEM grid (1.0m grid interval)',
    output: 'TIN 3D Polygon Mesh (142,850 triangles, vertex normals, UV texture map)',
    hardware: 'Parallel Delaunay GPU Kernel',
    latency: '0.98 seconds',
    specs: [
      { label: 'Triangulation Algorithm:', value: 'Constrained 2.5D Delaunay with adaptive decimation' },
      { label: 'Vertex Count:', value: '72,140 vertices' },
      { label: 'Facet Count:', value: '142,850 triangles' },
      { label: 'Manifold Status:', value: 'Watertight, non-self-intersecting' },
    ],
  },
  SCENE_PREPARATION: {
    name: 'Scene Preparation & Interactive Packaging',
    code: 'STAGE_05_SCENE',
    status: 'COMPLETED',
    progress: 100,
    description:
      'Generates multi-resolution level-of-detail (LOD) hierarchies, renders hypsometric ramps, calculates slope-aspect overlays, and stages real-time 3D flight paths.',
    input: 'TIN mesh + satellite orthophoto texture + transect waypoints',
    output: 'Interactive WebGL / Canvas scene package ready for 60 FPS rendering',
    hardware: 'Client WebGL / WASM Shader Engine',
    latency: '0.36 seconds',
    specs: [
      { label: 'Texture Resolution:', value: '4096 × 4096 px mipmapped texture' },
      { label: 'LOD Hierarchy:', value: '3 continuous geometric levels (0.5m, 2m, 8m)' },
      { label: 'Shading Models:', value: 'Blinn-Phong + Dynamic Hypsometric Ramp' },
      { label: 'Interactive Framerate:', value: 'Target: 60 FPS stable' },
    ],
  },
};

export const AnalysisStageDetails: React.FC<AnalysisStageDetailsProps> = ({
  stageKey,
}) => {
  const stage = STAGES_DATA[stageKey];

  return (
    <div className="space-y-4 text-[13px]">
      {/* Top Status Header */}
      <div className="p-3.5 rounded bg-[#FAFBFD] border border-[#CBD5E1]">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-mono text-[11px] font-bold text-[#1E40AF]">
            {stage.code}
          </span>
          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0] font-bold uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            {stage.status} (100%)
          </span>
        </div>
        <h3 className="text-[15px] font-bold text-[#0F172A] leading-snug">
          {stage.name}
        </h3>
        <p className="text-[12px] text-[#475569] mt-1.5 leading-relaxed">
          {stage.description}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="p-3 bg-white rounded border border-[#CBD5E1] space-y-1.5 font-mono text-[11px]">
        <div className="flex justify-between text-[#0F172A] font-semibold">
          <span>PIPELINE EXECUTION PROGRESS</span>
          <span className="text-[#15803D] font-bold">{stage.progress}%</span>
        </div>
        <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#15803D] transition-all duration-300"
            style={{ width: `${stage.progress}%` }}
          ></div>
        </div>
      </div>

      {/* Input / Output Specs */}
      <div className="border border-[#CBD5E1] rounded bg-white p-3 space-y-2 font-mono text-[11px]">
        <span className="font-sans font-bold text-[#0F172A] text-[12px] block pb-1 border-b border-[#E2E8F0]">
          Data Ingestion & Artifacts
        </span>

        <div className="space-y-1.5">
          <div>
            <span className="text-[#64748B] block text-[10px]">INPUT:</span>
            <span className="text-[#0F172A] font-medium">{stage.input}</span>
          </div>
          <div>
            <span className="text-[#64748B] block text-[10px]">OUTPUT:</span>
            <span className="text-[#15803D] font-medium">{stage.output}</span>
          </div>
        </div>
      </div>

      {/* Hardware & Latency */}
      <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
        <div className="p-2.5 rounded bg-[#F8FAFC] border border-[#E2E8F0]">
          <span className="text-[#64748B] block text-[10px]">EXECUTION HARDWARE:</span>
          <strong className="text-[12px] text-[#0F172A] block mt-0.5">{stage.hardware}</strong>
        </div>
        <div className="p-2.5 rounded bg-[#F8FAFC] border border-[#E2E8F0]">
          <span className="text-[#64748B] block text-[10px]">BENCHMARK LATENCY:</span>
          <strong className="text-[12px] text-[#15803D] block mt-0.5">{stage.latency}</strong>
        </div>
      </div>

      {/* Specific Processing Parameters Table */}
      <div className="border border-[#CBD5E1] rounded bg-white p-3 space-y-1 font-mono text-[11px]">
        <span className="font-sans font-bold text-[#0F172A] text-[12px] block pb-1 border-b border-[#E2E8F0]">
          Technical Specifications
        </span>
        <div className="divide-y divide-[#E2E8F0]">
          {stage.specs.map((item, idx) => (
            <div key={idx} className="py-1.5 flex justify-between">
              <span className="text-[#64748B]">{item.label}</span>
              <strong className="text-[#0F172A]">{item.value}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
