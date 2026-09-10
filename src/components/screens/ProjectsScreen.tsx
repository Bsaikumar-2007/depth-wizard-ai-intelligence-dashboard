import React, { useState } from 'react';
import { FolderClosed, Search, Plus, Filter, ArrowUpRight, ShieldCheck, AlertTriangle } from 'lucide-react';
import { NavModule } from '../../types';

interface ProjectsScreenProps {
  onNavigate: (module: NavModule) => void;
  onOpenSlideDetails: (sourceKey?: string) => void;
}

export const ProjectsScreen: React.FC<ProjectsScreenProps> = ({
  onNavigate,
  onOpenSlideDetails,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const projects = [
    {
      id: 'DMS-2024-CHM',
      name: 'Chamoli GLOF & Rishiganga Landslide Gorge',
      state: 'Uttarakhand',
      sensor: 'Cartosat-3 (0.5m GSD)',
      risk: 'CRITICAL',
      date: '2024-10-18',
      scenes: 42,
    },
    {
      id: 'DMS-2024-SIK',
      name: 'South Lhonak Lake Glacier Outburst',
      state: 'Sikkim',
      sensor: 'RISAT-1A / Cartosat-2',
      risk: 'HIGH',
      date: '2024-09-12',
      scenes: 28,
    },
    {
      id: 'DMS-2024-KED',
      name: 'Mandakini Basin Kedarnath Slope Stability',
      state: 'Uttarakhand',
      sensor: 'Cartosat-3 Optical',
      risk: 'MODERATE',
      date: '2024-08-04',
      scenes: 19,
    },
    {
      id: 'DMS-2024-WYN',
      name: 'Meppadi Chooralmala Landslide Debris Corridor',
      state: 'Kerala',
      sensor: 'Cartosat-3 & UAV Stereo',
      risk: 'CRITICAL',
      date: '2024-07-30',
      scenes: 54,
    },
    {
      id: 'DMS-2024-TEH',
      name: 'Tehri Reservoir Rim Landslide Hazard Index',
      state: 'Uttarakhand',
      sensor: 'Resourcesat-2A LISS-4',
      risk: 'LOW',
      date: '2024-06-15',
      scenes: 31,
    },
  ];

  const filtered = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="projects-screen" className="flex-1 flex flex-col overflow-y-auto bg-[#F5F7FA]">
      <div className="bg-white border-b border-[#CBD5E1] p-4 shrink-0 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[20px] font-bold text-[#0F172A] tracking-tight">
              ISRO Disaster Projects & Terrain Basins
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EFF6FF] text-[#1E40AF] font-bold">
              142 ACTIVE BASINS
            </span>
          </div>
          <p className="text-[13px] text-[#475569] mt-0.5">
            Registered disaster management sectors, calibrated DEM datasets, and hydrological models.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('new-analysis')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[12px] font-medium bg-[#1E40AF] text-white rounded hover:bg-[#1D4ED8] cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Analysis</span>
          </button>
        </div>
      </div>

      <div className="p-4 flex-1 space-y-4">
        {/* Search Bar */}
        <div className="flex items-center gap-3 bg-white p-2 rounded border border-[#CBD5E1] shadow-2xs">
          <Search className="w-4 h-4 text-[#64748B] ml-1" />
          <input
            type="text"
            placeholder="Search by mission ID, river basin name, or state..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 outline-hidden text-[13px] text-[#0F172A]"
          />
        </div>

        {/* Projects Table */}
        <div className="bg-white rounded border border-[#CBD5E1] overflow-hidden shadow-2xs">
          <table className="w-full text-left font-mono text-[12px]">
            <thead className="bg-[#F8FAFC] border-b border-[#CBD5E1] text-[#475569] text-[11px]">
              <tr>
                <th className="p-3">MISSION CODE</th>
                <th className="p-3">BASIN / DISASTER SCENE</th>
                <th className="p-3">STATE</th>
                <th className="p-3">SENSOR PAYLOAD</th>
                <th className="p-3">RISK LEVEL</th>
                <th className="p-3">PROCESSED SCENES</th>
                <th className="p-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filtered.map((proj) => (
                <tr
                  key={proj.id}
                  onClick={() => {
                    if (proj.id === 'DMS-2024-CHM') {
                      onNavigate('overview');
                    } else {
                      onOpenSlideDetails(proj.id);
                    }
                  }}
                  className="hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                >
                  <td className="p-3 font-bold text-[#1E40AF]">{proj.id}</td>
                  <td className="p-3 font-sans font-medium text-[#0F172A]">{proj.name}</td>
                  <td className="p-3 text-[#475569]">{proj.state}</td>
                  <td className="p-3 text-[#475569]">{proj.sensor}</td>
                  <td className="p-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        proj.risk === 'CRITICAL'
                          ? 'bg-[#FEE2E2] text-[#B91C1C]'
                          : proj.risk === 'HIGH'
                          ? 'bg-[#FEF3C7] text-[#B45309]'
                          : proj.risk === 'MODERATE'
                          ? 'bg-[#EFF6FF] text-[#1E40AF]'
                          : 'bg-[#DCFCE7] text-[#15803D]'
                      }`}
                    >
                      {proj.risk}
                    </span>
                  </td>
                  <td className="p-3 text-[#0F172A] font-semibold">{proj.scenes} Scenes</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate('overview');
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-[#1E40AF] hover:underline font-semibold"
                    >
                      <span>Load Workspace</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
