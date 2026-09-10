import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Video,
  Camera,
  FileCode2,
  Gamepad2,
  Plane,
  Compass,
  Crosshair,
  AlertTriangle,
  Radio,
  Sliders,
} from 'lucide-react';
import { FLIGHT_WAYPOINTS } from '../../data/mockData';
import { NavModule, Waypoint } from '../../types';

interface FlythroughScreenProps {
  onNavigate: (module: NavModule) => void;
  onOpenSlideDetails: (sourceKey?: string) => void;
}

export const FlythroughScreen: React.FC<FlythroughScreenProps> = ({
  onNavigate,
  onOpenSlideDetails,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1.0);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(38);
  const [totalSeconds] = useState<number>(105);
  const [activeWaypoint, setActiveWaypoint] = useState<string>('wp-3');
  const [cameraMode, setCameraMode] = useState<'follow' | 'fpv' | 'free' | 'orbit'>('follow');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Playback timer loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => {
        if (prev >= totalSeconds) {
          return 0;
        }
        return prev + 1;
      });
    }, 1000 / speed);

    return () => clearInterval(interval);
  }, [isPlaying, speed, totalSeconds]);

  // Canvas 3D Aerial Flight Simulation Renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let flightTick = elapsedSeconds * 25;

    const render = () => {
      flightTick += 0.8 * speed;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Deep Alpine Atmosphere & Mountain Shadows
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#090D16');
      grad.addColorStop(0.3, '#141E33');
      grad.addColorStop(0.65, '#202E46');
      grad.addColorStop(1, '#2D3D55');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Distant Snow-Capped Himalayan Peak Silhouettes
      const drawPeaks = (baseY: number, roughness: number, color: string) => {
        ctx.beginPath();
        ctx.moveTo(0, h);
        ctx.lineTo(0, baseY);
        for (let x = 0; x <= w; x += 40) {
          const peakY = baseY - Math.sin((x + flightTick * 0.1) * 0.005 + roughness) * 70 - Math.cos(x * 0.012) * 35;
          ctx.lineTo(x, peakY);
        }
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
      };

      drawPeaks(h * 0.28, 1.0, '#384860');
      drawPeaks(h * 0.42, 2.5, '#273449');
      drawPeaks(h * 0.58, 4.2, '#1E2838');

      // V-Notch Canyon Flanks (left and right walls)
      // Left Wall
      ctx.beginPath();
      ctx.moveTo(0, h * 0.35);
      ctx.lineTo(w * 0.38, h * 0.72);
      ctx.lineTo(w * 0.3, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fillStyle = '#1A2332';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.stroke();

      // Right Wall
      ctx.beginPath();
      ctx.moveTo(w, h * 0.38);
      ctx.lineTo(w * 0.62, h * 0.75);
      ctx.lineTo(w * 0.7, h);
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fillStyle = '#17202E';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.stroke();

      // Valley Floor River Drainage Path
      ctx.beginPath();
      ctx.moveTo(w * 0.45, h * 0.52);
      ctx.quadraticCurveTo(w * 0.52, h * 0.68, w * 0.56, h);
      ctx.strokeStyle = '#0284C7';
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.stroke();

      // 3D Flight Vector Spline Line (cyan dashed vector)
      ctx.beginPath();
      ctx.moveTo(w * 0.35, h * 0.88);
      ctx.lineTo(w * 0.48, h * 0.75);
      ctx.lineTo(w * 0.55, h * 0.62);
      ctx.lineTo(w * 0.65, h * 0.45);
      ctx.lineTo(w * 0.75, h * 0.35);
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([8, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Waypoint 2: Valley Bend
      ctx.beginPath();
      ctx.arc(w * 0.45, h * 0.76, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#38BDF8';
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#94A3B8';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.fillText('WP-02: Valley Bend', w * 0.46, h * 0.78);

      // Waypoint 3: Active Debris Toe Hazard (Center target)
      const wp3X = w * 0.55;
      const wp3Y = h * 0.62;

      // Hazard Damming Area Polygon
      ctx.beginPath();
      ctx.moveTo(wp3X - 35, wp3Y + 15);
      ctx.lineTo(wp3X + 75, wp3Y - 5);
      ctx.lineTo(wp3X + 65, wp3Y + 45);
      ctx.lineTo(wp3X - 25, wp3Y + 50);
      ctx.closePath();
      ctx.fillStyle = 'rgba(220, 38, 38, 0.28)';
      ctx.fill();
      ctx.strokeStyle = '#DC2626';
      ctx.lineWidth = 1.8;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#FCA5A5';
      ctx.font = '9px JetBrains Mono, monospace';
      ctx.fillText('HAZARD: IMPOUNDMENT 1.4M m³', wp3X - 20, wp3Y + 42);

      // Active WP-3 Beacon
      ctx.beginPath();
      ctx.arc(wp3X, wp3Y, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#1E40AF';
      ctx.fill();
      ctx.strokeStyle = '#60A5FA';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Beacon Ping Animation
      const pingR = 10 + (flightTick % 25);
      ctx.beginPath();
      ctx.arc(wp3X, wp3Y, pingR, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(96, 165, 250, ${1 - pingR / 35})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Waypoint 4 & 5
      ctx.beginPath();
      ctx.arc(w * 0.65, h * 0.45, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#64748B';
      ctx.fill();
      ctx.fillText('WP-04: Crest Rim', w * 0.66, h * 0.45);

      ctx.beginPath();
      ctx.arc(w * 0.75, h * 0.35, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#64748B';
      ctx.fill();
      ctx.fillText('WP-05: Outflow', w * 0.76, h * 0.35);

      // Center HUD Flight Reticle / Crosshair [  +  ]
      const rX = w * 0.52;
      const rY = h * 0.52;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 1.2;

      // Reticle Box
      ctx.strokeRect(rX - 18, rY - 18, 36, 36);

      // Center Dot
      ctx.beginPath();
      ctx.arc(rX, rY, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#38BDF8';
      ctx.fill();

      // Crosshair ticks
      ctx.beginPath();
      ctx.moveTo(rX - 30, rY);
      ctx.lineTo(rX - 22, rY);
      ctx.moveTo(rX + 22, rY);
      ctx.lineTo(rX + 30, rY);
      ctx.moveTo(rX, rY - 30);
      ctx.lineTo(rX, rY - 22);
      ctx.moveTo(rX, rY + 22);
      ctx.lineTo(rX, rY + 30);
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [speed, elapsedSeconds]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div id="flythrough-screen" className="flex-1 flex flex-col overflow-y-auto bg-[#0F172A] text-white">
      {/* Top Telemetry HUD Overlay Bar */}
      <div className="bg-[#0F172A]/90 backdrop-blur-md border-b border-[#334155] px-4 py-2 flex flex-wrap items-center justify-between font-mono text-[11px] shrink-0 gap-3 select-none">
        {/* Run Title & Status */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => onOpenSlideDetails('FLYTHROUGH_SURVEY_RUN')}
            className="flex items-center gap-2 px-2 py-0.5 rounded bg-[#1E293B] border border-[#475569] cursor-pointer hover:bg-[#334155]"
          >
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
            <span className="font-bold text-[#E2E8F0]">SURVEY RUN #04</span>
            <span className="text-[#94A3B8]">|</span>
            <span className="text-[#94A3B8]">UAV-SYNTH VECT-4</span>
          </div>

          <div className="flex items-center gap-4 text-[#94A3B8] border-l border-[#334155] pl-3">
            <span>
              SPD: <strong className="text-[#38BDF8]">120</strong> km/h
            </span>
            <span>
              ALT: <strong className="text-[#38BDF8]">2,680</strong> m MSL
            </span>
            <span>
              AGL: <strong className="text-[#10B981]">240</strong> m
            </span>
          </div>
        </div>

        {/* Center Compass Ribbon Tape */}
        <div
          onClick={() => onOpenSlideDetails('COMPASS_HEADING')}
          className="flex items-center gap-4 bg-[#1E293B] px-4 py-1 rounded border border-[#334155] cursor-pointer hover:border-[#60A5FA]"
        >
          <span className="text-[#64748B]">010</span>
          <span className="text-[#64748B]">020</span>
          <span className="text-[#10B981] font-bold text-[12px] flex items-center gap-1">
            <span>034° NE</span>
            <span className="w-1.5 h-1.5 bg-[#10B981] rounded-xs"></span>
          </span>
          <span className="text-[#64748B]">050</span>
          <span className="text-[#64748B]">060</span>
        </div>

        {/* Flight Attitude: Pitch, Roll, FOV */}
        <div className="flex items-center gap-4 text-[#94A3B8]">
          <span>
            PITCH: <strong className="text-[#F59E0B]">-18.5°</strong>
          </span>
          <span>
            ROLL: <strong className="text-[#38BDF8]">+2.1°</strong>
          </span>
          <span>
            FOV: <strong className="text-white">68.4°</strong>
          </span>
        </div>
      </div>

      {/* Main Viewport Stage with 3D Canvas + Live HUD Cards */}
      <div className="flex-1 relative overflow-hidden min-h-[440px] flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={1100}
          height={600}
          className="w-full h-full object-cover block"
        />

        {/* Left Side Elevation Color Scale (1,400m - 3,400m) */}
        <div
          onClick={() => onOpenSlideDetails('FLYTHROUGH_ELEVATION_SCALE')}
          className="absolute left-4 top-12 z-20 bg-[#0F172A]/85 backdrop-blur-md p-2 rounded border border-[#334155] font-mono text-[10px] text-[#94A3B8] flex flex-col items-center gap-1 cursor-pointer hover:border-[#60A5FA]"
        >
          <span className="text-[9px] font-bold text-white uppercase">MSL (m)</span>
          <div className="flex items-center gap-2 my-1">
            <div className="flex flex-col justify-between text-[8px] h-36 text-right">
              <span>3400</span>
              <span>2800</span>
              <span className="text-[#38BDF8] font-bold">2180</span>
              <span>1800</span>
              <span>1400</span>
            </div>
            <div className="w-2.5 h-36 rounded-xs bg-gradient-to-b from-[#10B981] via-[#06B6D4] to-[#1E3A8A] relative">
              {/* Current indicator marker needle */}
              <div className="absolute top-[48%] -left-1 -right-1 h-1 bg-white border border-black shadow-xs"></div>
            </div>
          </div>
          <span className="text-[8px] text-[#64748B]">RAMP-DEM</span>
        </div>

        {/* Center Waypoint Tag Marker Overlay for WP-03 */}
        <div
          onClick={() => onOpenSlideDetails('WAYPOINT_03_DEBRIS_TOE')}
          className="absolute top-[52%] left-[48%] -translate-x-1/2 z-20 bg-[#0F172A]/90 backdrop-blur-md border border-[#38BDF8] p-2 rounded text-center font-mono cursor-pointer hover:bg-[#1E293B]"
        >
          <div className="text-[9px] text-[#94A3B8] mb-0.5">DEBRIS TOE 2,180m</div>
          <div className="text-[12px] font-bold text-white flex items-center justify-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-ping"></span>
            <span>• WP-03: DEBRIS TOE</span>
          </div>
          <div className="text-[10px] text-[#38BDF8] mt-0.5">
            Target Dist: 480m | Elev: 2,180m
          </div>
        </div>

        {/* Right HUD Card: Flight Telemetry (Rec Active) */}
        <div
          onClick={() => onOpenSlideDetails('LIVE_FLIGHT_TELEMETRY')}
          className="absolute top-4 right-4 z-20 w-80 bg-[#0F172A]/90 backdrop-blur-md rounded border border-[#334155] p-3 font-mono text-[11px] shadow-2xl cursor-pointer hover:border-[#60A5FA] transition-colors"
        >
          <div className="flex items-center justify-between pb-2 border-b border-[#334155] mb-2">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <Plane className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>FLIGHT TELEMETRY</span>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#064E3B] text-[#34D399] font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
              REC ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-2 gap-y-2 gap-x-2 text-[10px]">
            <div>
              <span className="text-[#64748B] block">LATITUDE</span>
              <strong className="text-white text-[11px]">30°29'38.4"N</strong>
            </div>
            <div>
              <span className="text-[#64748B] block">LONGITUDE</span>
              <strong className="text-white text-[11px]">79°41'28.1"E</strong>
            </div>
            <div>
              <span className="text-[#64748B] block">HEADING / AZIMUTH</span>
              <strong className="text-white text-[11px]">034° True NE</strong>
            </div>
            <div>
              <span className="text-[#64748B] block">CAMERA PITCH</span>
              <strong className="text-[#F59E0B] text-[11px]">-18.5° Depression</strong>
            </div>
            <div>
              <span className="text-[#64748B] block">SURFACE ELEV</span>
              <strong className="text-[#38BDF8] text-[11px]">2,180 m MSL</strong>
            </div>
            <div>
              <span className="text-[#64748B] block">HAZARD DISTANCE</span>
              <strong className="text-[#EF4444] text-[11px]">480 m (Breach)</strong>
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-[#334155] flex justify-between text-[10px]">
            <span className="text-[#64748B]">Optical GSD at Target:</span>
            <span className="text-[#10B981] font-bold">0.50 m/px</span>
          </div>
        </div>
      </div>

      {/* Waypoints Sequence Strip & Camera Mode Bar */}
      <div className="bg-[#141E33] border-t border-[#334155] px-4 py-2 flex flex-wrap items-center justify-between font-mono text-[11px] shrink-0 gap-3 select-none">
        {/* Waypoints sequence */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider shrink-0">
            FLIGHT WAYPOINTS:
          </span>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setActiveWaypoint('wp-1')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                activeWaypoint === 'wp-1'
                  ? 'bg-[#1E40AF] text-white border border-[#3B82F6]'
                  : 'bg-[#1E293B] text-[#94A3B8] hover:bg-[#334155]'
              }`}
            >
              ✓ WP-1: Inflow Portal
            </button>
            <span className="text-[#475569]">→</span>

            <button
              onClick={() => setActiveWaypoint('wp-2')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                activeWaypoint === 'wp-2'
                  ? 'bg-[#1E40AF] text-white border border-[#3B82F6]'
                  : 'bg-[#1E293B] text-[#94A3B8] hover:bg-[#334155]'
              }`}
            >
              ✓ WP-2: Valley Bend
            </button>
            <span className="text-[#475569]">→</span>

            <button
              onClick={() => setActiveWaypoint('wp-3')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                activeWaypoint === 'wp-3'
                  ? 'bg-[#1E40AF] text-white border border-[#60A5FA] font-bold'
                  : 'bg-[#1E293B] text-[#94A3B8] hover:bg-[#334155]'
              }`}
            >
              • WP-3: Debris Toe (Active)
            </button>
            <span className="text-[#475569]">→</span>

            <button
              onClick={() => setActiveWaypoint('wp-4')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                activeWaypoint === 'wp-4'
                  ? 'bg-[#1E40AF] text-white border border-[#3B82F6]'
                  : 'bg-[#1E293B] text-[#94A3B8] hover:bg-[#334155]'
              }`}
            >
              0 WP-4: Crest Rim
            </button>
            <span className="text-[#475569]">→</span>

            <button
              onClick={() => setActiveWaypoint('wp-5')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                activeWaypoint === 'wp-5'
                  ? 'bg-[#1E40AF] text-white border border-[#3B82F6]'
                  : 'bg-[#1E293B] text-[#94A3B8] hover:bg-[#334155]'
              }`}
            >
              0 WP-5: Downstream Outflow
            </button>
          </div>
        </div>

        {/* Camera Modes */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] text-[#64748B] uppercase">Camera Mode:</span>
          <div className="flex items-center bg-[#1E293B] p-0.5 rounded border border-[#334155]">
            <button
              onClick={() => setCameraMode('follow')}
              className={`px-2 py-0.5 rounded text-[10px] cursor-pointer transition-colors ${
                cameraMode === 'follow' ? 'bg-[#1E40AF] text-white font-semibold' : 'text-[#94A3B8]'
              }`}
            >
              Drone Follow
            </button>
            <button
              onClick={() => setCameraMode('fpv')}
              className={`px-2 py-0.5 rounded text-[10px] cursor-pointer transition-colors ${
                cameraMode === 'fpv' ? 'bg-[#1E40AF] text-white font-semibold' : 'text-[#94A3B8]'
              }`}
            >
              Cockpit FPV
            </button>
            <button
              onClick={() => setCameraMode('free')}
              className={`px-2 py-0.5 rounded text-[10px] cursor-pointer transition-colors ${
                cameraMode === 'free' ? 'bg-[#1E40AF] text-white font-semibold' : 'text-[#94A3B8]'
              }`}
            >
              Free Orbit
            </button>
            <button
              onClick={() => setCameraMode('orbit')}
              className={`px-2 py-0.5 rounded text-[10px] cursor-pointer transition-colors ${
                cameraMode === 'orbit' ? 'bg-[#1E40AF] text-white font-semibold' : 'text-[#94A3B8]'
              }`}
            >
              Orbital Circle
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Transport Player & Mission Export Bar */}
      <div className="bg-[#0F172A] border-t border-[#334155] px-4 py-2.5 flex flex-wrap items-center justify-between font-mono text-[12px] shrink-0 gap-3 select-none">
        {/* Transport Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setElapsedSeconds(0)}
            className="p-1.5 rounded bg-[#1E293B] hover:bg-[#334155] text-[#94A3B8] hover:text-white cursor-pointer"
            title="Restart Flight"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setElapsedSeconds((s) => Math.max(0, s - 5))}
            className="p-1.5 rounded bg-[#1E293B] hover:bg-[#334155] text-[#94A3B8] hover:text-white cursor-pointer"
            title="Step Back (-5s)"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>
          <button
            id="flythrough-play-toggle-btn"
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1.5 rounded bg-[#1E40AF] hover:bg-[#1D4ED8] text-white cursor-pointer flex items-center gap-1 font-bold shadow-xs"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>
          <button
            onClick={() => setElapsedSeconds((s) => Math.min(totalSeconds, s + 5))}
            className="p-1.5 rounded bg-[#1E293B] hover:bg-[#334155] text-[#94A3B8] hover:text-white cursor-pointer"
            title="Step Forward (+5s)"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          {/* Timecode */}
          <span className="font-mono text-[13px] font-bold text-white px-2">
            {formatTime(elapsedSeconds)} <span className="text-[#64748B]">/</span> {formatTime(totalSeconds)}
          </span>

          {/* Playback Speeds */}
          <div className="flex items-center bg-[#1E293B] p-0.5 rounded border border-[#334155] text-[10px]">
            <span className="text-[#64748B] px-1.5">SPD:</span>
            <button
              onClick={() => setSpeed(0.5)}
              className={`px-1.5 py-0.5 rounded cursor-pointer ${speed === 0.5 ? 'bg-[#1E40AF] text-white' : 'text-[#94A3B8]'}`}
            >
              0.5x
            </button>
            <button
              onClick={() => setSpeed(1.0)}
              className={`px-1.5 py-0.5 rounded cursor-pointer ${speed === 1.0 ? 'bg-[#1E40AF] text-white' : 'text-[#94A3B8]'}`}
            >
              1.0x
            </button>
            <button
              onClick={() => setSpeed(2.0)}
              className={`px-1.5 py-0.5 rounded cursor-pointer ${speed === 2.0 ? 'bg-[#1E40AF] text-white' : 'text-[#94A3B8]'}`}
            >
              2.0x
            </button>
            <button
              onClick={() => setSpeed(4.0)}
              className={`px-1.5 py-0.5 rounded cursor-pointer ${speed === 4.0 ? 'bg-[#1E40AF] text-white' : 'text-[#94A3B8]'}`}
            >
              MAX
            </button>
          </div>
        </div>

        {/* Action / Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenSlideDetails('RECORD_PRORES')}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-[11px] font-medium text-[#E2E8F0] cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-[#EF4444]"></span>
            <span>Rec Video (ProRes)</span>
          </button>

          <button
            onClick={() => onOpenSlideDetails('CAPTURE_GEOTIFF')}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-[11px] font-medium text-[#E2E8F0] cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Capture GeoTIFF</span>
          </button>

          <button
            onClick={() => onOpenSlideDetails('EXPORT_KML')}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-[11px] font-medium text-[#E2E8F0] cursor-pointer"
          >
            <FileCode2 className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Export .KML</span>
          </button>

          <button
            onClick={() => onOpenSlideDetails('MANUAL_CONTROL')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#0D9488] hover:bg-[#0F766E] text-white text-[11px] font-semibold cursor-pointer shadow-xs"
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Take Manual Control</span>
          </button>
        </div>
      </div>
    </div>
  );
};
