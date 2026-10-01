export type BusCrowdLevel = 'seats-available' | 'standing-available' | 'limited-standing';
export type BusDeckType = 'Single Deck' | 'Double-Decker' | 'Bendy';

export interface BusArrivalPrediction {
  etaMinutes: number; // 0 for arriving
  plateNumber: string;
  deckType: BusDeckType;
  crowdLevel: BusCrowdLevel;
  wheelchairAccessible: boolean;
}

export interface BusStop {
  code: string;
  name: string;
  roadName: string;
  direction: 1 | 2;
  sequence: number;
  estMinutesFromPrevious?: number;
  mrtLines?: string[];
  description?: string;
  distanceMetersFromUser?: number;
  walkingMinutes?: number;
  isInterchange?: boolean;
}

export interface TransponderVehicle {
  id: string;
  plateNumber: string;
  busNumber: string;
  speedKmH: number;
  currentStopSequence: number; // between this stop and the next
  distanceToNextStopMeters: number;
  statusText: string;
  statusType: 'approaching' | 'trailing' | 'departed';
  deckType: BusDeckType;
}

export interface BusService {
  number: string;
  name: string;
  origin: string;
  destination: string;
  direction1Label: string;
  direction2Label: string;
  totalStopsDir1: number;
  totalStopsDir2: number;
  peakFrequency: string;
  offPeakFrequency: string;
  routeLengthKm: number;
  travelTimeMinutes: number;
  firstBus: string;
  lastBus: string;
  status: 'NORMAL SERVICE' | 'MINOR DELAY' | 'DISRUPTED';
  color: string;
}

export interface TransitAlert {
  id: string;
  serviceOrLine: string;
  type: 'delay' | 'advisory' | 'weather' | 'closure';
  title: string;
  description: string;
  timestamp: string;
  severity: 'normal' | 'moderate' | 'disrupted';
  affectedStops?: string[];
}

export interface ColocatedBus {
  serviceNumber: string;
  destination: string;
  via: string;
  etaMinutes: number;
  crowdLevel: 'seats-available' | 'standing-available' | 'limited-standing';
  badgeColorClass: string;
}
