import React, { useState, useRef, useEffect } from 'react';
import {
  Rotate3d,
  Move,
  Plane,
  TrendingUp,
  Download,
  Crop,
  Maximize2,
  Layers,
  RotateCcw,
  Compass,
  AlertTriangle,
  FileDown,
  ChevronRight,
  ShieldCheck,
  Activity,
  Radio,
} from 'lucide-react';
import { CURRENT_SCENE, TRANSECT_PROFILE_POINTS } from '../../data/mockData';
import { NavModule } from '../../types';

interface Explore3DScreenProps {
  onNavigate: (module: NavModule) => void;
  onOpenSlideDetails: (sourceKey?: string) => void;
}

export const Explore3DScreen: React.FC<Explore3DScreenProps> = ({
  onNavigate,
  onOpenSlideDetails,
}) => {
  const [cameraMode, setCameraMode] = useState<'orbit' | 'pan' | 'fly' | 'profile'>('orbit');
  const [vertExag, setVertExag] = useState<number>(1.75);
  const [azimuth, setAzimuth] = useState<number>(218);
  const [pitch, setPitch] = useState<number>(34);
  const [pinVisible, setPinVisible] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const [layers, setLayers] = useState({
    rgbOrtho: true,
    depthHeatmap: true,
    metricDem: true,
    slopeAspect: false,
    contours: true,
    tinMesh: false,
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // High-performance 3D Terrain Perspective Canvas Renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Deep sky/atmosphere gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, '#0F172A');
      skyGrad.addColorStop(0.35, '#1E293B');
      skyGrad.addColorStop(0.7, '#334155');
      skyGrad.addColorStop(1, '#1E293B');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // 3D Perspective Grid & Mountain Gorge Surface
      const centerX = w * 0.5;
      const centerY = h * 0.55;
      const rows = 28;
      const cols = 36;
      const scaleX = 22;
      const scaleZ = 18;
      const radAzimuth = (azimuth * Math.PI) / 180;
      const radPitch = (pitch * Math.PI) / 180;

      // Project 3D point (x, y, z) to 2D screen
      const project = (x: number, y: number, z: number) => {
        // Rotate around Y axis (azimuth)
        const rotX = x * Math.cos(radAzimuth) - z * Math.sin(radAzimuth);
        const rotZ = x * Math.sin(radAzimuth) + z * Math.cos(radAzimuth);

        // Rotate around X axis (pitch)
        const rotY = y * Math.cos(radPitch) - rotZ * Math.sin(radPitch);
        const depthZ = y * Math.sin(radPitch) + rotZ * Math.cos(radPitch) + 500;

        const fov = 450;
        const screenX = centerX + (rotX * fov) / depthZ;
        const screenY = centerY - (rotY * fov) / depthZ;
        return { x: screenX, y: screenY, z: depthZ };
      };

      // Elevation field equation modeling steep Himalayan V-notch gorge
      const getElevation = (r: number, c: number) => {
        const u = (c - cols / 2) / (cols / 2);
        const v = (r - rows / 2) / (rows / 2);
        // V-valley channel
        const valleyBase = Math.abs(u) * 95 * vertExag;
        // Natural ridgeline noise
        const ridgeNoise =
          (Math.sin(u * 5.2 + v * 3.1) * 20 + Math.cos(v * 6.4) * 15) * vertExag;
        // Dam debris mound at valley center (r around 14, c around 18)
        const debrisDist = Math.hypot(u * 15, (v - 0.1) * 12);
        const debrisMound = Math.max(0, 28 - debrisDist * 3.5) * vertExag;

        return valleyBase + ridgeNoise + debrisMound;
      };

      // Draw perspective terrain quads / mesh lines
      for (let r = 0; r < rows - 1; r++) {
        for (let c = 0; c < cols - 1; c++) {
          const x0 = (c - cols / 2) * scaleX;
          const z0 = (r - rows / 2) * scaleZ;
          const y0 = getElevation(r, c);

          const x1 = (c + 1 - cols / 2) * scaleX;
          const z1 = (r - rows / 2) * scaleZ;
          const y1 = getElevation(r, c + 1);

          const x2 = (c + 1 - cols / 2) * scaleX;
          const z2 = (r + 1 - rows / 2) * scaleZ;
          const y2 = getElevation(r + 1, c + 1);

          const x3 = (c - cols / 2) * scaleX;
          const z3 = (r + 1 - rows / 2) * scaleZ;
          const y3 = getElevation(r + 1, c);

          const p0 = project(x0, y0, z0);
          const p1 = project(x1, y1, z1);
          const p2 = project(x2, y2, z2);
          const p3 = project(x3, y3, z3);

          if (p0.z <= 50 || p1.z <= 50 || p2.z <= 50 || p3.z <= 50) continue;

          // Face color based on elevation & slope
          const avgElev = (y0 + y1 + y2 + y3) / 4;
          const normElev = Math.min(1, Math.max(0, avgElev / (140 * vertExag)));

          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.lineTo(p3.x, p3.y);
          ctx.closePath();

          if (layers.metricDem) {
            // Hypsometric tint: Deep slate/cyan to alpine snow peak
            const rCol = Math.floor(30 + normElev * 140);
            const gCol = Math.floor(60 + normElev * 150);
            const bCol = Math.floor(90 + normElev * 150);
            ctx.fillStyle = `rgb(${rCol}, ${gCol}, ${bCol})`;
            ctx.fill();
          } else if (layers.depthHeatmap) {
            // Depth Heatmap
            const hue = (1 - normElev) * 220;
            ctx.fillStyle = `hsl(${hue}, 80%, 45%)`;
            ctx.fill();
          } else {
            ctx.fillStyle = '#334155';
            ctx.fill();
          }

          // Wireframe / TIN mesh lines
          if (layers.tinMesh || layers.contours) {
            ctx.strokeStyle = layers.tinMesh
              ? 'rgba(255, 255, 255, 0.22)'
              : 'rgba(203, 213, 225, 0.12)';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Draw River Inflow Channel (Gorge Thalweg)
      ctx.beginPath();
      for (let r = 0; r < rows; r++) {
        const cCenter = cols / 2;
        const x = 0;
        const z = (r - rows / 2) * scaleZ;
        const y = getElevation(r, cCenter);
        const p = project(x, y + 2, z);
        if (r === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = '#06B6D4';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Draw Breach Chokepoint Pin Marker in 3D
      const pinR = 14;
      const pinC = cols / 2;
      const pinX = 0;
      const pinZ = (pinR - rows / 2) * scaleZ;
      const pinY = getElevation(pinR, pinC);
      const pinProj = project(pinX, pinY, pinZ);

      if (pinVisible && pinProj.z > 50) {
        // Vertical plumb beacon
        ctx.beginPath();
        ctx.moveTo(pinProj.x, pinProj.y);
        ctx.lineTo(pinProj.x, pinProj.y - 45);
        ctx.strokeStyle = '#DC2626';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Pulsing radar ring
        ctx.beginPath();
        ctx.arc(pinProj.x, pinProj.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(220, 38, 38, 0.35)';
        ctx.fill();
        ctx.strokeStyle = '#DC2626';
        ctx.stroke();

        // Pin Head
        ctx.beginPath();
        ctx.arc(pinProj.x, pinProj.y - 45, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#DC2626';
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [azimuth, pitch, vertExag, layers, pinVisible]);

  // Mouse drag handler to rotate 3D scene
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    setAzimuth((prev) => (prev + deltaX * 0.4) % 360);
    setPitch((prev) => Math.max(10, Math.min(85, prev - deltaY * 0.3)));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div id="explore-3d-screen" className="flex-1 flex flex-col overflow-y-auto bg-[#F5F7FA]">
      {/* Subheader Dataset & Camera Bar */}
      <div className="bg-[#FAFBFD] border-b border-[#CBD5E1] px-4 py-1.5 flex flex-wrap items-center justify-between text-[11px] font-mono shrink-0 gap-2">
        <div className="flex items-center gap-3">
          <span className="text-[#0F172A] font-semibold">
            DATASET: CARTOSAT-3 / RISAT-1A HYBRID DEM
          </span>
          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#EFF6FF] text-[#1E40AF] font-bold border border-[#BFDBFE]">
            TIN-MESH v2.8
          </span>
          <span className="text-[#94A3B8]">|</span>
          <span className="text-[#475569]">ACQUISITION: 2024-10-18 05:42:19 UTC</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Camera Modes */}
          <div className="flex items-center bg-white rounded border border-[#CBD5E1] p-0.5 text-[11px]">
            <button
              onClick={() => setCameraMode('orbit')}
              className={`px-2 py-0.5 rounded cursor-pointer transition-colors flex items-center gap-1 ${
                cameraMode === 'orbit' ? 'bg-[#1E40AF] text-white font-medium' : 'text-[#475569]'
              }`}
            >
              <Rotate3d className="w-3 h-3" />
              <span>Orbit</span>
            </button>
            <button
              onClick={() => setCameraMode('pan')}
              className={`px-2 py-0.5 rounded cursor-pointer transition-colors flex items-center gap-1 ${
                cameraMode === 'pan' ? 'bg-[#1E40AF] text-white font-medium' : 'text-[#475569]'
              }`}
            >
              <Move className="w-3 h-3" />
              <span>Pan</span>
            </button>
            <button
              onClick={() => onNavigate('flythrough')}
              className="px-2 py-0.5 rounded cursor-pointer text-[#475569] hover:text-[#0F172A] flex items-center gap-1"
            >
              <Plane className="w-3 h-3" />
              <span>Fly Path</span>
            </button>
            <button
              onClick={() => onOpenSlideDetails('SLICER_PROFILE')}
              className="px-2 py-0.5 rounded cursor-pointer text-[#475569] hover:text-[#0F172A] flex items-center gap-1"
            >
              <TrendingUp className="w-3 h-3" />
              <span>Profile</span>
            </button>
          </div>

          {/* Vertical Exaggeration */}
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#475569]">
            <span>VERT EXAG:</span>
            <select
              value={vertExag}
              onChange={(e) => setVertExag(Number(e.target.value))}
              className="bg-white border border-[#CBD5E1] rounded px-1.5 py-0.5 text-[#0F172A] font-bold"
            >
              <option value={1.0}>1.0x</option>
              <option value={1.35}>1.35x</option>
              <option value={1.75}>1.75x</option>
              <option value={2.25}>2.25x</option>
            </select>
          </div>

          {/* Azimuth Readout */}
          <div className="font-mono text-[11px] text-[#475569]">
            <span>AZIMUTH: </span>
            <strong className="text-[#0F172A]">{Math.round(azimuth)}° SSW</strong>
          </div>
        </div>
      </div>

      {/* Main Split Layout: 3D Stage on Left (8 cols) + Terrain Inspector on Right (4 cols) */}
      <div className="p-4 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: 3D Perspective Terrain Canvas */}
        <div className="lg:col-span-8 bg-[#0F172A] rounded border border-[#CBD5E1] flex flex-col overflow-hidden shadow-2xs relative min-h-[520px]">
          {/* Left floating 3D tool drawer */}
          <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 bg-white/95 backdrop-blur-xs p-1 rounded border border-[#CBD5E1] shadow-xs">
            <button
              className="p-1.5 rounded bg-[#1E40AF] text-white cursor-pointer"
              title="3D Mesh Active"
            >
              <Rotate3d className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onOpenSlideDetails('EXPORT_3D_MESH')}
              className="p-1.5 rounded text-[#475569] hover:bg-[#F1F5F9] cursor-pointer"
              title="Download Mesh (.GLTF)"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onOpenSlideDetails('CROP_ROI')}
              className="p-1.5 rounded text-[#475569] hover:bg-[#F1F5F9] cursor-pointer"
              title="Crop Region of Interest"
            >
              <Crop className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('flythrough')}
              className="p-1.5 rounded text-[#475569] hover:bg-[#F1F5F9] cursor-pointer"
              title="Launch Flythrough"
            >
              <Plane className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setAzimuth(218);
                setPitch(34);
                setVertExag(1.75);
              }}
              className="p-1.5 rounded text-[#475569] hover:bg-[#F1F5F9] cursor-pointer"
              title="Reset 3D Orientation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Top Floating Layer Switch Pill Box */}
          <div className="absolute top-3 left-14 z-20 flex flex-wrap items-center gap-2 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded border border-[#CBD5E1] shadow-xs font-mono text-[11px]">
            <span className="text-[#64748B] uppercase font-semibold text-[10px]">LAYERS:</span>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={layers.rgbOrtho}
                onChange={(e) => setLayers((l) => ({ ...l, rgbOrtho: e.target.checked }))}
                className="rounded text-[#1E40AF]"
              />
              <span>RGB Ortho</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={layers.depthHeatmap}
                onChange={(e) => setLayers((l) => ({ ...l, depthHeatmap: e.target.checked }))}
                className="rounded text-[#1E40AF]"
              />
              <span>Depth Heatmap</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={layers.metricDem}
                onChange={(e) => setLayers((l) => ({ ...l, metricDem: e.target.checked }))}
                className="rounded text-[#1E40AF]"
              />
              <span>Metric DEM</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={layers.slopeAspect}
                onChange={(e) => setLayers((l) => ({ ...l, slopeAspect: e.target.checked }))}
                className="rounded text-[#1E40AF]"
              />
              <span>Slope Aspect</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={layers.contours}
                onChange={(e) => setLayers((l) => ({ ...l, contours: e.target.checked }))}
                className="rounded text-[#1E40AF]"
              />
              <span>25m Contours</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={layers.tinMesh}
                onChange={(e) => setLayers((l) => ({ ...l, tinMesh: e.target.checked }))}
                className="rounded text-[#1E40AF]"
              />
              <span>TIN Mesh</span>
            </label>
          </div>

          {/* Interactive 3D Canvas */}
          <div
            className="flex-1 relative cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <canvas
              ref={canvasRef}
              width={900}
              height={550}
              className="w-full h-full object-cover block"
            />

            {/* Target Pin #PT-4091 Inspection Dialog Overlay */}
            {pinVisible && (
              <div
                id="target-pin-4091-card"
                onClick={() => onOpenSlideDetails('PIN_PT4091')}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-12 z-30 bg-white/95 backdrop-blur-md rounded border border-[#CBD5E1] p-3 shadow-xl max-w-sm cursor-pointer hover:border-[#1E40AF] transition-colors"
              >
                <div className="flex items-center justify-between pb-1.5 border-b border-[#E2E8F0] mb-2">
                  <span className="font-mono text-[11px] font-bold text-[#0F172A] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-pulse"></span>
                    TARGET PIN #PT-4091
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#DC2626] text-white font-bold tracking-wider uppercase">
                    BREACH CHOKEPOINT
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-[10px]">
                  <div>
                    <span className="text-[#64748B] block">LAT / LONG:</span>
                    <strong className="text-[#0F172A]">30°29'44.2"N 79°41'32.8"E</strong>
                  </div>
                  <div>
                    <span className="text-[#64748B] block">UTM GRID (44N):</span>
                    <strong className="text-[#0F172A]">374210 E / 3374510 N</strong>
                  </div>
                  <div>
                    <span className="text-[#64748B] block">METRIC ELEVATION:</span>
                    <strong className="text-[#1E40AF]">2,145.6 m MSL ±0.8m</strong>
                  </div>
                  <div>
                    <span className="text-[#64748B] block">RELATIVE DEPTH:</span>
                    <strong className="text-[#0D9488]">0.814 (Norm)</strong>
                  </div>
                  <div>
                    <span className="text-[#64748B] block">SLOPE GRADIENT:</span>
                    <strong className="text-[#B91C1C]">38.4° (High Risk)</strong>
                  </div>
                  <div>
                    <span className="text-[#64748B] block">ASPECT / DIP:</span>
                    <strong className="text-[#0F172A]">142° SE / 22° NW</strong>
                  </div>
                </div>

                <div className="mt-2 pt-1.5 border-t border-[#E2E8F0] flex items-center justify-between font-mono text-[9px] text-[#64748B]">
                  <span>Geo: Biotite Gneiss / Colluvial Moraine</span>
                  <span className="text-[#15803D] font-bold">DMS-VAL-OK</span>
                </div>
              </div>
            )}
          </div>

          {/* Viewport Bottom Floating Status Strip */}
          <div className="h-10 bg-white border-t border-[#CBD5E1] px-4 flex items-center justify-between font-mono text-[11px] text-[#475569] shrink-0">
            {/* Elevation Ramp */}
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-[#64748B]">ELEV (MSL)</span>
              <div className="w-28 h-2 rounded-xs bg-gradient-to-r from-[#0F172A] via-[#1E40AF] to-[#06B6D4]"></div>
              <span className="text-[10px] text-[#0F172A]">1,420m – 3,890m</span>
              <span className="text-[10px] text-[#64748B]">RAMP: ISRO-Hypsometric</span>
            </div>

            {/* Scale & Camera POI */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-[10px]">
                <span>0</span>
                <span className="w-10 h-0.5 bg-[#0F172A] inline-block mx-1"></span>
                <span>500m</span>
              </div>
              <div className="text-[10px]">
                <span className="text-[#64748B]">CAMERA POI (NADIR): </span>
                <span className="text-[#0F172A] font-semibold">
                  30°29'48"N 79°41'28"E / Elev: 2,340m
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Terrain Inspector (SLICER #04) */}
        <div className="lg:col-span-4 bg-white rounded border border-[#CBD5E1] flex flex-col overflow-hidden shadow-2xs">
          <div className="p-3 border-b border-[#CBD5E1] bg-[#F8FAFC] flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-[13px] text-[#0F172A]">
              <TrendingUp className="w-4 h-4 text-[#1E40AF]" />
              <span>Terrain Inspector</span>
            </div>
            <span
              onClick={() => onOpenSlideDetails('SLICER_STATUS')}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F1F5F9] text-[#334155] border border-[#CBD5E1] font-semibold cursor-pointer hover:bg-[#E2E8F0]"
            >
              SLICER #04
            </span>
          </div>

          <div className="p-4 space-y-4 flex-1 overflow-y-auto text-[12px]">
            {/* Transect Profile [T-A -> T-B] */}
            <div
              onClick={() => onOpenSlideDetails('TRANSECT_PROFILE_SECTION')}
              className="border border-[#CBD5E1] rounded p-3 bg-[#FAFBFD] cursor-pointer hover:bg-[#F1F5F9] transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 font-bold text-[12px] text-[#0F172A]">
                  <TrendingUp className="w-3.5 h-3.5 text-[#1E40AF]" />
                  <span>Transect Profile [T-A → T-B]</span>
                </div>
                <span className="font-mono text-[11px] text-[#64748B]">Length: 640m</span>
              </div>

              {/* Profile Chart SVG */}
              <div className="h-24 w-full bg-white rounded border border-[#E2E8F0] p-1 flex items-center justify-center">
                <svg viewBox="0 0 300 80" className="w-full h-full overflow-visible">
                  {/* Grid Lines */}
                  <line x1="10" y1="20" x2="290" y2="20" stroke="#E2E8F0" strokeDasharray="3 3" />
                  <line x1="10" y1="50" x2="290" y2="50" stroke="#E2E8F0" strokeDasharray="3 3" />

                  {/* Valley Gorge Profile */}
                  <path
                    d="M 10 20 Q 80 45 140 68 T 160 68 Q 220 45 290 20"
                    fill="none"
                    stroke="#1E40AF"
                    strokeWidth="2.5"
                  />
                  {/* Debris blockage */}
                  <polygon
                    points="125,65 150,52 175,65"
                    fill="#F59E0B"
                    stroke="#D97706"
                    strokeWidth="1.5"
                  />
                  {/* Choke marker point */}
                  <circle cx="150" cy="52" r="3.5" fill="#DC2626" />
                </svg>
              </div>

              <div className="flex justify-between font-mono text-[10px] text-[#64748B] mt-1.5">
                <span>West Wall (39.2°)</span>
                <span className="text-[#DC2626] font-bold">
                  Debris Depth: 24.6m
                </span>
                <span>East Wall (37.1°)</span>
              </div>
            </div>

            {/* Volumetric Assessment Card */}
            <div
              onClick={() => onOpenSlideDetails('VOLUMETRIC_ASSESSMENT')}
              className="border border-[#CBD5E1] rounded p-3 bg-white cursor-pointer hover:bg-[#FAFBFD] transition-colors"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0] mb-2">
                <div className="font-bold text-[12px] text-[#0F172A]">
                  Volumetric Assessment
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#EFF6FF] text-[#1E40AF] font-bold">
                  ISRO-DMS V4
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono text-[11px] mb-3">
                <div>
                  <span className="text-[#64748B] block text-[10px]">DEBRIS VOLUME</span>
                  <div className="font-bold text-[16px] text-[#0F172A]">1.42 M m³</div>
                  <span className="text-[#DC2626] text-[10px] font-semibold">
                    +8.2% vs baseline
                  </span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[10px]">SIM. PEAK FLOW</span>
                  <div className="font-bold text-[16px] text-[#0F172A]">3,200 m³/s</div>
                  <span className="text-[#15803D] text-[10px] font-semibold">
                    High Velocity
                  </span>
                </div>
              </div>

              {/* Impounded Backwater Progress Gauge */}
              <div className="space-y-1">
                <div className="flex justify-between font-mono text-[10px]">
                  <span className="text-[#64748B]">IMPOUNDED BACKWATER VOLUME</span>
                  <strong className="text-[#B91C1C]">3.85 / 5.20 M m³ (74%)</strong>
                </div>
                <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#F59E0B] to-[#DC2626] rounded-full"
                    style={{ width: '74%' }}
                  ></div>
                </div>
                <div className="flex justify-between font-mono text-[9px] text-[#64748B] pt-0.5">
                  <span>Seepage Rate: 42 m³/s</span>
                  <span className="text-[#DC2626] font-bold">Threshold: 4.5M m³</span>
                </div>
              </div>
            </div>

            {/* Sensor Calibration Tuning */}
            <div
              onClick={() => onOpenSlideDetails('SENSOR_CALIBRATION_TUNING')}
              className="border border-[#CBD5E1] rounded p-3 bg-[#F8FAFC] font-mono text-[11px] space-y-1.5 cursor-pointer hover:bg-[#F1F5F9]"
            >
              <div className="text-[10px] text-[#64748B] uppercase font-bold mb-1">
                SENSOR CALIBRATION TUNING
              </div>
              <div className="flex justify-between">
                <span className="text-[#475569]">Shadow-to-Height Derivation:</span>
                <strong className="text-[#0F172A]">SOLAR_ELEV 42.6°</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#475569]">Stereo Disparity Weight:</span>
                <strong className="text-[#0F172A]">0.865 [RMSE 0.42]</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#475569]">Reference Geoid Datum:</span>
                <strong className="text-[#1E40AF]">EGM96 / WGS84</strong>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-2 pt-1 font-sans">
              <button
                id="explore-initiate-flythrough-btn"
                onClick={() => onNavigate('flythrough')}
                className="w-full py-2 px-3 rounded bg-[#1E40AF] text-white hover:bg-[#1D4ED8] transition-colors flex items-center justify-center gap-2 font-medium text-[12px] shadow-xs cursor-pointer"
              >
                <Plane className="w-3.5 h-3.5" />
                <span>Initiate Flythrough Simulation</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onOpenSlideDetails('EXPORT_GLTF_MESH')}
                  className="py-1.5 px-2 rounded bg-white text-[#0F172A] border border-[#CBD5E1] hover:bg-[#F8FAFC] transition-colors flex items-center justify-center gap-1.5 font-medium text-[11px] cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#475569]" />
                  <span>Mesh (.GLTF)</span>
                </button>

                <button
                  onClick={() => onOpenSlideDetails('PDF_HAZARD_BRIEF')}
                  className="py-1.5 px-2 rounded bg-white text-[#0F172A] border border-[#CBD5E1] hover:bg-[#F8FAFC] transition-colors flex items-center justify-center gap-1.5 font-medium text-[11px] cursor-pointer"
                >
                  <FileDown className="w-3.5 h-3.5 text-[#DC2626]" />
                  <span>PDF Hazard Brief</span>
                </button>
              </div>

              <div className="text-center font-mono text-[9px] text-[#94A3B8] pt-1">
                ISRO Space Applications Centre | DMS v3.4.1
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
