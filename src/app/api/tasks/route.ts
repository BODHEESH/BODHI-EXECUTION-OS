import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { z } from "zod";
import { TaskSchema } from "@/lib/schemas";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    let query = supabase.from('tasks').select('*');

    if (userId) {
      query = query.eq('userId', userId);
    }

    const { data, error } = await query.order('createdAt', { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch tasks", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = TaskSchema.parse(body);

    const insertData: any = {
        title: validatedData.title,
        category: validatedData.category,
        priority: validatedData.priority,
        status: validatedData.status,
        estimatedTime: validatedData.estimatedTime,
        owner: validatedData.owner,
        userId: validatedData.userId,
        updatedAt: new Date().toISOString(),
      };

      // Only include description if it's provided
      if (validatedData.description !== undefined && validatedData.description !== null) {
        insertData.description = validatedData.description;
      }

      // Only include dueDate if it's provided
      if (validatedData.dueDate !== undefined && validatedData.dueDate !== null) {
        insertData.dueDate = validatedData.dueDate;
      }

    const { data, error } = await supabase
      .from('tasks')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("Insert error:", error);
      return NextResponse.json(
        { error: "Failed to create task", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    const validatedData = TaskSchema.partial().parse(updateData);

    const updateFields: any = {
      ...validatedData,
      updatedAt: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('tasks')
      .update(updateFields)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Update error:", error);
      return NextResponse.json(
        { error: "Failed to update task", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Delete error:", error);
      return NextResponse.json(
        { error: "Failed to delete task", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
