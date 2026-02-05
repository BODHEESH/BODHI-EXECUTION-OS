import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { z } from "zod";
import { DailyTrackerSchema } from "@/lib/schemas";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const date = searchParams.get("date");

    let query = supabase.from('daily_trackers').select('*');

    if (userId && date) {
      query = query.eq('userId', userId).eq('date', date);
    } else if (userId) {
      query = query.eq('userId', userId).order('date', { ascending: false });
    } else {
      query = query.order('date', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch daily trackers", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching daily trackers:", error);
    return NextResponse.json(
      { error: "Failed to fetch daily trackers" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = DailyTrackerSchema.parse(body);

    // Check if daily tracker already exists for this user and date
    const { data: existing, error: fetchError } = await supabase
      .from('daily_trackers')
      .select('*')
      .eq('userId', validatedData.userId)
      .eq('date', validatedData.date)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error("Fetch error:", fetchError);
      return NextResponse.json(
        { error: "Failed to check existing tracker", details: fetchError.message },
        { status: 500 }
      );
    }

    if (existing) {
      // Update existing tracker
      const { data, error } = await supabase
        .from('daily_trackers')
        .update({
          deepWorkDone: validatedData.deepWorkDone,
          gymDone: validatedData.gymDone,
          contentDone: validatedData.contentDone,
          ecommerceDone: validatedData.ecommerceDone,
          printerDone: validatedData.printerDone,
          sleepBefore11: validatedData.sleepBefore11,
          wake530: validatedData.wake530,
          mood: validatedData.mood,
          notes: validatedData.notes,
          updatedAt: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        console.error("Update error:", error);
        return NextResponse.json(
          { error: "Failed to update daily tracker", details: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json(data);
    } else {
      // Create new tracker
      const { data, error } = await supabase
        .from('daily_trackers')
        .insert({
          userId: validatedData.userId,
          date: validatedData.date,
          day: validatedData.day,
          deepWorkDone: validatedData.deepWorkDone,
          gymDone: validatedData.gymDone,
          contentDone: validatedData.contentDone,
          ecommerceDone: validatedData.ecommerceDone,
          printerDone: validatedData.printerDone,
          sleepBefore11: validatedData.sleepBefore11,
          wake530: validatedData.wake530,
          mood: validatedData.mood,
          notes: validatedData.notes,
        })
        .select()
        .single();

      if (error) {
        console.error("Insert error:", error);
        return NextResponse.json(
          { error: "Failed to create daily tracker", details: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json(data);
    }
  } catch (error) {
    console.error("Error creating/updating daily tracker:", error);
    return NextResponse.json(
      { error: "Failed to create/update daily tracker" },
      { status: 500 }
    );
  }
}
