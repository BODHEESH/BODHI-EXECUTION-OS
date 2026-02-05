import { NextResponse } from "next/server";

// Simple seed without Prisma for now
export async function POST() {
  try {
    console.log('Simple seed started...');
    
    // Return success for now
    return NextResponse.json({ 
      message: 'Simple seed completed',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Simple seed error:', error);
    return NextResponse.json(
      { error: 'Simple seed failed' },
      { status: 500 }
    );
  }
}
