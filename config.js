// Configuration file for Go Garden App
// Move sensitive keys to environment variables in production

const config = {
  supabase: {
    url: process.env.SUPABASE_URL || 'https://ajktssbhxnukxksjjdyr.supabase.co',
    anonKey: process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqa3Rzc2JoeG51a3hrc2pqZHlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNDEwNTMsImV4cCI6MjA2NDYxNzA1M30.jARR7T5uxhF1iRiv96cdTyLbTYINfLs_JqtmtFnS3E0'
  },
  plantNet: {
    apiKey: process.env.PLANTNET_API_KEY || '2b10VhJE8nNEGRdKjz3L9JXVf',
    baseUrl: 'https://my-api.plantnet.org/v1/identify/worldwide'
  },
  app: {
    name: 'Go Garden',
    version: '1.0.0',
    defaultLocation: 'Winston-Salem, NC',
    defaultZone: '7b'
  }
};

export default config; 