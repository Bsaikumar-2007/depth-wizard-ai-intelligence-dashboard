import React, { useState } from 'react';
import {
  LayoutGrid,
  PlusSquare,
  Box,
  Plane,
  Map,
  Radio,
  LineChart,
  FolderClosed,
  Settings,
  ChevronRight,
  ChevronDown,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DepthWizardLogo } from './DepthWizardLogo';
import { NavModule } from '../types';

interface SidebarProps {
  currentModule: NavModule;
  onSelectModule: (module: NavModule) => void;
  onOpenSlideDetails: (sourceKey?: string) => void;
}

interface NavItemConfig {
  id: NavModule;
  label: string;
  icon: React.ReactNode;
  moduleKey: string;
  subKeys: { label: string; sourceKey: string }[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentModule,
  onSelectModule,
  onOpenSlideDetails,
}) => {
  const [expandedModule, setExpandedModule] = useState<NavModule | null>('overview');

  const navItems: NavItemConfig[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <LayoutGrid className="w-4 h-4" />,
      moduleKey: 'module_overview',
      subKeys: [
        { label: 'Basin KPIs & Metrics', sourceKey: 'module_overview' },
        { label: 'Elevation Contours & DEM', sourceKey: 'GIS_CONTOURS' },
        { label: 'Damming Hazard Volumetrics', sourceKey: 'HAZARD_ASSESSMENT' },
        { label: 'Transect Profile (A → A\')', sourceKey: 'TRANSECT_PROFILE' },
        { label: 'Cartosat-3 Optical Dataset', sourceKey: 'SENSOR_DATASET' },
      ],
    },
    {
      id: 'new-analysis',
      label: 'New Analysis',
      icon: <PlusSquare className="w-4 h-4" />,
      moduleKey: 'module_new_analysis',
      subKeys: [
        { label: 'Image Ingestion & Bounds', sourceKey: 'module_new_analysis' },
        { label: 'Elevation Calibration GCPs', sourceKey: 'CONFIDENCE' },
        { label: 'Neural Depth Inference', sourceKey: 'RECONSTRUCTIONS' },
      ],
    },
    {
      id: 'explore-3d',
      label: 'Explore 3D',
      icon: <Box className="w-4 h-4" />,
      moduleKey: 'module_explore_3d',
      subKeys: [
        { label: 'Perspective TIN Mesh', sourceKey: 'module_explore_3d' },
        { label: 'Target Pin #PT-4091', sourceKey: 'PIN_PT4091' },
        { label: 'Water Impoundment Level', sourceKey: 'VOLUMETRIC_ASSESSMENT' },
      ],
    },
    {
      id: 'flythrough',
      label: 'Flythrough',
      icon: <Plane className="w-4 h-4" />,
      moduleKey: 'module_flythrough',
      subKeys: [
        { label: 'UAV Flight Corridor Ephemeris', sourceKey: 'module_flythrough' },
        { label: 'Waypoint 03: Debris Toe', sourceKey: 'WAYPOINT_03_DEBRIS_TOE' },
        { label: 'Cockpit Telemetry HUD', sourceKey: 'FLYTHROUGH_SURVEY_RUN' },
      ],
    },
    {
      id: 'terrain-map',
      label: 'Terrain Map',
      icon: <Map className="w-4 h-4" />,
      moduleKey: 'module_terrain_map',
      subKeys: [
        { label: 'Hydrological Basin Simulation', sourceKey: 'module_terrain_map' },
        { label: 'Flood Inundation Warning', sourceKey: 'HAZARD_ASSESSMENT' },
      ],
    },
    {
      id: 'live-analysis',
      label: 'Live Analysis',
      icon: <Radio className="w-4 h-4" />,
      moduleKey: 'module_live_analysis',
      subKeys: [
        { label: 'Cartosat-3 Downlink Pass', sourceKey: 'module_live_analysis' },
        { label: 'A100 GPU Inference Engine', sourceKey: 'RECONSTRUCTIONS' },
      ],
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <LineChart className="w-4 h-4" />,
      moduleKey: 'module_analytics',
      subKeys: [
        { label: 'Elevation Accuracy vs GCPs', sourceKey: 'CONFIDENCE' },
        { label: 'Breach Volume Trends', sourceKey: 'module_analytics' },
      ],
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: <FolderClosed className="w-4 h-4" />,
      moduleKey: 'module_projects',
      subKeys: [
        { label: '142 Active Disaster Basins', sourceKey: 'TOTAL_PROJECTS' },
        { label: 'Chamoli Incident Dossier', sourceKey: 'module_projects' },
      ],
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />,
      moduleKey: 'module_settings',
      subKeys: [
        { label: 'Geoid EGM2008 & Vertical Datum', sourceKey: 'module_settings' },
        { label: 'Bhuvan Geoportal WMS Gateway', sourceKey: 'module_settings' },
      ],
    },
  ];

  const handleItemClick = (item: NavItemConfig) => {
    // 1. Select the module
    onSelectModule(item.id);
    setExpandedModule(item.id);

    // 2. Trigger slide animation for this key's details
    onOpenSlideDetails(item.moduleKey);
  };

  return (
    <aside
      id="main-app-sidebar"
      className="w-64 bg-white border-r border-[#CBD5E1] flex flex-col justify-between shrink-0 select-none z-10 h-full overflow-hidden"
    >
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Brand & Logo Header */}
        <div
          id="sidebar-brand-header"
          onClick={() => onOpenSlideDetails('BRAND_INFO')}
          className="p-3 border-b border-[#E2E8F0] flex items-center gap-2.5 cursor-pointer hover:bg-[#F8FAFC] transition-colors shrink-0"
          title="DEPTHWIZARD - Click to slide details"
        >
          <DepthWizardLogo size={32} />
          <div className="flex flex-col">
            <span className="font-bold text-[13px] tracking-tight text-[#00288E] leading-tight flex items-center gap-1">
              DEPTHWIZARD
            </span>
            <span className="text-[10px] text-[#475569] font-mono tracking-tight">
              3D Terrain Intel | ISRO DMS
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="py-2.5 px-2 flex-1">
          <div className="px-2 pb-1.5 text-[10px] font-mono font-medium tracking-wider uppercase text-[#64748B] flex items-center justify-between">
            <span>MISSION MODULES</span>
            <span className="text-[9px] text-[#1E40AF] font-bold">CLICK = SLIDE DETAILS</span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = currentModule === item.id;
              const isExpanded = expandedModule === item.id;

              return (
                <div key={item.id} className="flex flex-col">
                  {/* Primary Module Key Button */}
                  <button
                    id={`nav-item-${item.id}`}
                    onClick={() => handleItemClick(item)}
                    title={`Click ${item.label} to navigate and slide details`}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-[13px] font-medium transition-all text-left cursor-pointer group ${
                      isActive
                        ? 'bg-[#1E40AF] text-white shadow-xs font-semibold'
                        : 'text-[#334155] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={isActive ? 'text-white' : 'text-[#64748B] group-hover:text-[#1E40AF]'}>
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <span
                        className={`text-[9px] font-mono px-1 py-0.2 rounded border transition-colors ${
                          isActive
                            ? 'bg-blue-800 text-blue-100 border-blue-600'
                            : 'bg-white text-[#64748B] border-[#CBD5E1] group-hover:border-[#93C5FD] group-hover:text-[#1E40AF]'
                        }`}
                      >
                        Slide ➔
                      </span>
                      {isExpanded ? (
                        <ChevronDown className="w-3 h-3 opacity-70" />
                      ) : (
                        <ChevronRight className="w-3 h-3 opacity-40 group-hover:opacity-70" />
                      )}
                    </div>
                  </button>

                  {/* Sub-keys down below each module with Slide Animation */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.18, ease: 'easeInOut' }}
                        className="overflow-hidden pl-5 pr-1 py-1 space-y-0.5 border-l-2 border-[#DBEAFE] ml-3 mt-0.5"
                      >
                        {item.subKeys.map((sub) => (
                          <button
                            key={sub.label}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectModule(item.id);
                              onOpenSlideDetails(sub.sourceKey);
                            }}
                            className="w-full flex items-center justify-between text-left text-[11px] font-sans text-[#475569] hover:text-[#1E40AF] hover:bg-[#EFF6FF] px-2 py-1 rounded transition-colors cursor-pointer group"
                          >
                            <span className="truncate">• {sub.label}</span>
                            <ArrowRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 text-[#1E40AF] transition-opacity shrink-0 ml-1" />
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Operational Node Status Footer */}
      <div
        id="sidebar-operational-node"
        onClick={() => onOpenSlideDetails('OPERATIONAL_NODE')}
        className="p-3 border-t border-[#E2E8F0] bg-[#F8FAFC] cursor-pointer hover:bg-[#F1F5F9] transition-colors shrink-0"
        title="Click to slide operational node telemetry"
      >
        <div className="flex items-center justify-between text-[11px] font-mono mb-1">
          <span className="text-[#64748B] text-[10px] uppercase tracking-wider font-semibold">
            OPERATIONAL NODE
          </span>
          <span className="flex items-center gap-1 text-[#15803D] font-medium text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse"></span>
            Online
          </span>
        </div>
        <div className="font-mono text-[12px] font-semibold text-[#0F172A] flex items-center justify-between">
          <span>SAC-NRSC/BKN-04</span>
          <span className="text-[10px] text-[#1E40AF] font-mono hover:underline">Inspect ➔</span>
        </div>
        <div className="flex items-center justify-between font-mono text-[10px] text-[#64748B] mt-0.5">
          <span>Grid v3.4</span>
          <span>DMS-26175</span>
        </div>
      </div>
    </aside>
  );
};
