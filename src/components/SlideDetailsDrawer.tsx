import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Key,
  Database,
  Satellite,
  AlertTriangle,
  Layers,
  ChevronRight,
  Copy,
  Check,
  Download,
  Terminal,
} from 'lucide-react';
import { SlideDetailContent } from '../types';

interface SlideDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  details: SlideDetailContent;
  lastKeyPressed?: string;
}

export const SlideDetailsDrawer: React.FC<SlideDetailsDrawerProps> = ({
  isOpen,
  onClose,
  details,
  lastKeyPressed,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'metrics' | 'telemetry' | 'raw'>('metrics');

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(details, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(details, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `isro-dms-inspection-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
          {/* Backdrop with fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-[1px] pointer-events-auto"
          />

          {/* Slide-in details panel */}
          <motion.aside
            id="slide-details-drawer"
            initial={{ x: '100%', opacity: 0.85 }}
            animate={{ x: '0%', opacity: 1 }}
            exit={{ x: '100%', opacity: 0.85 }}
            transition={{ type: 'spring', damping: 26, stiffness: 240, mass: 0.85 }}
            className="relative w-full max-w-lg bg-white h-full shadow-2xl border-l border-[#CBD5E1] flex flex-col pointer-events-auto z-10 select-none overflow-hidden"
          >
            {/* Live Keypress Notification Banner */}
            <div className="bg-[#1E40AF] text-white px-4 py-1.5 flex items-center justify-between text-[11px] font-mono shrink-0 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-300 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                <span className="font-semibold tracking-wide">SLIDE ANIMATION ACTIVE</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-blue-100">
                <span>Triggered by:</span>
                <span className="bg-white/20 px-1.5 py-0.2 rounded text-white font-bold uppercase">
                  {lastKeyPressed || 'Keystroke'}
                </span>
              </div>
            </div>

            {/* Drawer Header */}
            <div className="p-4 border-b border-[#CBD5E1] bg-[#F8FAFC] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#1E40AF]">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#1E40AF] text-white">
                      {details.category}
                    </span>
                    {lastKeyPressed && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A] flex items-center gap-1">
                        <Key className="w-2.5 h-2.5" />
                        Key: <strong className="font-bold uppercase">{lastKeyPressed}</strong>
                      </span>
                    )}
                  </div>
                  <h2 className="text-[14px] font-bold text-[#0F172A] mt-0.5 leading-tight">
                    {details.title}
                  </h2>
                </div>
              </div>

              <button
                id="close-slide-details-btn"
                onClick={onClose}
                className="p-1.5 rounded hover:bg-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer"
                title="Close Drawer [Esc]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Interactive key shortcut hints */}
            <div className="px-4 py-1.5 bg-[#EFF6FF] border-b border-[#DBEAFE] flex items-center justify-between text-[10px] font-mono text-[#1E40AF] shrink-0">
              <span>Press ANY key or click below to switch inspection:</span>
              <div className="flex items-center gap-1">
                {['D', 'F', 'T', 'E', 'M', 'Space'].map((k) => (
                  <span key={k} className="px-1 py-0.2 rounded bg-white text-[#1E40AF] border border-[#BFDBFE] font-bold">
                    {k}
                  </span>
                ))}
              </div>
            </div>

            {/* Sub-tab navigation */}
            <div className="flex border-b border-[#E2E8F0] bg-white px-4 shrink-0 font-mono text-[11px]">
              <button
                onClick={() => setActiveTab('metrics')}
                className={`py-2 px-3 border-b-2 font-medium cursor-pointer transition-colors ${
                  activeTab === 'metrics'
                    ? 'border-[#1E40AF] text-[#1E40AF] font-semibold'
                    : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                Core Metrics
              </button>
              <button
                onClick={() => setActiveTab('telemetry')}
                className={`py-2 px-3 border-b-2 font-medium cursor-pointer transition-colors ${
                  activeTab === 'telemetry'
                    ? 'border-[#1E40AF] text-[#1E40AF] font-semibold'
                    : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                Technical Analysis
              </button>
              <button
                onClick={() => setActiveTab('raw')}
                className={`py-2 px-3 border-b-2 font-medium cursor-pointer transition-colors ${
                  activeTab === 'raw'
                    ? 'border-[#1E40AF] text-[#1E40AF] font-semibold'
                    : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                Raw Sensor JSON
              </button>
            </div>

            {/* Drawer Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-[#0F172A] text-[13px]">
              {activeTab === 'metrics' && (
                <div className="space-y-4">
                  {/* Keystroke trigger callout */}
                  <div className="p-2.5 rounded bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF] text-[12px] flex items-start gap-2">
                    <Key className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">Slide Animation Interactive Mode Active: </span>
                      Press any key on your keyboard anytime or click any metric in the workstation to slide fresh details into this panel!
                    </div>
                  </div>

                  {/* High priority metric cards */}
                  <div className="grid grid-cols-2 gap-2.5">
                    {details.metrics.map((metric, i) => (
                      <div
                        key={i}
                        className="p-3 rounded border border-[#E2E8F0] bg-[#FAFBFD] hover:bg-[#F1F5F9] transition-colors"
                      >
                        <div className="text-[10px] font-mono text-[#64748B] uppercase tracking-wider mb-1 truncate">
                          {metric.label}
                        </div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-mono text-[18px] font-bold text-[#0F172A]">
                            {metric.value}
                          </span>
                          {metric.unit && (
                            <span className="font-mono text-[11px] text-[#64748B] font-medium">
                              {metric.unit}
                            </span>
                          )}
                        </div>
                        {metric.badge && (
                          <div className="mt-1.5">
                            <span
                              className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-medium ${
                                metric.badgeColor === 'red'
                                  ? 'bg-[#FEE2E2] text-[#B91C1C]'
                                  : metric.badgeColor === 'green'
                                  ? 'bg-[#DCFCE7] text-[#15803D]'
                                  : metric.badgeColor === 'amber'
                                  ? 'bg-[#FEF3C7] text-[#B45309]'
                                  : 'bg-[#EFF6FF] text-[#1E40AF]'
                              }`}
                            >
                              {metric.badge}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Description Box */}
                  <div className="p-3 rounded border border-[#CBD5E1] bg-white">
                    <div className="text-[11px] font-mono text-[#64748B] uppercase font-semibold mb-1">
                      OPERATIONAL SUMMARY
                    </div>
                    <p className="text-[13px] leading-relaxed text-[#334155]">{details.description}</p>
                  </div>

                  {/* Technical Notes */}
                  {details.technicalNotes && details.technicalNotes.length > 0 && (
                    <div className="p-3 rounded border border-[#E2E8F0] bg-[#F8FAFC]">
                      <div className="text-[11px] font-mono text-[#64748B] uppercase font-semibold mb-2">
                        SCIENTIFIC VALIDATION LOGS
                      </div>
                      <ul className="space-y-1.5 font-mono text-[11px] text-[#475569]">
                        {details.technicalNotes.map((note, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-[#1E40AF] font-bold">›</span>
                            <span>{note}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'telemetry' && (
                <div className="space-y-3">
                  <div className="text-[11px] font-mono text-[#64748B] uppercase font-semibold">
                    ACTIVE SENSOR EPHEMERIS & CALIBRATION MATRIX
                  </div>
                  <table className="w-full text-left font-mono text-[11px] border border-[#CBD5E1] rounded overflow-hidden">
                    <thead className="bg-[#F8FAFC] text-[#475569] border-b border-[#CBD5E1]">
                      <tr>
                        <th className="p-2">PARAMETER</th>
                        <th className="p-2">REGISTER VALUE</th>
                        <th className="p-2">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                      <tr>
                        <td className="p-2 text-[#475569]">SPATIAL_GSD</td>
                        <td className="p-2 font-bold">0.500 m/px</td>
                        <td className="p-2 text-[#15803D]">NOMINAL</td>
                      </tr>
                      <tr>
                        <td className="p-2 text-[#475569]">STEREO_BASE_HEIGHT</td>
                        <td className="p-2 font-bold">0.684 B/H</td>
                        <td className="p-2 text-[#15803D]">CALIBRATED</td>
                      </tr>
                      <tr>
                        <td className="p-2 text-[#475569]">GEOID_MODEL</td>
                        <td className="p-2 font-bold">EGM2008 / WGS84</td>
                        <td className="p-2 text-[#0284C7]">ACTIVE</td>
                      </tr>
                      <tr>
                        <td className="p-2 text-[#475569]">VOLUMETRIC_DAM_RISK</td>
                        <td className="p-2 font-bold text-[#B91C1C]">1.42 x 10⁶ m³</td>
                        <td className="p-2 text-[#B91C1C]">CRITICAL</td>
                      </tr>
                      <tr>
                        <td className="p-2 text-[#475569]">DOWNLINK_NODE</td>
                        <td className="p-2 font-bold">SAC-NRSC/BKN-04</td>
                        <td className="p-2 text-[#15803D]">LOCKED</td>
                      </tr>
                      <tr>
                        <td className="p-2 text-[#475569]">INFERENCE_ACCEL</td>
                        <td className="p-2 font-bold">NVIDIA A100 TensorRT</td>
                        <td className="p-2 text-[#15803D]">60 FPS</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'raw' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-[#64748B] uppercase font-semibold">
                      RAW TELEMETRY PAYLOAD
                    </span>
                    <button
                      onClick={handleCopyJson}
                      className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#334155] cursor-pointer"
                    >
                      {copied ? <Check className="w-3 h-3 text-[#15803D]" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                    </button>
                  </div>
                  <pre className="p-3 bg-[#0F172A] text-[#E2E8F0] font-mono text-[11px] rounded overflow-x-auto border border-[#334155] leading-snug max-h-96">
                    {JSON.stringify(details, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-3 border-t border-[#CBD5E1] bg-[#F8FAFC] flex items-center justify-between shrink-0 font-sans">
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium bg-white text-[#0F172A] border border-[#CBD5E1] rounded hover:bg-[#F1F5F9] cursor-pointer transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-[#475569]" />
                <span>Export Dataset (.JSON)</span>
              </button>

              <button
                onClick={onClose}
                className="px-4 py-1.5 text-[12px] font-medium bg-[#1E40AF] text-white rounded hover:bg-[#1D4ED8] cursor-pointer transition-colors"
              >
                Close Panel
              </button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};
