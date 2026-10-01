/**
 * Health check endpoint for monitoring API status and environment configuration.
 * Compatible with Vercel Serverless Functions and Express server.
 */
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, AccountKey');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const ltaKeyConfigured = Boolean(process.env.LTA_ACCOUNT_KEY && process.env.LTA_ACCOUNT_KEY.trim().length > 0);

  return res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime ? process.uptime() : 0),
    service: 'SBS Transit Live - CityTransit Network OS API',
    environment: process.env.NODE_ENV || 'development',
    ltaKeyConfigured,
    ltaEndpoint: 'https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival',
    endpoints: {
      busArrival: '/api/bus-arrival?BusStopCode=08031&ServiceNo=147',
      health: '/api/health'
    }
  });
}
