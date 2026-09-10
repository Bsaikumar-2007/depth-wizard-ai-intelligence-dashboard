import React, { useState } from 'react';
import { Settings, Sliders, Database, Cpu, Shield, Save, Check } from 'lucide-react';
import { NavModule } from '../../types';

interface SettingsScreenProps {
  onNavigate: (module: NavModule) => void;
  onOpenSlideDetails: (sourceKey?: string) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onNavigate,
  onOpenSlideDetails,
}) => {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div id="settings-screen" className="flex-1 flex flex-col overflow-y-auto bg-[#F5F7FA]">
      <div className="bg-white border-b border-[#CBD5E1] p-4 shrink-0 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[20px] font-bold text-[#0F172A] tracking-tight">
              Workstation Configuration & ISRO Geoportal Bindings
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F1F5F9] text-[#475569] font-bold">
              BUILD v3.4.1-STABLE
            </span>
          </div>
          <p className="text-[13px] text-[#475569] mt-0.5">
            Sensor ephemeris models, RPC photogrammetry solvers, and hardware acceleration settings.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[12px] font-medium bg-[#1E40AF] text-white rounded hover:bg-[#1D4ED8] cursor-pointer shadow-xs"
        >
          {saved ? <Check className="w-3.5 h-3.5 text-white" /> : <Save className="w-3.5 h-3.5" />}
          <span>{saved ? 'Settings Saved' : 'Save Configuration'}</span>
        </button>
      </div>

      <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
        {/* Photogrammetry Calibration */}
        <div className="bg-white rounded border border-[#CBD5E1] p-4 shadow-2xs space-y-3 font-mono text-[12px]">
          <div className="font-bold text-[13px] text-[#0F172A] font-sans flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#1E40AF]" />
            <span>Photogrammetry & Vertical Datum</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] text-[#475569] block mb-1">
                DEFAULT GEOID MODEL
              </label>
              <select className="w-full h-8 px-2 bg-white border border-[#CBD5E1] rounded text-[12px]">
                <option>EGM2008 (Global Earth Gravitational Model)</option>
                <option>EGM96 (Legacy Space Applications Centre)</option>
                <option>WGS-84 Ellipsoidal Heights</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-[#475569] block mb-1">
                RPC ERROR TOLERANCE (METERS)
              </label>
              <input
                type="text"
                defaultValue="0.35"
                className="w-full h-8 px-2 bg-white border border-[#CBD5E1] rounded text-[12px]"
              />
            </div>

            <div>
              <label className="text-[11px] text-[#475569] block mb-1">
                DEFAULT HYPSOMETRIC COLOR RAMP
              </label>
              <select className="w-full h-8 px-2 bg-white border border-[#CBD5E1] rounded text-[12px]">
                <option>ISRO-DMS Hypsometric Standard (1,400m - 4,000m)</option>
                <option>USGS Terrain Elevation Palette</option>
                <option>Turbo / Jet High-Contrast Scientific</option>
                <option>Hydrological Inundation Heatmap</option>
              </select>
            </div>
          </div>
        </div>

        {/* Compute & Network Bindings */}
        <div className="bg-white rounded border border-[#CBD5E1] p-4 shadow-2xs space-y-3 font-mono text-[12px]">
          <div className="font-bold text-[13px] text-[#0F172A] font-sans flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#0D9488]" />
            <span>Hardware Acceleration & Geoportal</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] text-[#475569] block mb-1">
                GPU INFERENCE ACCELERATOR
              </label>
              <input
                type="text"
                readOnly
                value="NVIDIA A100-SXM4-80GB (CUDA 12.4, TensorRT 10.1)"
                className="w-full h-8 px-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded text-[12px] text-[#0F172A]"
              />
            </div>

            <div>
              <label className="text-[11px] text-[#475569] block mb-1">
                BHUVAN DMS WMS SERVICE ENDPOINT
              </label>
              <input
                type="text"
                defaultValue="https://bhuvan-dms.nrsc.gov.in/geoserver/wms"
                className="w-full h-8 px-2 bg-white border border-[#CBD5E1] rounded text-[12px]"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer font-sans text-[12px] text-[#334155]">
                <input type="checkbox" defaultChecked className="rounded text-[#1E40AF]" />
                <span>Auto-push Volumetric Alerts to National Disaster Response Force (NDRF)</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
