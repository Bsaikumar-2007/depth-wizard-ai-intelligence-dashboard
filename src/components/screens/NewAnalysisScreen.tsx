import React, { useState } from 'react';
import {
  UploadCloud,
  FileImage,
  Layers,
  Settings2,
  Trash2,
  AlertCircle,
  Cpu,
  CheckCircle2,
  Play,
  Info,
  Loader2,
} from 'lucide-react';
import { NavModule } from '../../types';

interface NewAnalysisScreenProps {
  onNavigate: (module: NavModule) => void;
  onOpenSlideDetails: (sourceKey?: string) => void;
}

export const NewAnalysisScreen: React.FC<NewAnalysisScreenProps> = ({
  onNavigate,
  onOpenSlideDetails,
}) => {
  const [stage, setStage] = useState<number>(1);
  const [calibrationProtocol, setCalibrationProtocol] = useState<string>('reference_dem');
  const [modelArchitecture, setModelArchitecture] = useState<string>('depth_transformer_v2');
  const [quantization, setQuantization] = useState<string>('fp16');
  const [contourStep, setContourStep] = useState<number>(20);
  const [bilateralFilter, setBilateralFilter] = useState<boolean>(true);
  const [shadowOcclusion, setShadowOcclusion] = useState<boolean>(true);
  const [isRunningAnalysis, setIsRunningAnalysis] = useState<boolean>(false);
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);

  const handleRunAnalysis = () => {
    setIsRunningAnalysis(true);
    setAnalysisProgress(10);
    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsRunningAnalysis(false);
            onNavigate('explore-3d');
          }, 400);
          return 100;
        }
        return prev + 20;
      });
    }, 450);
  };

  return (
    <div id="new-analysis-screen" className="flex-1 flex flex-col overflow-y-auto bg-[#F5F7FA]">
      {/* Subheader Status Strip */}
      <div className="bg-[#FAFBFD] border-b border-[#CBD5E1] px-4 py-1.5 flex items-center justify-between text-[11px] font-mono shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-[#1E40AF] font-bold">MISSION OPS // DMS-2024-CHM</span>
          <span className="text-[#94A3B8]">|</span>
          <span className="text-[#475569]">NODE: SAC-NRSC/BKN-04</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[#15803D] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse"></span>
            PIPELINE READY
          </span>
          <span className="text-[#94A3B8]">|</span>
          <span className="text-[#64748B]">CUDA 12.4</span>
        </div>
      </div>

      {/* Main Page Title Header */}
      <div className="bg-white border-b border-[#CBD5E1] p-4 shrink-0">
        <h1 className="text-[20px] font-bold text-[#0F172A] tracking-tight">
          New Terrain Analysis
        </h1>
        <p className="text-[13px] text-[#475569] mt-0.5">
          Upload satellite or aerial optical imagery to reconstruct single-view 3D elevation and relative depth models.
        </p>

        {/* 4-Stage Workflow Stepper */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mt-4">
          {/* Stage 1: Active */}
          <div
            onClick={() => setStage(1)}
            className={`p-2.5 rounded border transition-colors cursor-pointer flex items-center gap-2.5 ${
              stage === 1
                ? 'border-[#1E40AF] bg-[#EFF6FF] text-[#1E40AF]'
                : 'border-[#CBD5E1] bg-white text-[#475569]'
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-[#1E40AF] text-white flex items-center justify-center font-mono text-[11px] font-bold">
              1
            </div>
            <div>
              <div className="text-[9px] font-mono uppercase tracking-wider font-semibold opacity-75">
                STAGE 01 // ACTIVE
              </div>
              <div className="text-[12px] font-bold text-[#0F172A]">Image Ingestion</div>
            </div>
          </div>

          {/* Stage 2: Configured */}
          <div
            onClick={() => setStage(2)}
            className={`p-2.5 rounded border transition-colors cursor-pointer flex items-center gap-2.5 ${
              stage === 2
                ? 'border-[#1E40AF] bg-[#EFF6FF] text-[#1E40AF]'
                : 'border-[#CBD5E1] bg-white text-[#475569]'
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-[#0D9488] text-white flex items-center justify-center font-mono text-[11px] font-bold">
              ✓
            </div>
            <div>
              <div className="text-[9px] font-mono uppercase tracking-wider font-semibold text-[#0D9488]">
                STAGE 02 // CONFIGURED
              </div>
              <div className="text-[12px] font-bold text-[#0F172A]">Elevation Calibration</div>
            </div>
          </div>

          {/* Stage 3: Standby */}
          <div
            onClick={() => setStage(3)}
            className={`p-2.5 rounded border transition-colors cursor-pointer flex items-center gap-2.5 ${
              stage === 3
                ? 'border-[#1E40AF] bg-[#EFF6FF] text-[#1E40AF]'
                : 'border-[#CBD5E1] bg-white text-[#94A3B8]'
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-[#E2E8F0] text-[#64748B] flex items-center justify-center font-mono text-[11px] font-bold">
              3
            </div>
            <div>
              <div className="text-[9px] font-mono uppercase tracking-wider font-semibold text-[#94A3B8]">
                STAGE 03 // STANDBY
              </div>
              <div className="text-[12px] font-semibold text-[#475569]">Neural Depth Inference</div>
            </div>
          </div>

          {/* Stage 4: Final */}
          <div
            onClick={() => setStage(4)}
            className={`p-2.5 rounded border transition-colors cursor-pointer flex items-center gap-2.5 ${
              stage === 4
                ? 'border-[#1E40AF] bg-[#EFF6FF] text-[#1E40AF]'
                : 'border-[#CBD5E1] bg-white text-[#94A3B8]'
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-[#E2E8F0] text-[#64748B] flex items-center justify-center font-mono text-[11px] font-bold">
              4
            </div>
            <div>
              <div className="text-[9px] font-mono uppercase tracking-wider font-semibold text-[#94A3B8]">
                STAGE 04 // FINAL
              </div>
              <div className="text-[12px] font-semibold text-[#475569]">Mesh & Flythrough Gen</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Setup Area */}
      <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
        {/* Left Column: Optical RGB Source Imagery */}
        <div className="bg-white rounded border border-[#CBD5E1] flex flex-col overflow-hidden shadow-2xs">
          <div className="p-3 border-b border-[#CBD5E1] bg-[#F8FAFC] flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-[13px] text-[#0F172A]">
              <FileImage className="w-4 h-4 text-[#1E40AF]" />
              <span>Optical RGB Source Imagery</span>
            </div>
            <span className="text-[10px] font-mono text-[#64748B]">
              PAYLOAD_SPEC: VNIR-RGB
            </span>
          </div>

          <div className="p-4 space-y-4 flex-1 overflow-y-auto text-[12px]">
            {/* Upload Drag & Drop Area */}
            <div
              onClick={() => onOpenSlideDetails('UPLOAD_DROPZONE')}
              className="border-2 border-dashed border-[#CBD5E1] hover:border-[#1E40AF] rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-[#FAFBFD] hover:bg-[#EFF6FF]/40"
            >
              <div className="w-12 h-12 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#1E40AF] mb-2">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div className="font-bold text-[14px] text-[#0F172A]">
                Upload Optical RGB Image
              </div>
              <p className="text-[12px] text-[#64748B] max-w-sm mt-1">
                Drop satellite scene or UAV high-resolution optical capture (GeoTIFF, NITF, PNG, JPG). Supported spectral bands: RGB, VNIR.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  className="px-3 py-1.5 rounded bg-white border border-[#CBD5E1] text-[#0F172A] hover:bg-[#F8FAFC] text-[11px] font-medium shadow-2xs cursor-pointer"
                >
                  Browse Sensor Storage
                </button>
                <span className="text-[#94A3B8] text-[11px]">or fetch directly via Bhuvan DMS</span>
              </div>
            </div>

            {/* Staged File Ingestion Card */}
            <div className="border border-[#CBD5E1] rounded bg-white p-3 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                <span className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-[#15803D]">
                  <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
                  INGESTION STAGED // READY FOR PARSING
                </span>
                <button
                  onClick={() => onOpenSlideDetails('REMOVE_STAGED_FILE')}
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-[#B91C1C] hover:text-[#991B1B] cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Remove</span>
                </button>
              </div>

              {/* Thumbnail + Metadata Spec Table */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                {/* Visual Satellite Preview Thumbnail */}
                <div
                  onClick={() => onOpenSlideDetails('THUMBNAIL_PREVIEW')}
                  className="sm:col-span-5 h-28 rounded bg-[#1E293B] border border-[#CBD5E1] relative overflow-hidden flex flex-col justify-between p-1.5 cursor-pointer"
                >
                  {/* Stylized Himalayan valley texture representation */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#1E293B] via-[#475569] to-[#94A3B8] opacity-80"></div>
                  <div className="relative z-10 font-mono text-[9px] text-white/90 bg-black/40 px-1 py-0.5 rounded backdrop-blur-xs flex justify-between">
                    <span>Rishiganga Valley</span>
                    <span>100% ZOOM</span>
                  </div>
                  <div className="relative z-10 flex items-center justify-between font-mono text-[8px] text-cyan-300 bg-black/60 px-1 py-0.5 rounded">
                    <span>BAND: 3-2-1 True Color</span>
                    <span>GeoTIFF</span>
                  </div>
                </div>

                {/* Metadata Specifications */}
                <div className="sm:col-span-7 divide-y divide-[#F1F5F9] font-mono text-[10px]">
                  <div className="py-1 flex justify-between">
                    <span className="text-[#64748B]">SCENE IDENTIFIER</span>
                    <span className="font-bold text-[#0F172A] truncate max-w-[140px]">
                      ISRO_CARTOSAT3_20241018_...
                    </span>
                  </div>
                  <div className="py-1 flex justify-between">
                    <span className="text-[#64748B]">RASTER MATRIX</span>
                    <span className="text-[#0F172A]">4096 × 4096 px (16.7 MP)</span>
                  </div>
                  <div className="py-1 flex justify-between">
                    <span className="text-[#64748B]">GSD (GROUND RES)</span>
                    <span className="text-[#15803D] font-bold">0.50 m / pixel</span>
                  </div>
                  <div className="py-1 flex justify-between">
                    <span className="text-[#64748B]">CRS DATUM</span>
                    <span className="text-[#0F172A]">EPSG:32644 (UTM 44N)</span>
                  </div>
                  <div className="py-1 flex justify-between">
                    <span className="text-[#64748B]">FILE PAYLOAD</span>
                    <span className="text-[#0F172A]">48.2 MB (GeoTIFF BigTIFF)</span>
                  </div>
                  <div className="py-1 flex justify-between">
                    <span className="text-[#64748B]">RPC METADATA</span>
                    <span className="text-[#15803D] font-semibold">Available (98.4%)</span>
                  </div>
                </div>
              </div>

              {/* Checksum and Raw Headers */}
              <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between font-mono text-[10px] text-[#64748B]">
                <span>CHECKSUM: SHA256:7f4a...e12d</span>
                <button
                  onClick={() => onOpenSlideDetails('RAW_HEADERS')}
                  className="text-[#1E40AF] hover:underline cursor-pointer font-semibold"
                >
                  Inspect Raw Headers
                </button>
              </div>

              {/* Bounding Envelope */}
              <div
                onClick={() => onOpenSlideDetails('BOUNDING_ENVELOPE')}
                className="p-2 rounded bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between font-mono text-[10px] cursor-pointer hover:bg-[#F1F5F9]"
              >
                <div>
                  <span className="text-[#64748B] block">BOUNDING ENVELOPE:</span>
                  <span className="text-[#0F172A] font-semibold">
                    [79.682°E, 30.485°N] – [79.715°E, 30.521°N]
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[#64748B] block">AREA:</span>
                  <span className="text-[#1E40AF] font-bold">4.19 km²</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Geospatial Elevation Calibration */}
        <div className="bg-white rounded border border-[#CBD5E1] flex flex-col overflow-hidden shadow-2xs">
          <div className="p-3 border-b border-[#CBD5E1] bg-[#F8FAFC] flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-[13px] text-[#0F172A]">
              <Layers className="w-4 h-4 text-[#0D9488]" />
              <span>Geospatial Elevation Calibration</span>
            </div>
            <span className="text-[10px] font-mono text-[#64748B]">
              DATUM_CONV: EGM2008
            </span>
          </div>

          <div className="p-4 space-y-4 flex-1 overflow-y-auto text-[12px]">
            {/* Scientific Distinction Callout */}
            <div
              onClick={() => onOpenSlideDetails('SCIENTIFIC_DISTINCTION')}
              className="p-3 rounded bg-[#EFF6FF] border border-[#BFDBFE] cursor-pointer hover:bg-[#DBEAFE] transition-colors"
            >
              <div className="flex items-center gap-1.5 font-bold text-[#1E40AF] text-[12px] mb-1">
                <Info className="w-4 h-4 text-[#1E40AF] shrink-0" />
                <span>CRITICAL SCIENTIFIC DISTINCTION</span>
              </div>
              <p className="text-[12px] text-[#1E3A8A] leading-relaxed">
                Without reference elevation data, DepthWizard calculates <strong>Relative Depth (normalized 0.0–1.0)</strong>. To produce Calibrated Metric Elevation (meters AMSL) for volumetric flood inundation modeling, provide a reference DEM or surveyed GCPs.
              </p>
            </div>

            {/* Calibration Source Protocol */}
            <div className="space-y-2">
              <div className="text-[11px] font-mono uppercase text-[#64748B] font-semibold">
                CALIBRATION SOURCE PROTOCOL
              </div>

              {/* Protocol Option 1 */}
              <label
                onClick={() => setCalibrationProtocol('reference_dem')}
                className={`p-2.5 rounded border flex items-start gap-2.5 cursor-pointer transition-colors ${
                  calibrationProtocol === 'reference_dem'
                    ? 'border-[#1E40AF] bg-[#EFF6FF]/60'
                    : 'border-[#CBD5E1] bg-white hover:bg-[#F8FAFC]'
                }`}
              >
                <input
                  type="radio"
                  name="calibration_source"
                  checked={calibrationProtocol === 'reference_dem'}
                  onChange={() => setCalibrationProtocol('reference_dem')}
                  className="mt-0.5 text-[#1E40AF]"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#0F172A] text-[12px]">
                      Reference DEM Ingestion
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#1E40AF] text-white font-semibold">
                      ACTIVE
                    </span>
                  </div>
                  <p className="text-[11px] text-[#475569] mt-0.5">
                    Fuse coarse regional DEM for scale calibration & vertical datum registration.
                  </p>
                </div>
              </label>

              {/* Protocol Option 2 */}
              <label
                onClick={() => setCalibrationProtocol('gcps')}
                className={`p-2.5 rounded border flex items-start gap-2.5 cursor-pointer transition-colors ${
                  calibrationProtocol === 'gcps'
                    ? 'border-[#1E40AF] bg-[#EFF6FF]/60'
                    : 'border-[#CBD5E1] bg-white hover:bg-[#F8FAFC]'
                }`}
              >
                <input
                  type="radio"
                  name="calibration_source"
                  checked={calibrationProtocol === 'gcps'}
                  onChange={() => setCalibrationProtocol('gcps')}
                  className="mt-0.5 text-[#1E40AF]"
                />
                <div className="flex-1">
                  <div className="font-bold text-[#0F172A] text-[12px]">
                    Ground Control Points (.csv / .kml)
                  </div>
                  <p className="text-[11px] text-[#475569] mt-0.5">
                    Use surveyed theodolite or differential GPS anchor vertices.
                  </p>
                </div>
              </label>

              {/* Protocol Option 3 */}
              <label
                onClick={() => setCalibrationProtocol('cartodem')}
                className={`p-2.5 rounded border flex items-start gap-2.5 cursor-pointer transition-colors ${
                  calibrationProtocol === 'cartodem'
                    ? 'border-[#1E40AF] bg-[#EFF6FF]/60'
                    : 'border-[#CBD5E1] bg-white hover:bg-[#F8FAFC]'
                }`}
              >
                <input
                  type="radio"
                  name="calibration_source"
                  checked={calibrationProtocol === 'cartodem'}
                  onChange={() => setCalibrationProtocol('cartodem')}
                  className="mt-0.5 text-[#1E40AF]"
                />
                <div className="flex-1">
                  <div className="font-bold text-[#0F172A] text-[12px]">
                    Auto-Fetch ISRO CartoDEM v3 (Online)
                  </div>
                  <p className="text-[11px] text-[#475569] mt-0.5">
                    Automated stream fetch from NRSC GeoPortal via mission footprint match.
                  </p>
                </div>
              </label>

              {/* Protocol Option 4 */}
              <label
                onClick={() => setCalibrationProtocol('uncalibrated')}
                className={`p-2.5 rounded border flex items-start gap-2.5 cursor-pointer transition-colors ${
                  calibrationProtocol === 'uncalibrated'
                    ? 'border-[#1E40AF] bg-[#EFF6FF]/60'
                    : 'border-[#CBD5E1] bg-white hover:bg-[#F8FAFC]'
                }`}
              >
                <input
                  type="radio"
                  name="calibration_source"
                  checked={calibrationProtocol === 'uncalibrated'}
                  onChange={() => setCalibrationProtocol('uncalibrated')}
                  className="mt-0.5 text-[#1E40AF]"
                />
                <div className="flex-1">
                  <div className="font-bold text-[#0F172A] text-[12px]">
                    Relative Depth Only (Uncalibrated)
                  </div>
                  <p className="text-[11px] text-[#475569] mt-0.5">
                    Direct Monocular Estimation; unitless depth map without real elevation anchor.
                  </p>
                </div>
              </label>
            </div>

            {/* Configured Reference Model Details */}
            <div
              onClick={() => onOpenSlideDetails('REFERENCE_MODEL')}
              className="p-3 rounded border border-[#E2E8F0] bg-[#F8FAFC] font-mono text-[11px] cursor-pointer hover:bg-[#F1F5F9]"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-[#64748B] text-[10px] uppercase">CONFIGURED REFERENCE MODEL</span>
                <span className="font-bold text-[#15803D]">30m Spatial Res</span>
              </div>
              <div className="font-bold text-[#0F172A] text-[12px]">
                COP30_CHAMOLI_VALLEY_ELEV.TIF
              </div>
              <div className="flex justify-between text-[10px] text-[#475569] mt-1 pt-1 border-t border-[#E2E8F0]">
                <span>VERTICAL DATUM: EGM2008 Geoid</span>
                <span>ANCHOR ALIGNMENT: Ridge-Valley ICP</span>
              </div>
            </div>

            {/* Neural Inference Parameters */}
            <div className="space-y-2.5 pt-2 border-t border-[#E2E8F0]">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-[#64748B] uppercase font-semibold">INFERENCE PARAMETERS</span>
                <span className="text-[#1E40AF] font-bold">WEIGHTS: v2.4-DMS-STABLE</span>
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#475569] block mb-1">
                  MODEL ARCHITECTURE (142M Parameters)
                </label>
                <select
                  value={modelArchitecture}
                  onChange={(e) => setModelArchitecture(e.target.value)}
                  className="w-full h-8 px-2 bg-white border border-[#CBD5E1] rounded text-[12px] font-mono text-[#0F172A]"
                >
                  <option value="depth_transformer_v2">
                    ISRO-DepthTransformer-v2-Large (Hydrological Tuning)
                  </option>
                  <option value="vit_depth_dense">
                    ISRO-ViT-Depth-Dense (Stereo-Trained)
                  </option>
                  <option value="monodepth_light">
                    ISRO-MonoDepth-Mobile (Fast Tactical 2.1s)
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-[#475569] block mb-1">
                    QUANTIZATION
                  </label>
                  <select
                    value={quantization}
                    onChange={(e) => setQuantization(e.target.value)}
                    className="w-full h-8 px-2 bg-white border border-[#CBD5E1] rounded text-[12px] font-mono text-[#0F172A]"
                  >
                    <option value="fp16">16-bit Float (0.1m step)</option>
                    <option value="fp32">32-bit Float (0.01m step)</option>
                    <option value="int8">8-bit Quantized (0.5m step)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[#475569] block mb-1">
                    CONTOUR STEP
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={contourStep}
                      onChange={(e) => setContourStep(Number(e.target.value))}
                      className="w-full h-8 px-2 bg-white border border-[#CBD5E1] rounded-l text-[12px] font-mono text-[#0F172A]"
                    />
                    <span className="h-8 px-2 bg-[#F1F5F9] border border-l-0 border-[#CBD5E1] rounded-r flex items-center font-mono text-[11px] text-[#64748B]">
                      meters
                    </span>
                  </div>
                </div>
              </div>

              {/* Post-processing refinements */}
              <div className="space-y-1.5 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-sans text-[12px] text-[#334155]">
                  <input
                    type="checkbox"
                    checked={bilateralFilter}
                    onChange={(e) => setBilateralFilter(e.target.checked)}
                    className="rounded text-[#1E40AF]"
                  />
                  <span>Bilateral Edge-Preserving Filter</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-sans text-[12px] text-[#334155]">
                  <input
                    type="checkbox"
                    checked={shadowOcclusion}
                    onChange={(e) => setShadowOcclusion(e.target.checked)}
                    className="rounded text-[#1E40AF]"
                  />
                  <span>Shadow-to-Height Occlusion Rectification</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Operational Execution Bar */}
      <div className="h-14 bg-white border-t border-[#CBD5E1] px-4 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-6 font-mono text-[11px] text-[#475569]">
          <div>
            <span className="text-[#64748B]">ESTIMATED COMPUTE: </span>
            <span className="font-bold text-[#0F172A]">~5.4 seconds</span>
          </div>
          <div className="hidden sm:block">
            <span className="text-[#64748B]">GPU TARGET: </span>
            <span className="font-bold text-[#0F172A]">NVIDIA A100 (ISRO NRSC Node #07)</span>
          </div>
          <div className="hidden md:block">
            <span className="text-[#64748B]">VRAM ALLOCATION: </span>
            <span className="font-bold text-[#1E40AF]">14.2 / 80 GB</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('overview')}
            className="px-4 py-2 text-[12px] font-medium bg-white text-[#475569] border border-[#CBD5E1] rounded hover:bg-[#F8FAFC] transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            id="execute-terrain-analysis-btn"
            onClick={handleRunAnalysis}
            disabled={isRunningAnalysis}
            className="inline-flex items-center gap-2 px-5 py-2 text-[13px] font-semibold bg-[#1E40AF] hover:bg-[#1D4ED8] active:bg-[#1E3A8A] text-white rounded transition-colors shadow-xs cursor-pointer disabled:opacity-70"
          >
            {isRunningAnalysis ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Running Pipeline ({analysisProgress}%)...</span>
              </>
            ) : (
              <>
                <span>Run Terrain Analysis</span>
                <span>→</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
