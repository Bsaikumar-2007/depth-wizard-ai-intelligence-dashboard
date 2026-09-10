export type NavModule =
  | 'overview'
  | 'new-analysis'
  | 'explore-3d'
  | 'flythrough'
  | 'terrain-map'
  | 'live-analysis'
  | 'analytics'
  | 'projects'
  | 'settings';

export interface SceneMetadata {
  id: string;
  name: string;
  subLocation: string;
  calibrationStatus: string;
  posLat: string;
  posLon: string;
  gsd: string;
  crs: string;
  sensorDataset: string;
  acquisitionDate: string;
  reconstructionMode: string;
  elevationRange: string;
  elevationMin: number;
  elevationMax: number;
  meanSlopeAspect: string;
  modelConfidence: string;
  inferenceLatency: string;
  dammingRisk: string;
  debrisVolume: string;
  debrisPath: string;
  impoundedVolume: number;
  impoundedMax: number;
  seepageRate: string;
  breachThreshold: string;
}

export interface LayerConfig {
  rgbOrtho: boolean;
  depthMap: boolean;
  elevationDem: boolean;
  slopeAspect: boolean;
  contours: boolean;
  utmGrid: boolean;
  tinMesh?: boolean;
}

export interface Waypoint {
  id: string;
  label: string;
  code: string;
  distance: string;
  elevation: number;
  hazardNote?: string;
  active?: boolean;
  coords: { x: number; y: number; z: number };
}

export interface FlightTelemetry {
  speedKmh: number;
  altMsl: number;
  aglM: number;
  headingDeg: number;
  headingCompass: string;
  pitchDeg: number;
  rollDeg: number;
  fovDeg: number;
  lat: string;
  lon: string;
  opticalGsd: string;
  hazardDistance: string;
}

export interface SlideDetailContent {
  title: string;
  category: 'TELEMETRY' | 'GEOSPATIAL' | 'SENSOR_EPHEMERIS' | 'HAZARD_INSPECTOR' | 'KEY_EVENT';
  timestamp: string;
  sourceKey?: string;
  metrics: {
    label: string;
    value: string;
    unit?: string;
    badge?: string;
    badgeColor?: 'green' | 'amber' | 'red' | 'blue';
  }[];
  description: string;
  technicalNotes?: string[];
  rawParameters?: Record<string, string | number | boolean>;
}
