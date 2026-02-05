import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Test Prisma import
    const { PrismaClient } = await import('@prisma/client');
    
    return NextResponse.json({ 
      message: 'Prisma import successful',
      hasPrismaClient: !!PrismaClient,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Prisma import error:', error);
    return NextResponse.json(
      { 
        error: 'Prisma import failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
