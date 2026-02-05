import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Create a simple Prisma client instance
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    // Test connection with a simple query
    const result = await prisma.$queryRaw`SELECT NOW() as current_time`;
    
    await prisma.$disconnect();
    
    return NextResponse.json({ 
      message: 'Database connection successful',
      result,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { error: 'Database connection failed', details: error.message },
      { status: 500 }
    );
  }
}
