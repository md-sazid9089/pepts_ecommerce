export async function GET(request) {
  return new Response(JSON.stringify({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
    hasDatabaseUrl: !!process.env.DATABASE_URL
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
