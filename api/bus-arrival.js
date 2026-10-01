/**
 * LTA DataMall v3 Bus Arrival API Proxy
 * Endpoint: https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode={code}&ServiceNo={service}
 *
 * Compatible with Vercel Serverless Functions and local Express server.
 */

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, AccountKey');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Parse query parameters
  const query = req.query || {};
  const busStopCode = query.BusStopCode || query.busStopCode || query.busstopcode || '08031';
  const serviceNo = query.ServiceNo || query.serviceNo || query.serviceno || '';

  const ltaAccountKey = process.env.LTA_ACCOUNT_KEY ? process.env.LTA_ACCOUNT_KEY.trim() : '';

  // If LTA Account Key is configured, make real call to LTA DataMall v3
  if (ltaAccountKey) {
    try {
      let ltaUrl = `https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=${encodeURIComponent(busStopCode)}`;
      if (serviceNo) {
        ltaUrl += `&ServiceNo=${encodeURIComponent(serviceNo)}`;
      }

      const response = await fetch(ltaUrl, {
        method: 'GET',
        headers: {
          'AccountKey': ltaAccountKey,
          'accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({
          error: `LTA DataMall API responded with status ${response.status}`,
          details: errorText,
          fallback: generateSimulatedArrivals(busStopCode, serviceNo)
        });
      }

      const data = await response.json();
      res.setHeader('Cache-Control', 's-maxage=15, stale-while-revalidate=5');
      return res.status(200).json({
        ...data,
        _source: 'live-lta-datamall-v3',
        _cachedAt: new Date().toISOString()
      });
    } catch (err) {
      console.error('Error fetching from LTA DataMall:', err);
      // Fallback to simulated data if network fails
      return res.status(200).json({
        ...generateSimulatedArrivals(busStopCode, serviceNo),
        _source: 'fallback-on-error',
        _error: err.message
      });
    }
  }

  // When LTA_ACCOUNT_KEY is not yet added in Vercel environment variables,
  // return accurate simulated LTA DataMall v3 formatted data matching the exact schema
  const simulatedData = generateSimulatedArrivals(busStopCode, serviceNo);
  return res.status(200).json({
    ...simulatedData,
    _source: 'simulated-awaiting-lta-key',
    _notice: 'LTA_ACCOUNT_KEY environment variable is not configured yet. Add it in Vercel to activate live LTA DataMall stream.'
  });
}

/**
 * Generates response strictly adhering to LTA DataMall v3 BusArrival schema
 */
function generateSimulatedArrivals(busStopCode, requestedServiceNo) {
  const now = Date.now();

  const mockServices = [
    {
      serviceNo: '147',
      operator: 'SBST',
      nextBusOffsetSecs: 30, // Arriving
      nextBus2OffsetSecs: 7 * 60, // 7 min
      nextBus3OffsetSecs: 18 * 60, // 18 min
      load1: 'SEA',
      load2: 'SDA',
      load3: 'SEA',
      type1: 'DD',
      type2: 'DD',
      type3: 'SD',
      origin: '64009',
      destination: '17009'
    },
    {
      serviceNo: '65',
      operator: 'SBST',
      nextBusOffsetSecs: 3 * 60,
      nextBus2OffsetSecs: 12 * 60,
      nextBus3OffsetSecs: 21 * 60,
      load1: 'SEA',
      load2: 'SEA',
      load3: 'SDA',
      type1: 'DD',
      type2: 'DD',
      type3: 'DD',
      origin: '75009',
      destination: '14009'
    },
    {
      serviceNo: '166',
      operator: 'SBST',
      nextBusOffsetSecs: 11 * 60,
      nextBus2OffsetSecs: 22 * 60,
      nextBus3OffsetSecs: 33 * 60,
      load1: 'SDA',
      load2: 'SEA',
      load3: 'SEA',
      type1: 'DD',
      type2: 'SD',
      type3: 'DD',
      origin: '54009',
      destination: '17009'
    },
    {
      serviceNo: '857',
      operator: 'TTS',
      nextBusOffsetSecs: 4 * 60,
      nextBus2OffsetSecs: 14 * 60,
      nextBus3OffsetSecs: 25 * 60,
      load1: 'SEA',
      load2: 'SEA',
      load3: 'SEA',
      type1: 'DD',
      type2: 'DD',
      type3: 'SD',
      origin: '59009',
      destination: '02089'
    },
    {
      serviceNo: '7',
      operator: 'SBST',
      nextBusOffsetSecs: 8 * 60,
      nextBus2OffsetSecs: 17 * 60,
      nextBus3OffsetSecs: 28 * 60,
      load1: 'SEA',
      load2: 'SEA',
      load3: 'SEA',
      type1: 'DD',
      type2: 'DD',
      type3: 'DD',
      origin: '84009',
      destination: '17009'
    }
  ];

  let selectedServices = mockServices;
  if (requestedServiceNo) {
    selectedServices = mockServices.filter(
      (s) => s.serviceNo.toLowerCase() === requestedServiceNo.toLowerCase()
    );
    if (selectedServices.length === 0) {
      selectedServices = [
        {
          serviceNo: requestedServiceNo,
          operator: 'SBST',
          nextBusOffsetSecs: 4 * 60,
          nextBus2OffsetSecs: 12 * 60,
          nextBus3OffsetSecs: 22 * 60,
          load1: 'SEA',
          load2: 'SDA',
          load3: 'SEA',
          type1: 'DD',
          type2: 'SD',
          type3: 'DD',
          origin: '10009',
          destination: '45009'
        }
      ];
    }
  }

  const services = selectedServices.map((svc) => ({
    ServiceNo: svc.serviceNo,
    Operator: svc.operator,
    NextBus: {
      OriginCode: svc.origin,
      DestinationCode: svc.destination,
      EstimatedArrival: new Date(now + svc.nextBusOffsetSecs * 1000).toISOString(),
      Monitored: 1,
      Latitude: '1.2995',
      Longitude: '103.8458',
      VisitNumber: '1',
      Load: svc.load1,
      Feature: 'WAB',
      Type: svc.type1
    },
    NextBus2: {
      OriginCode: svc.origin,
      DestinationCode: svc.destination,
      EstimatedArrival: new Date(now + svc.nextBus2OffsetSecs * 1000).toISOString(),
      Monitored: 1,
      Latitude: '1.2960',
      Longitude: '103.8390',
      VisitNumber: '1',
      Load: svc.load2,
      Feature: 'WAB',
      Type: svc.type2
    },
    NextBus3: {
      OriginCode: svc.origin,
      DestinationCode: svc.destination,
      EstimatedArrival: new Date(now + svc.nextBus3OffsetSecs * 1000).toISOString(),
      Monitored: 1,
      Latitude: '1.2910',
      Longitude: '103.8310',
      VisitNumber: '1',
      Load: svc.load3,
      Feature: 'WAB',
      Type: svc.type3
    }
  }));

  return {
    'odata.metadata': 'https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival',
    BusStopCode: busStopCode,
    Services: services
  };
}
