/**
 * GET /api/debug/products
 * Diagnostic endpoint — returns exact Prisma error in plain text.
 * DELETE THIS FILE after the 500 is fixed.
 */
import prisma from "@/src/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const results = {}

  // Step 1: count
  try {
    results.count = await prisma.product.count()
  } catch (e) {
    return NextResponse.json({ step: "count", error: e.message }, { status: 500 })
  }

  // Step 2: findMany — no includes
  try {
    const simple = await prisma.product.findMany({ take: 2, select: { id: true, title: true, isActive: true } })
    results.simple = simple
  } catch (e) {
    return NextResponse.json({ step: "findMany-simple", error: e.message }, { status: 500 })
  }

  // Step 3: findMany — with bulkPrices
  try {
    const withBulk = await prisma.product.findMany({
      take: 2,
      select: { id: true, title: true, bulkPrices: { select: { productId: true, price: true } } }
    })
    results.withBulkPrices = withBulk
  } catch (e) {
    return NextResponse.json({ step: "findMany-bulkPrices", error: e.message }, { status: 500 })
  }

  // Step 4: findMany — with images
  try {
    const withImages = await prisma.product.findMany({
      take: 2,
      select: { id: true, images: { select: { productId: true, url: true } } }
    })
    results.withImages = withImages
  } catch (e) {
    return NextResponse.json({ step: "findMany-images", error: e.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, ...results })
}
