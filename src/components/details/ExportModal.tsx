import React, { useState } from 'react';
import {
  Download,
  FileCheck,
  Layers,
  Database,
  CheckCircle2,
  FileText,
  X,
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  missionId?: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  missionId = 'DMS-2024-CHM',
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'geotiff' | 'las' | 'gltf' | 'pdf'>('geotiff');
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportComplete(true);
      setTimeout(() => {
        setExportComplete(false);
        onClose();
      }, 1200);
    }, 800);
  };

  const formats = [
    {
      id: 'geotiff',
      name: 'GeoTIFF Calibrated DEM (32-bit Float)',
      ext: '.TIF',
      size: '184 MB',
      desc: 'High-precision raster digital elevation model aligned to EGM2008 geoid with embedded GeoKey tags for QGIS and ArcGIS.',
    },
    {
      id: 'las',
      name: 'LiDAR / Dense Point Cloud (LAS v1.4)',
      ext: '.LAS',
      size: '342 MB',
      desc: 'Point cloud format with classified ground vertices, intensity, and RGB color attributes for hydraulic simulation.',
    },
    {
      id: 'gltf',
      name: '3D Mesh Surface & UV Texture (GLTF/GLB)',
      ext: '.GLTF',
      size: '68 MB',
      desc: 'Watertight polygon mesh (142k faces) formatted for interactive 3D viewers, Blender, Unreal Engine, and WebGL.',
    },
    {
      id: 'pdf',
      name: 'ISRO Disaster Assessment Mission Dossier',
      ext: '.PDF',
      size: '14 MB',
      desc: 'Formal PDF briefing report including hypsometric curve, slope risk maps, transect cross-sections, and breach volume calculation.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-lg shadow-2xl border border-[#CBD5E1] w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#FAFBFD] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-[#1E40AF] font-bold">
              MISSION EXPORT // {missionId}
            </span>
            <h3 className="text-[16px] font-bold text-[#0F172A]">
              Export Terrain & Geospatial Artifacts
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-3 font-sans">
          <p className="text-[12px] text-[#475569]">
            Select the preferred GIS distribution package for downstream flood propagation modeling or field operations.
          </p>

          <div className="space-y-2">
            {formats.map((fmt) => (
              <label
                key={fmt.id}
                onClick={() => setSelectedFormat(fmt.id as any)}
                className={`p-3 rounded border flex items-start gap-3 cursor-pointer transition-colors ${
                  selectedFormat === fmt.id
                    ? 'border-[#1E40AF] bg-[#EFF6FF]'
                    : 'border-[#CBD5E1] hover:bg-[#F8FAFC]'
                }`}
              >
                <input
                  type="radio"
                  name="exportFormat"
                  checked={selectedFormat === fmt.id}
                  onChange={() => setSelectedFormat(fmt.id as any)}
                  className="mt-1 text-[#1E40AF]"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[13px] text-[#0F172A]">
                      {fmt.name}
                    </span>
                    <span className="font-mono text-[10px] font-semibold text-[#64748B]">
                      {fmt.size}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-0.5 leading-relaxed">
                    {fmt.desc}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
          <span className="text-[11px] font-mono text-[#64748B]">
            CRS: EPSG:32644 (UTM 44N)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded border border-[#CBD5E1] text-[12px] font-medium text-[#475569] hover:bg-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleDownload}
              disabled={isExporting || exportComplete}
              className="px-4 py-1.5 rounded bg-[#1E40AF] text-[12px] font-semibold text-white hover:bg-[#1D4ED8] flex items-center gap-1.5 cursor-pointer disabled:opacity-75"
            >
              {exportComplete ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Package Ready!</span>
                </>
              ) : isExporting ? (
                <span>Generating Artifact...</span>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Package</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
