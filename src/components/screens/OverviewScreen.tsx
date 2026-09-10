import React, { useState, useRef, useEffect } from 'react';
import {
  RotateCcw,
  Download,
  Share2,
  FolderClosed,
  Layers,
  ShieldCheck,
  Radio,
  Box,
  Ruler,
  Eye,
  Plane,
  Maximize2,
  AlertTriangle,
  FileText,
  TrendingUp,
  Compass,
  Sparkles,
} from 'lucide-react';
import { CURRENT_SCENE, TRANSECT_PROFILE_POINTS } from '../../data/mockData';
import { LayerConfig, NavModule } from '../../types';

interface OverviewScreenProps {
  onNavigate: (module: NavModule) => void;
  onOpenSlideDetails: (sourceKey?: string) => void;
}

export const OverviewScreen: React.FC<OverviewScreenProps> = ({
  onNavigate,
  onOpenSlideDetails,
}) => {
  const [layers, setLayers] = useState<LayerConfig>({
    rgbOrtho: true,
    depthMap: false,
    elevationDem: true,
    slopeAspect: false,
    contours: true,
    utmGrid: true,
  });

  const [mousePos, setMousePos] = useState({ x: 320, y: 220 });
  const [isHoveringCanvas, setIsHoveringCanvas] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Render the interactive 2D DEM / Contour / Hazard Viewport Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let frame = 0;

    const render = () => {
      frame++;
      const width = canvas.width;
      const height = canvas.height;

      // Clear
      ctx.clearRect(0, 0, width, height);

      // Base background: Terrain elevation hypsometric color fill
      const grad = ctx.createLinearGradient(0, 0, width, height);
      if (layers.elevationDem) {
        grad.addColorStop(0, '#1E293B'); // High mountain peaks (dark slate)
        grad.addColorStop(0.35, '#334155');
        grad.addColorStop(0.55, '#475569');
        grad.addColorStop(0.75, '#64748B');
        grad.addColorStop(1, '#94A3B8'); // Lower valley floor
      } else if (layers.depthMap) {
        grad.addColorStop(0, '#020617');
        grad.addColorStop(0.5, '#1E3A8A');
        grad.addColorStop(1, '#06B6D4');
      } else {
        grad.addColorStop(0, '#2D3748');
        grad.addColorStop(1, '#1A202C');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Rugged Mountain Ridge Silhouettes (Himalayan Gorge Layers)
      const drawRidge = (baseY: number, roughness: number, fill: string) => {
        ctx.beginPath();
        ctx.moveTo(0, height);
        ctx.lineTo(0, baseY);
        for (let x = 0; x <= width; x += 30) {
          const y = baseY + Math.sin(x * 0.008 + roughness) * 50 + Math.cos(x * 0.02) * 20;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fillStyle = fill;
        ctx.fill();
      };

      drawRidge(height * 0.35, 1.2, 'rgba(15, 23, 42, 0.7)');
      drawRidge(height * 0.52, 2.5, 'rgba(30, 41, 59, 0.65)');
      drawRidge(height * 0.68, 4.1, 'rgba(51, 65, 85, 0.6)');

      // Topographic Contours (25m interval lines)
      if (layers.contours) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 9; i++) {
          ctx.beginPath();
          const lineY = 60 + i * 45;
          ctx.moveTo(0, lineY);
          for (let x = 0; x <= width; x += 25) {
            const yOffset = Math.sin(x * 0.009 + i) * 25 + Math.cos(x * 0.015) * 15;
            ctx.lineTo(x, lineY + yOffset);
          }
          ctx.stroke();
        }
      }

      // UTM Coordinate Grid lines
      if (layers.utmGrid) {
        ctx.strokeStyle = 'rgba(203, 213, 225, 0.12)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 6]);
        for (let x = 80; x < width; x += 120) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 60; y < height; y += 90) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
        ctx.setLineDash([]);
      }

      // River / Valley Gorge Drainage Axis (Rishiganga stream)
      ctx.beginPath();
      ctx.moveTo(width * 0.15, height);
      ctx.quadraticCurveTo(width * 0.42, height * 0.65, width * 0.58, height * 0.52);
      ctx.lineTo(width * 0.75, height * 0.4);
      ctx.strokeStyle = '#06B6D4';
      ctx.lineWidth = 18;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Flow pulse highlight
      ctx.beginPath();
      ctx.moveTo(width * 0.15, height);
      ctx.quadraticCurveTo(width * 0.42, height * 0.65, width * 0.58, height * 0.52);
      ctx.lineTo(width * 0.75, height * 0.4);
      ctx.strokeStyle = '#67E8F9';
      ctx.lineWidth = 6;
      ctx.stroke();

      // Hazard Zone: Debris accumulation polygon & breach choke area
      const chokeCenterX = width * 0.5;
      const chokeCenterY = height * 0.62;

      ctx.beginPath();
      ctx.moveTo(chokeCenterX - 45, chokeCenterY - 35);
      ctx.lineTo(chokeCenterX + 50, chokeCenterY - 20);
      ctx.lineTo(chokeCenterX + 40, chokeCenterY + 45);
      ctx.lineTo(chokeCenterX - 35, chokeCenterY + 50);
      ctx.closePath();
      ctx.fillStyle = 'rgba(217, 119, 6, 0.4)';
      ctx.fill();
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Hazard warning target marker
      const pulseSize = 8 + Math.sin(frame * 0.08) * 2;
      ctx.beginPath();
      ctx.arc(chokeCenterX, chokeCenterY, pulseSize, 0, Math.PI * 2);
      ctx.strokeStyle = '#DC2626';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(chokeCenterX, chokeCenterY, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#DC2626';
      ctx.fill();

      // Cross section line (A -> A')
      ctx.beginPath();
      ctx.moveTo(chokeCenterX - 70, chokeCenterY - 25);
      ctx.lineTo(chokeCenterX + 70, chokeCenterY + 25);
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#E0F2FE';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.fillText('A', chokeCenterX - 85, chokeCenterY - 25);
      ctx.fillText("A'", chokeCenterX + 76, chokeCenterY + 28);

      // Mouse inspection crosshair if hovering
      if (isHoveringCanvas) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 4]);
        ctx.beginPath();
        ctx.moveTo(mousePos.x, 0);
        ctx.lineTo(mousePos.x, height);
        ctx.moveTo(0, mousePos.y);
        ctx.lineTo(width, mousePos.y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Reticle box
        ctx.strokeRect(mousePos.x - 8, mousePos.y - 8, 16, 16);
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [layers, mousePos, isHoveringCanvas]);

  const toggleLayer = (key: keyof LayerConfig) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div id="overview-screen" className="flex-1 flex flex-col overflow-y-auto bg-[#F5F7FA]">
      {/* Top Banner & Title Actions */}
      <div className="bg-white border-b border-[#CBD5E1] p-4 shrink-0 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-[20px] font-bold text-[#0F172A] tracking-tight">
              Terrain Intelligence
            </h1>
            <span
              onClick={() => onOpenSlideDetails('MISSION_DISASTER_OPS')}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE] font-semibold tracking-wider cursor-pointer hover:bg-[#DBEAFE]"
            >
              MISSION: DISASTER-OPS
            </span>
          </div>
          <p className="text-[13px] text-[#475569]">
            Analyze remote-sensing imagery and generate interactive 3D terrain for ISRO Disaster Management.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            id="overview-rerun-btn"
            onClick={() => onOpenSlideDetails('CALIBRATION_RERUN')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium bg-white text-[#0F172A] border border-[#CBD5E1] rounded hover:bg-[#F8FAFC] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#475569]" />
            <span>Re-run Calibration</span>
          </button>

          <button
            id="overview-export-dem-btn"
            onClick={() => onOpenSlideDetails('EXPORT_DEM')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium bg-white text-[#0F172A] border border-[#CBD5E1] rounded hover:bg-[#F8FAFC] transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#475569]" />
            <span>Export DEM (GeoTIFF)</span>
          </button>

          <button
            id="overview-share-dsc-btn"
            onClick={() => onOpenSlideDetails('SHARE_DSC')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[12px] font-medium bg-[#1E40AF] text-white rounded hover:bg-[#1D4ED8] transition-colors cursor-pointer shadow-2xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share to DSC</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Metrics Row */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Metric 1: Total Projects */}
        <div
          id="kpi-total-projects"
          onClick={() => onOpenSlideDetails('TOTAL_PROJECTS')}
          className="p-3.5 bg-white rounded border border-[#E2E8F0] hover:border-[#93C5FD] hover:shadow-xs transition-all cursor-pointer group"
          title="Click to view Project registry details"
        >
          <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B] uppercase mb-1">
            <span>TOTAL PROJECTS</span>
            <FolderClosed className="w-4 h-4 text-[#94A3B8] group-hover:text-[#1E40AF] transition-colors" />
          </div>
          <div className="text-[22px] font-bold font-sans text-[#0F172A] leading-tight">
            142 Active
          </div>
          <div className="text-[11px] text-[#475569] truncate mt-1">
            28 High Priority Flood/Landslide Basi...
          </div>
        </div>

        {/* Metric 2: Reconstructions */}
        <div
          id="kpi-reconstructions"
          onClick={() => onOpenSlideDetails('RECONSTRUCTIONS')}
          className="p-3.5 bg-white rounded border border-[#E2E8F0] hover:border-[#93C5FD] hover:shadow-xs transition-all cursor-pointer group"
          title="Click to inspect reconstruction pipeline"
        >
          <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B] uppercase mb-1">
            <span>RECONSTRUCTIONS</span>
            <Layers className="w-4 h-4 text-[#94A3B8] group-hover:text-[#1E40AF] transition-colors" />
          </div>
          <div className="text-[22px] font-bold font-sans text-[#0F172A] leading-tight">
            1,894 Scenes
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#15803D] font-medium mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span>
            <span>94.2% Success Rate</span>
          </div>
        </div>

        {/* Metric 3: Average Confidence */}
        <div
          id="kpi-confidence"
          onClick={() => onOpenSlideDetails('CONFIDENCE')}
          className="p-3.5 bg-white rounded border border-[#E2E8F0] hover:border-[#93C5FD] hover:shadow-xs transition-all cursor-pointer group"
          title="Click to inspect validation metrics"
        >
          <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B] uppercase mb-1">
            <span>AVERAGE CONFIDENCE</span>
            <ShieldCheck className="w-4 h-4 text-[#94A3B8] group-hover:text-[#1E40AF] transition-colors" />
          </div>
          <div className="text-[22px] font-bold font-sans text-[#0F172A] leading-tight">
            96.4%
          </div>
          <div className="text-[11px] text-[#475569] truncate mt-1 font-mono">
            RMSE 0.42m against Cartosat-3 GCPs
          </div>
        </div>

        {/* Metric 4: Latest Scene Run */}
        <div
          id="kpi-latest-scene"
          onClick={() => onOpenSlideDetails('LATEST_SCENE')}
          className="p-3.5 bg-white rounded border border-[#E2E8F0] hover:border-[#93C5FD] hover:shadow-xs transition-all cursor-pointer group"
          title="Click to inspect active scene telemetry"
        >
          <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B] uppercase mb-1">
            <span>LATEST SCENE RUN</span>
            <span className="flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#DCFCE7] text-[#15803D]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse"></span>
              Live
            </span>
          </div>
          <div className="text-[17px] font-bold font-sans text-[#0F172A] leading-tight truncate">
            Chamoli GLOF Incident
          </div>
          <div className="text-[11px] text-[#475569] truncate mt-1 font-mono">
            Processed 12 mins ago • Calibrated Me...
          </div>
        </div>
      </div>

      {/* Central Split View: GIS Canvas on Left + Active Scene Analysis on Right */}
      <div className="px-4 pb-4 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Interactive GIS DEM / Contour Viewport (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded border border-[#CBD5E1] flex flex-col overflow-hidden shadow-2xs relative">
          {/* Top in-viewport toolbar */}
          <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 bg-white/90 backdrop-blur-xs p-1 rounded border border-[#CBD5E1] shadow-xs">
            <button
              onClick={() => onNavigate('explore-3d')}
              className="p-1.5 rounded bg-[#1E40AF] text-white hover:bg-[#1D4ED8] transition-colors cursor-pointer"
              title="Open 3D Mesh Inspector"
            >
              <Box className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onOpenSlideDetails('RULER_TOOL')}
              className="p-1.5 rounded text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors cursor-pointer"
              title="Measure Elevation Transect"
            >
              <Ruler className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onOpenSlideDetails('LAYER_VISIBILITY')}
              className="p-1.5 rounded text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors cursor-pointer"
              title="Toggle Terrain Layers"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('flythrough')}
              className="p-1.5 rounded text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors cursor-pointer"
              title="Launch Flythrough Simulation"
            >
              <Plane className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onOpenSlideDetails('REFRESH_VIEW')}
              className="p-1.5 rounded text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors cursor-pointer"
              title="Recalculate View Extents"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('terrain-map')}
              className="p-1.5 rounded text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors cursor-pointer"
              title="Maximize Map View"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Layer toggles bar */}
          <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-white/90 backdrop-blur-xs p-1 rounded border border-[#CBD5E1] shadow-xs text-[11px] font-mono">
            <button
              onClick={() => toggleLayer('rgbOrtho')}
              className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                layers.rgbOrtho ? 'bg-[#1E40AF] text-white font-medium' : 'text-[#475569] hover:bg-[#F1F5F9]'
              }`}
            >
              • RGB Ortho
            </button>
            <button
              onClick={() => toggleLayer('depthMap')}
              className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                layers.depthMap ? 'bg-[#1E40AF] text-white font-medium' : 'text-[#475569] hover:bg-[#F1F5F9]'
              }`}
            >
              • Depth Map
            </button>
            <button
              onClick={() => toggleLayer('elevationDem')}
              className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                layers.elevationDem ? 'bg-[#1E40AF] text-white font-medium' : 'text-[#475569] hover:bg-[#F1F5F9]'
              }`}
            >
              • Elevation DEM
            </button>
            <button
              onClick={() => toggleLayer('slopeAspect')}
              className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                layers.slopeAspect ? 'bg-[#1E40AF] text-white font-medium' : 'text-[#475569] hover:bg-[#F1F5F9]'
              }`}
            >
              • Slope Aspect
            </button>
            <button
              onClick={() => toggleLayer('contours')}
              className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                layers.contours ? 'bg-[#1E40AF] text-white font-medium' : 'text-[#475569] hover:bg-[#F1F5F9]'
              }`}
            >
              • Contours (25m)
            </button>
            <button
              onClick={() => toggleLayer('utmGrid')}
              className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                layers.utmGrid ? 'bg-[#1E40AF] text-white font-medium' : 'text-[#475569] hover:bg-[#F1F5F9]'
              }`}
            >
              • UTM Grid
            </button>
          </div>

          {/* Canvas Rendering Area */}
          <div
            className="flex-1 relative min-h-[420px] cursor-crosshair overflow-hidden"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            }}
            onMouseEnter={() => setIsHoveringCanvas(true)}
            onMouseLeave={() => setIsHoveringCanvas(false)}
            onClick={() => onOpenSlideDetails('MAP_CLICK_COORDS')}
          >
            <canvas
              ref={canvasRef}
              width={900}
              height={500}
              className="w-full h-full object-cover block"
            />

            {/* Bottom Floating Overlays (Elevation Ramp, Compass, Scale) */}
            <div className="absolute bottom-2 left-2 z-10 flex items-center gap-2">
              {/* Elevation Ramp Scale */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenSlideDetails('ELEVATION_RAMP');
                }}
                className="bg-white/95 backdrop-blur-xs p-2 rounded border border-[#CBD5E1] shadow-xs cursor-pointer hover:bg-white"
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-[#64748B] mb-1">
                  <span>ELEVATION (MSL)</span>
                  <span className="font-semibold text-[#0F172A]">WGS-84</span>
                </div>
                <div className="w-36 h-2 rounded-xs bg-gradient-to-r from-[#1E293B] via-[#475569] to-[#06B6D4]"></div>
                <div className="flex justify-between font-mono text-[9px] text-[#475569] mt-1">
                  <span>1,420m</span>
                  <span>2,650m</span>
                  <span>3,890m</span>
                </div>
              </div>
            </div>

            {/* Right bottom: North arrow & 500m scale */}
            <div className="absolute bottom-2 right-2 z-10 flex items-center gap-2">
              <div className="bg-white/95 backdrop-blur-xs px-2 py-1 rounded border border-[#CBD5E1] font-mono text-[10px] font-bold text-[#0F172A] flex items-center gap-1 shadow-xs">
                <span>N</span>
                <Compass className="w-3.5 h-3.5 text-[#1E40AF]" />
              </div>

              <div className="bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded border border-[#CBD5E1] font-mono text-[10px] text-[#0F172A] shadow-xs flex flex-col items-center">
                <div className="w-14 h-0.5 bg-[#0F172A] mb-0.5"></div>
                <span>500 m</span>
              </div>
            </div>
          </div>

          {/* Viewport Bottom Geodetic Telemetry Status Bar */}
          <div
            onClick={() => onOpenSlideDetails('NADIR_TELEMETRY')}
            className="h-8 bg-white border-t border-[#CBD5E1] px-3 flex items-center justify-between font-mono text-[11px] text-[#475569] select-none shrink-0 cursor-pointer hover:bg-[#F8FAFC]"
          >
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-[#0F172A]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span>
                Lat: 30°29'44.2"N, Lon: 79°41'32.8"E
              </span>
              <span>|</span>
              <span className="text-[#1E40AF] font-semibold">Elev: 2,145.6m</span>
              <span>|</span>
              <span>Slope: 38.4°</span>
              <span>|</span>
              <span>Rel. Depth: 0.814</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase text-[#64748B]">RENDER: WEBGPU-ACCEL</span>
              <span className="text-[#15803D] font-bold">60 FPS</span>
            </div>
          </div>
        </div>

        {/* Right: Active Scene Analysis Panel (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded border border-[#CBD5E1] flex flex-col overflow-hidden shadow-2xs">
          {/* Panel Header */}
          <div className="p-3 border-b border-[#CBD5E1] bg-[#F8FAFC] flex items-center justify-between">
            <h2 className="font-bold text-[13px] text-[#0F172A] truncate">
              Active Scene Analysis
            </h2>
            <span
              onClick={() => onOpenSlideDetails('CALIBRATED_METRIC')}
              className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#99F6E4] text-[#0F766E] font-bold tracking-wider uppercase cursor-pointer hover:bg-[#5EEAD4]"
            >
              CALIBRATED METRIC
            </span>
          </div>

          <div className="p-3 flex-1 overflow-y-auto space-y-3.5 text-[12px]">
            {/* Attribute List */}
            <div className="divide-y divide-[#F1F5F9] font-mono text-[11px]">
              <div
                onClick={() => onOpenSlideDetails('SENSOR_DATASET')}
                className="py-1.5 flex justify-between cursor-pointer hover:bg-[#F8FAFC] px-1 rounded"
              >
                <span className="text-[#64748B]">Sensor Dataset</span>
                <span className="font-semibold text-[#0F172A]">Cartosat-3 Optical (0.5m GSD)</span>
              </div>
              <div
                onClick={() => onOpenSlideDetails('ACQUISITION_DATE')}
                className="py-1.5 flex justify-between cursor-pointer hover:bg-[#F8FAFC] px-1 rounded"
              >
                <span className="text-[#64748B]">Acquisition Date</span>
                <span className="text-[#0F172A]">2024-10-18 05:42 UTC</span>
              </div>
              <div
                onClick={() => onOpenSlideDetails('RECONSTRUCTION_MODE')}
                className="py-1.5 flex justify-between cursor-pointer hover:bg-[#F8FAFC] px-1 rounded"
              >
                <span className="text-[#64748B]">Reconstruction Mode</span>
                <span className="text-[#15803D] font-medium">Calibrated (SRTM-v3 + 6 GCPs)</span>
              </div>
              <div
                onClick={() => onOpenSlideDetails('ELEVATION_RANGE')}
                className="py-1.5 flex justify-between cursor-pointer hover:bg-[#F8FAFC] px-1 rounded"
              >
                <span className="text-[#64748B]">Elevation Range</span>
                <span className="text-[#0F172A]">1,420m – 3,890m (Δ 2,470m)</span>
              </div>
              <div
                onClick={() => onOpenSlideDetails('SLOPE_ASPECT')}
                className="py-1.5 flex justify-between cursor-pointer hover:bg-[#F8FAFC] px-1 rounded"
              >
                <span className="text-[#64748B]">Mean Slope Aspect</span>
                <span className="text-[#B45309] font-medium">34.2° (Extreme Relief)</span>
              </div>
              <div
                onClick={() => onOpenSlideDetails('MODEL_CONFIDENCE')}
                className="py-1.5 flex justify-between cursor-pointer hover:bg-[#F8FAFC] px-1 rounded"
              >
                <span className="text-[#64748B]">Model Confidence</span>
                <span className="text-[#1E40AF] font-bold">97.8% (DeepDepth-Net v4)</span>
              </div>
              <div
                onClick={() => onOpenSlideDetails('INFERENCE_LATENCY')}
                className="py-1.5 flex justify-between cursor-pointer hover:bg-[#F8FAFC] px-1 rounded"
              >
                <span className="text-[#64748B]">Inference Latency</span>
                <span className="text-[#0F172A]">4.82s (TensorRT FP16)</span>
              </div>
            </div>

            {/* Hazard Assessment Alert Box */}
            <div
              id="overview-hazard-alert"
              onClick={() => onOpenSlideDetails('HAZARD_ASSESSMENT')}
              className="p-3 rounded bg-[#FEF2F2] border border-[#FECACA] cursor-pointer hover:bg-[#FEE2E2] transition-colors"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5 font-bold text-[#B91C1C] text-[12px]">
                  <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
                  <span>Hazard Assessment</span>
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#DC2626] text-white font-bold tracking-wider">
                  HIGH SEVERITY
                </span>
              </div>
              <p className="text-[12px] text-[#7F1D1D] leading-snug">
                Landslide debris accumulation detected along the narrow gorge segment of Rishiganga downstream.
              </p>

              <div className="grid grid-cols-2 gap-2 mt-2.5 pt-2 border-t border-[#FCA5A5] font-mono text-[11px]">
                <div>
                  <span className="text-[#991B1B] text-[10px] block uppercase">DAMMING RISK</span>
                  <span className="font-bold text-[#B91C1C] text-[13px]">High (1.4M m³)</span>
                </div>
                <div>
                  <span className="text-[#991B1B] text-[10px] block uppercase">DEBRIS PATH</span>
                  <span className="font-bold text-[#0F172A] text-[13px]">4.2 km Mapped</span>
                </div>
              </div>
            </div>

            {/* Transverse Gorge Profile (A -> A') SVG Graph */}
            <div
              onClick={() => onOpenSlideDetails('TRANSVERSE_PROFILE')}
              className="p-3 rounded border border-[#CBD5E1] bg-[#F8FAFC] cursor-pointer hover:bg-[#F1F5F9] transition-colors"
            >
              <div className="flex items-center justify-between text-[11px] font-mono text-[#475569] font-medium mb-1.5">
                <span>TRANSVERSE GORGE PROFILE (A → A')</span>
              </div>
              {/* SVG Profile Curve */}
              <div className="relative h-20 w-full bg-white rounded border border-[#E2E8F0] p-1 flex items-center justify-center">
                <svg viewBox="0 0 300 70" className="w-full h-full overflow-visible">
                  {/* Valley V-notch Profile curve */}
                  <path
                    d="M 10 15 Q 80 40 135 55 T 165 55 Q 220 40 290 15"
                    fill="none"
                    stroke="#1E40AF"
                    strokeWidth="2.5"
                  />
                  {/* Debris blockage sediment layer */}
                  <polygon
                    points="120,53 150,42 180,53"
                    fill="#F59E0B"
                    stroke="#D97706"
                    strokeWidth="1.5"
                  />
                  {/* Center choke marker */}
                  <circle cx="150" cy="42" r="3" fill="#DC2626" />
                </svg>
              </div>
              <div className="flex justify-between font-mono text-[10px] text-[#64748B] mt-1">
                <span>West Wall</span>
                <span className="text-[#DC2626] font-bold">Choke: -45m</span>
                <span>East Wall</span>
              </div>
            </div>

            {/* Panel Buttons */}
            <div className="space-y-2 pt-1 font-sans">
              <button
                id="overview-launch-flythrough-btn"
                onClick={() => onNavigate('flythrough')}
                className="w-full py-2 px-3 rounded bg-[#1E40AF] text-white hover:bg-[#1D4ED8] transition-colors flex items-center justify-center gap-2 font-medium text-[12px] shadow-xs cursor-pointer"
              >
                <Plane className="w-3.5 h-3.5" />
                <span>Launch 3D Flythrough Path</span>
              </button>

              <button
                id="overview-generate-profile-btn"
                onClick={() => onNavigate('explore-3d')}
                className="w-full py-2 px-3 rounded bg-white text-[#0F172A] border border-[#CBD5E1] hover:bg-[#F8FAFC] transition-colors flex items-center justify-center gap-2 font-medium text-[12px] cursor-pointer"
              >
                <TrendingUp className="w-3.5 h-3.5 text-[#475569]" />
                <span>Generate Profile Section</span>
              </button>

              <button
                id="overview-download-report-btn"
                onClick={() => onOpenSlideDetails('PDF_SITUATION_REPORT')}
                className="w-full py-2 px-3 rounded bg-white text-[#0F172A] border border-[#CBD5E1] hover:bg-[#F8FAFC] transition-colors flex items-center justify-center gap-2 font-medium text-[12px] cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-[#475569]" />
                <span>Download Situation Report (PDF)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
