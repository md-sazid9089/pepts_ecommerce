import prisma from "@/src/lib/prisma"

export async function GET(request) {
  try {
    // Test if Prisma can connect
    const count = await prisma.product.count()
    return new Response(JSON.stringify({ 
      success: true,
      message: "Prisma connected successfully",
      productCount: count,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: "Prisma connection failed",
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
