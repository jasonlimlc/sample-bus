import { BusArrivalPrediction, BusCrowdLevel, BusDeckType, ColocatedBus } from '../types/transit';

export interface LTANextBusRaw {
  OriginCode?: string;
  DestinationCode?: string;
  EstimatedArrival?: string;
  Latitude?: string;
  Longitude?: string;
  VisitNumber?: string;
  Load?: string; // 'SEA' | 'SDA' | 'LSD'
  Feature?: string; // 'WAB'
  Type?: string; // 'SD' | 'DD' | 'BD'
  Monitored?: number;
}

export interface LTAServiceRaw {
  ServiceNo: string;
  Operator: string;
  NextBus?: LTANextBusRaw;
  NextBus2?: LTANextBusRaw;
  NextBus3?: LTANextBusRaw;
}

export interface LTABusArrivalResponse {
  'odata.metadata': string;
  BusStopCode: string;
  Services: LTAServiceRaw[];
  _source?: string;
  _cachedAt?: string;
}

function parseLoad(loadCode?: string): BusCrowdLevel {
  switch (loadCode) {
    case 'SEA':
      return 'seats-available';
    case 'SDA':
      return 'standing-available';
    case 'LSD':
      return 'limited-standing';
    default:
      return 'seats-available';
  }
}

function parseType(typeCode?: string): BusDeckType {
  switch (typeCode) {
    case 'DD':
      return 'Double-Decker';
    case 'BD':
      return 'Bendy';
    case 'SD':
    default:
      return 'Single Deck';
  }
}

function calculateEtaMinutes(isoString?: string): number {
  if (!isoString) return 0;
  const arrivalTime = new Date(isoString).getTime();
  if (isNaN(arrivalTime)) return 0;
  const now = Date.now();
  const diffMinutes = Math.round((arrivalTime - now) / 60000);
  return Math.max(0, diffMinutes);
}

export function parseLTAPredictions(
  service: LTAServiceRaw,
  basePlatePrefix: string = 'SBS'
): BusArrivalPrediction[] {
  const predictions: BusArrivalPrediction[] = [];

  const rawBuses = [
    { raw: service.NextBus, defaultPlate: `${basePlatePrefix}3482D` },
    { raw: service.NextBus2, defaultPlate: `${basePlatePrefix}7721X` },
    { raw: service.NextBus3, defaultPlate: `${basePlatePrefix}8109J` },
  ];

  rawBuses.forEach(({ raw, defaultPlate }) => {
    if (raw && raw.EstimatedArrival && raw.EstimatedArrival.trim() !== '') {
      const eta = calculateEtaMinutes(raw.EstimatedArrival);
      predictions.push({
        etaMinutes: eta,
        plateNumber: defaultPlate,
        deckType: parseType(raw.Type),
        crowdLevel: parseLoad(raw.Load),
        wheelchairAccessible: raw.Feature === 'WAB',
      });
    }
  });

  return predictions;
}

export async function fetchLTABusArrivals(
  busStopCode: string,
  serviceNo?: string
): Promise<LTABusArrivalResponse> {
  let url = `/api/bus-arrival?BusStopCode=${encodeURIComponent(busStopCode)}`;
  if (serviceNo) {
    url += `&ServiceNo=${encodeURIComponent(serviceNo)}`;
  }

  const res = await fetch(url, {
    headers: {
      accept: 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch LTA bus arrival data: ${res.statusText}`);
  }

  return res.json();
}

export function extractColocatedBusesFromLTA(
  services: LTAServiceRaw[],
  activeServiceNo: string
): ColocatedBus[] {
  const colors = [
    'bg-route-bus-orange',
    'bg-primary-container',
    'bg-route-express-pink',
    'bg-status-normal',
  ];

  return services
    .filter((s) => s.ServiceNo !== activeServiceNo)
    .map((s, idx) => {
      const nextBus = s.NextBus;
      const eta = nextBus?.EstimatedArrival
        ? calculateEtaMinutes(nextBus.EstimatedArrival)
        : 5 + idx * 3;

      return {
        serviceNumber: s.ServiceNo,
        destination: `Destination ${nextBus?.DestinationCode || 'Terminal'}`,
        via: `Operator: ${s.Operator || 'SBST'} • Berth Call`,
        etaMinutes: eta,
        crowdLevel: parseLoad(nextBus?.Load),
        badgeColorClass: colors[idx % colors.length],
      };
    });
}
