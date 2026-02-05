import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const habitName = searchParams.get("habitName");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    let query = supabase
      .from('habit_streaks')
      .select('*')
      .eq('userId', userId);

    if (habitName) {
      query = query.eq('habitName', habitName);
    }

    query = query.order('currentStreak', { ascending: false });

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, habitName, completed } = body;

    if (!userId || !habitName) {
      return NextResponse.json(
        { error: "userId and habitName are required" },
        { status: 400 }
      );
    }

    // Get existing streak
    const { data: existing } = await supabase
      .from('habit_streaks')
      .select('*')
      .eq('userId', userId)
      .eq('habitName', habitName)
      .single();

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (existing) {
      const lastCompleted = existing.lastCompletedAt?.split('T')[0];
      let newStreak = existing.currentStreak;
      let newLongest = existing.longestStreak;
      let newTotal = existing.totalCompletions;

      if (completed) {
        // Check if already completed today
        if (lastCompleted === today) {
          return NextResponse.json(existing);
        }

        // Increment streak if yesterday was completed, otherwise reset to 1
        if (lastCompleted === yesterday) {
          newStreak = existing.currentStreak + 1;
        } else {
          newStreak = 1;
        }

        newTotal = existing.totalCompletions + 1;
        newLongest = Math.max(newStreak, existing.longestStreak);

        const { data, error } = await supabase
          .from('habit_streaks')
          .update({
            currentStreak: newStreak,
            longestStreak: newLongest,
            lastCompletedAt: new Date().toISOString(),
            totalCompletions: newTotal,
            updatedAt: new Date().toISOString(),
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) {
          return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
      }
    } else {
      // Create new streak
      const { data, error } = await supabase
        .from('habit_streaks')
        .insert({
          userId,
          habitName,
          currentStreak: completed ? 1 : 0,
          longestStreak: completed ? 1 : 0,
          lastCompletedAt: completed ? new Date().toISOString() : null,
          totalCompletions: completed ? 1 : 0,
        })
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(data);
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('habit_streaks')
      .update({
        ...updateData,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
