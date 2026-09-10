import React, { useState } from 'react';
import { Key, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface QuickKeyInteractionBarProps {
  onTriggerKey: (keyName: string, sourceKey: string) => void;
  lastKeyPressed?: string;
}

export const QuickKeyInteractionBar: React.FC<QuickKeyInteractionBarProps> = ({
  onTriggerKey,
  lastKeyPressed,
}) => {
  const [minimized, setMinimized] = useState<boolean>(false);

  const keyList: { keyLabel: string; name: string; sourceKey: string; hint: string }[] = [
    { keyLabel: 'ANY KEY', name: 'Any Key', sourceKey: 'KEYBOARD_INTERACTIVE_INSPECTION', hint: 'Click or press ANY key' },
    { keyLabel: 'SPACE', name: 'Spacebar', sourceKey: 'key_space', hint: 'Chamoli Incident Summary' },
    { keyLabel: 'ENTER', name: 'Enter', sourceKey: 'key_enter', hint: 'Operational Situation Report' },
    { keyLabel: 'D', name: 'D', sourceKey: 'key_d', hint: 'Disaster Damming Risk' },
    { keyLabel: 'F', name: 'F', sourceKey: 'key_f', hint: 'UAV 3D Flythrough' },
    { keyLabel: 'T', name: 'T', sourceKey: 'key_t', hint: 'Sensor Telemetry & SNR' },
    { keyLabel: 'E', name: 'E', sourceKey: 'key_e', hint: 'Elevation Transect Profile' },
    { keyLabel: 'M', name: 'M', sourceKey: 'key_m', hint: '3D TIN Mesh & RPC' },
  ];

  return (
    <div
      id="quick-key-interaction-bar"
      className="fixed bottom-3 right-4 z-40 max-w-2xl bg-white/95 backdrop-blur-md rounded-lg border border-[#CBD5E1] shadow-xl overflow-hidden select-none transition-all duration-200"
    >
      {/* Header bar */}
      <div className="bg-[#FAFBFD] px-3 py-1.5 border-b border-[#E2E8F0] flex items-center justify-between text-[11px] font-mono">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-[#1E40AF] font-bold">
            <Key className="w-3.5 h-3.5" />
            <span>INTERACTIVE KEY SLIDE ANIMATION</span>
          </span>
          {lastKeyPressed && (
            <span className="px-1.5 py-0.2 rounded bg-[#FEF3C7] text-[#B45309] font-bold border border-[#FDE68A] text-[10px] animate-pulse">
              Last Key: {lastKeyPressed}
            </span>
          )}
        </div>

        <button
          onClick={() => setMinimized(!minimized)}
          className="p-1 rounded text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0] cursor-pointer"
          title={minimized ? 'Expand Key Bar' : 'Minimize Key Bar'}
        >
          {minimized ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Main Keys Strip */}
      {!minimized && (
        <div className="p-2 space-y-1.5">
          <div className="text-[11px] text-[#475569] flex items-center justify-between px-1">
            <span>Press any key on your keyboard or click any key below:</span>
            <span className="text-[10px] font-mono text-[#1E40AF] font-semibold">Slides Details In ➔</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
            {keyList.map((item) => (
              <button
                key={item.keyLabel}
                id={`quick-key-btn-${item.keyLabel.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => onTriggerKey(item.name, item.sourceKey)}
                title={item.hint}
                className="px-2 py-1 rounded bg-[#F1F5F9] hover:bg-[#1E40AF] text-[#0F172A] hover:text-white border border-[#CBD5E1] hover:border-[#1E40AF] transition-all cursor-pointer flex items-center gap-1 shadow-2xs group active:scale-95"
              >
                <span className="font-bold text-[10px] px-1 py-0.2 rounded bg-white text-[#1E40AF] group-hover:bg-[#1D4ED8] group-hover:text-white border border-[#CBD5E1] shadow-3xs">
                  {item.keyLabel}
                </span>
                <span className="text-[10px] group-hover:text-white/90">
                  {item.keyLabel === 'ANY KEY'
                    ? 'Click Me'
                    : item.keyLabel === 'SPACE'
                    ? 'Brief'
                    : item.keyLabel === 'ENTER'
                    ? 'Report'
                    : item.keyLabel === 'D'
                    ? 'Disaster'
                    : item.keyLabel === 'F'
                    ? 'Flythrough'
                    : item.keyLabel === 'T'
                    ? 'Telemetry'
                    : item.keyLabel === 'E'
                    ? 'Elevation'
                    : 'Mesh'}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
