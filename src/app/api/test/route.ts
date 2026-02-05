import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Simple test without Prisma first
    return NextResponse.json({ 
      message: 'API is working',
      env: process.env.DATABASE_URL,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json(
      { error: 'Test failed' },
      { status: 500 }
    );
  }
}
