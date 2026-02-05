import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Test Prisma client creation
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    // Test a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    
    await prisma.$disconnect();
    
    return NextResponse.json({ 
      message: 'Prisma client test successful',
      result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Prisma client error:', error);
    return NextResponse.json(
      { error: 'Prisma client test failed', details: error.message },
      { status: 500 }
    );
  }
}
