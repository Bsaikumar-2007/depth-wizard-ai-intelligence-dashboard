import React from 'react';
import { Bell, User, Play, Sparkles, Key } from 'lucide-react';
import { CURRENT_SCENE } from '../data/mockData';

interface HeaderProps {
  currentModule?: string;
  onNewRun?: () => void;
  onOpenSlideDetails: (sourceKey?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentModule, onNewRun, onOpenSlideDetails }) => {
  return (
    <header
      id="main-app-header"
      className="h-11 bg-white border-b border-[#CBD5E1] flex items-center justify-between px-3 shrink-0 text-[12px] font-sans z-20 select-none"
    >
      {/* Left Info Stream */}
      <div className="flex items-center space-x-3 overflow-hidden text-[#0F172A]">
        {/* Mission ID Badge */}
        <div
          id="header-mission-badge"
          onClick={() => onOpenSlideDetails('ID_26175')}
          title="Click or press any key for details"
          className="bg-[#EFF6FF] text-[#1E40AF] font-mono text-[11px] px-2 py-0.5 rounded border border-[#BFDBFE] font-semibold tracking-wider cursor-pointer hover:bg-[#DBEAFE] transition-colors"
        >
          ID: 26175
        </div>

        {/* Location Breadcrumb */}
        <div
          onClick={() => onOpenSlideDetails('CHAMOLI_BASIN')}
          className="font-medium text-[#0F172A] hover:text-[#1E40AF] cursor-pointer flex items-center gap-1.5 truncate"
          title="Chamoli Flood Basin / Rishiganga River Valley"
        >
          <span className="font-semibold text-[13px]">Chamoli Flood B...</span>
          <span className="text-[#94A3B8]">/</span>
          <span className="text-[#475569] truncate">Rishiganga River V...</span>
        </div>

        {/* Calibration Badge */}
        <div
          onClick={() => onOpenSlideDetails('CALIBRATION')}
          className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0] font-mono text-[11px] font-medium cursor-pointer hover:bg-[#DCFCE7]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse"></span>
          <span>SRTM-v3 Calibrated</span>
        </div>

        {/* Geodetic Telemetry Attributes */}
        <div className="hidden xl:flex items-center gap-4 text-[#475569] font-mono text-[11px] border-l border-[#E2E8F0] pl-3">
          <span
            onClick={() => onOpenSlideDetails('POS_COORDS')}
            className="cursor-pointer hover:text-[#0F172A]"
          >
            <strong className="text-[#64748B] font-normal">POS: </strong>
            <span className="text-[#0F172A] font-medium">30°29'44"N 79°41'32"E</span>
          </span>

          <span
            onClick={() => onOpenSlideDetails('GSD_RES')}
            className="cursor-pointer hover:text-[#0F172A]"
          >
            <strong className="text-[#64748B] font-normal">GSD: </strong>
            <span className="text-[#0F172A] font-medium">0.5m/px</span>
          </span>

          <span
            onClick={() => onOpenSlideDetails('CRS_DATUM')}
            className="cursor-pointer hover:text-[#0F172A]"
          >
            <strong className="text-[#64748B] font-normal">CRS: </strong>
            <span className="text-[#0F172A] font-medium">WGS 84 / UTM 44N</span>
          </span>
        </div>
      </div>

      {/* Right Controls & Slide Trigger */}
      <div className="flex items-center space-x-2 shrink-0">
        {/* Slide-Animation trigger prompt */}
        <button
          id="press-key-details-pill"
          onClick={() => onOpenSlideDetails('HEADER_KEY_PROMPT')}
          title="Press any key on your keyboard or click here to slide details in"
          className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-medium rounded bg-[#F8FAFC] text-[#334155] border border-[#CBD5E1] hover:bg-[#EFF6FF] hover:text-[#1E40AF] hover:border-[#93C5FD] transition-all cursor-pointer shadow-2xs group"
        >
          <Key className="w-3 h-3 text-[#1E40AF] group-hover:rotate-12 transition-transform" />
          <span>Press Any Key</span>
          <span className="text-[#64748B] text-[10px] bg-white px-1 py-0.2 rounded border border-[#E2E8F0]">Slide Details</span>
        </button>

        {/* New Run Button */}
        <button
          id="header-new-run-btn"
          onClick={onNewRun}
          className="inline-flex items-center gap-1.5 bg-[#1E40AF] hover:bg-[#1D4ED8] active:bg-[#1E3A8A] text-white px-3 py-1 rounded text-[12px] font-medium transition-colors shadow-2xs cursor-pointer"
        >
          <Play className="w-3 h-3 fill-current" />
          <span>New Run</span>
        </button>

        {/* Notifications Bell */}
        <button
          id="header-notifications-btn"
          onClick={() => onOpenSlideDetails('NOTIFICATIONS')}
          className="relative p-1.5 rounded hover:bg-[#F1F5F9] text-[#475569] hover:text-[#0F172A] transition-colors cursor-pointer"
          title="3 System Alerts Active"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#DC2626] rounded-full border border-white"></span>
        </button>

        {/* Profile Avatar */}
        <div
          id="header-user-avatar"
          onClick={() => onOpenSlideDetails('USER_PROFILE')}
          className="w-7 h-7 rounded-full bg-[#E2E8F0] border border-[#CBD5E1] flex items-center justify-center text-[#475569] hover:text-[#1E40AF] hover:border-[#93C5FD] cursor-pointer transition-colors"
          title="Operator: SAC-NRSC ISRO Specialist"
        >
          <User className="w-4 h-4" />
        </div>
      </div>
    </header>
  );
};
