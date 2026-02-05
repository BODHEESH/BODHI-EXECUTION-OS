import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Test with explicit environment variable
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      return NextResponse.json(
        { error: 'DATABASE_URL not found in environment' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'Environment check successful',
      databaseUrl: databaseUrl.replace(/:([^:@]+)@/, ':***@'), // Hide password
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Environment check error:', error);
    return NextResponse.json(
      { error: 'Environment check failed', details: error.message },
      { status: 500 }
    );
  }
}
