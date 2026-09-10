import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { SlideDetailsDrawer } from './components/SlideDetailsDrawer';
import { QuickKeyInteractionBar } from './components/QuickKeyInteractionBar';
import { OverviewScreen } from './components/screens/OverviewScreen';
import { NewAnalysisScreen } from './components/screens/NewAnalysisScreen';
import { Explore3DScreen } from './components/screens/Explore3DScreen';
import { FlythroughScreen } from './components/screens/FlythroughScreen';
import { TerrainMapScreen } from './components/screens/TerrainMapScreen';
import { LiveAnalysisScreen } from './components/screens/LiveAnalysisScreen';
import { AnalyticsScreen } from './components/screens/AnalyticsScreen';
import { ProjectsScreen } from './components/screens/ProjectsScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { DETAIL_CONTENTS_MAP, DEFAULT_SLIDE_DETAIL } from './data/mockData';
import { NavModule, SlideDetailContent } from './types';

export default function App() {
  const [currentModule, setCurrentModule] = useState<NavModule>('overview');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [lastKeyPressed, setLastKeyPressed] = useState<string | undefined>(undefined);
  const [drawerDetails, setDrawerDetails] = useState<SlideDetailContent>(DEFAULT_SLIDE_DETAIL);
  const containerRef = useRef<HTMLDivElement>(null);

  // Open the slide drawer with specific inspection content
  const handleOpenSlideDetails = useCallback((sourceKey?: string, keyTrigger?: string) => {
    if (sourceKey && DETAIL_CONTENTS_MAP[sourceKey]) {
      setDrawerDetails(DETAIL_CONTENTS_MAP[sourceKey]);
    } else if (sourceKey) {
      // Dynamic fallback for specific named items
      setDrawerDetails({
        title: `Telemetry Telemetry: ${sourceKey.replace(/_/g, ' ')}`,
        category: 'GEOSPATIAL',
        description: `Inspecting active parameters and ephemeris calibration matrix for ${sourceKey}.`,
        metrics: [
          { label: 'Register Status', value: 'VALIDATED', badge: 'ONLINE', badgeColor: 'green' },
          { label: 'Node Source', value: 'SAC-NRSC/BKN-04' },
          { label: 'Latency', value: '4.82', unit: 'ms' },
          { label: 'GCP Tolerance', value: '±0.42', unit: 'm' },
        ],
        technicalNotes: [
          `Sub-pixel ephemeris correlation confirmed via Cartosat-3 RPC solver.`,
          `Geoid datum referenced to EGM2008 / WGS84 vertical datum.`,
        ],
      });
    } else {
      setDrawerDetails(DEFAULT_SLIDE_DETAIL);
    }

    if (keyTrigger) {
      setLastKeyPressed(keyTrigger);
    }
    setIsDrawerOpen(true);
  }, []);

  // Keyboard Event Listener: "if click any key the details should come with slide animation"
  useEffect(() => {
    // Focus window immediately so key strokes in iframe are caught
    window.focus();
    if (containerRef.current) {
      containerRef.current.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is actively typing in an input, textarea, or select
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
        return;
      }

      // If Escape is pressed, close the drawer
      if (e.key === 'Escape') {
        setIsDrawerOpen(false);
        return;
      }

      // Ignore lone modifiers
      if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].includes(e.key)) {
        return;
      }

      // Prevent page scrolling on Spacebar
      if (e.key === ' ') {
        e.preventDefault();
      }

      const keyName = e.key === ' ' ? 'Space' : e.key;
      const lower = keyName.toLowerCase();

      // Trigger specific or general slide-in details
      if (lower === 'd') {
        handleOpenSlideDetails('key_d', '[D] Disaster');
      } else if (lower === 'f') {
        handleOpenSlideDetails('key_f', '[F] Flythrough');
      } else if (lower === 't') {
        handleOpenSlideDetails('key_t', '[T] Telemetry');
      } else if (lower === 'e') {
        handleOpenSlideDetails('key_e', '[E] Elevation');
      } else if (lower === 'm') {
        handleOpenSlideDetails('key_m', '[M] 3D Mesh');
      } else if (lower === 'h') {
        handleOpenSlideDetails('HAZARD_ASSESSMENT', '[H] Hazard');
      } else if (lower === 'space') {
        handleOpenSlideDetails('key_space', '[SPACE] Brief');
      } else if (lower === 'enter') {
        handleOpenSlideDetails('key_enter', '[ENTER] Report');
      } else {
        // ANY KEY PRESSED: Trigger the slide animation with full key inspection
        handleOpenSlideDetails(
          'KEYBOARD_INTERACTIVE_INSPECTION',
          `[${keyName.toUpperCase()}] Key Pressed`
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleOpenSlideDetails]);

  return (
    <div
      id="depthwizard-root"
      ref={containerRef}
      tabIndex={0}
      onClick={() => {
        // Ensure container keeps focus so keydown is always received
        if (containerRef.current && document.activeElement !== containerRef.current) {
          containerRef.current.focus();
        }
      }}
      className="h-screen w-screen flex flex-col overflow-hidden bg-[#F5F7FA] font-sans outline-hidden"
    >
      {/* Universal Top Header */}
      <Header
        currentModule={currentModule}
        onNewRun={() => setCurrentModule('new-analysis')}
        onOpenSlideDetails={(sourceKey) => handleOpenSlideDetails(sourceKey, 'Header Click')}
      />

      {/* Main Workspace Frame: Sidebar + Active Module Screen */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Module Navigation Sidebar */}
        <Sidebar
          currentModule={currentModule}
          onSelectModule={(mod) => setCurrentModule(mod)}
          onOpenSlideDetails={(sourceKey) => handleOpenSlideDetails(sourceKey, 'Sidebar Click')}
        />

        {/* Center Main Stage Viewport */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentModule}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex flex-col overflow-hidden h-full"
            >
              {currentModule === 'overview' && (
                <OverviewScreen
                  onNavigate={(mod) => setCurrentModule(mod)}
                  onOpenSlideDetails={(key) => handleOpenSlideDetails(key, 'Overview Click')}
                />
              )}

              {currentModule === 'new-analysis' && (
                <NewAnalysisScreen
                  onNavigate={(mod) => setCurrentModule(mod)}
                  onOpenSlideDetails={(key) => handleOpenSlideDetails(key, 'New Analysis Click')}
                />
              )}

              {currentModule === 'explore-3d' && (
                <Explore3DScreen
                  onNavigate={(mod) => setCurrentModule(mod)}
                  onOpenSlideDetails={(key) => handleOpenSlideDetails(key, 'Explore 3D Click')}
                />
              )}

              {currentModule === 'flythrough' && (
                <FlythroughScreen
                  onNavigate={(mod) => setCurrentModule(mod)}
                  onOpenSlideDetails={(key) => handleOpenSlideDetails(key, 'Flythrough Click')}
                />
              )}

              {currentModule === 'terrain-map' && (
                <TerrainMapScreen
                  onNavigate={(mod) => setCurrentModule(mod)}
                  onOpenSlideDetails={(key) => handleOpenSlideDetails(key, 'Terrain Map Click')}
                />
              )}

              {currentModule === 'live-analysis' && (
                <LiveAnalysisScreen
                  onNavigate={(mod) => setCurrentModule(mod)}
                  onOpenSlideDetails={(key) => handleOpenSlideDetails(key, 'Live Analysis Click')}
                />
              )}

              {currentModule === 'analytics' && (
                <AnalyticsScreen
                  onNavigate={(mod) => setCurrentModule(mod)}
                  onOpenSlideDetails={(key) => handleOpenSlideDetails(key, 'Analytics Click')}
                />
              )}

              {currentModule === 'projects' && (
                <ProjectsScreen
                  onNavigate={(mod) => setCurrentModule(mod)}
                  onOpenSlideDetails={(key) => handleOpenSlideDetails(key, 'Projects Click')}
                />
              )}

              {currentModule === 'settings' && (
                <SettingsScreen
                  onNavigate={(mod) => setCurrentModule(mod)}
                  onOpenSlideDetails={(key) => handleOpenSlideDetails(key, 'Settings Click')}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Floating Interactive Quick-Keys Trigger Bar (Click or press any key) */}
      <QuickKeyInteractionBar
        onTriggerKey={(keyName, sourceKey) => handleOpenSlideDetails(sourceKey, `[${keyName}] Key`)}
        lastKeyPressed={lastKeyPressed}
      />

      {/* Slide-In Details Drawer (Triggered by ANY key or click) */}
      <SlideDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        details={drawerDetails}
        lastKeyPressed={lastKeyPressed}
      />
    </div>
  );
}
