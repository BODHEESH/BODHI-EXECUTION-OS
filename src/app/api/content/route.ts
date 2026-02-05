import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { z } from "zod";
import { ContentSchema } from "@/lib/schemas";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    let query = supabase.from('content').select('*');

    if (userId) {
      query = query.eq('userId', userId);
    }

    const { data, error } = await query.order('createdAt', { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch content", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching content:", error);
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = ContentSchema.parse(body);

    const insertData: any = {
        title: validatedData.title,
        platforms: validatedData.platforms,
        type: validatedData.type,
        status: validatedData.status,
        owner: validatedData.owner,
        userId: validatedData.userId,
        updatedAt: new Date().toISOString(),
      };

      // Only include optional fields if they're provided
      if (validatedData.shootDate !== undefined && validatedData.shootDate !== null) {
        insertData.shootDate = validatedData.shootDate;
      }
      if (validatedData.publishDate !== undefined && validatedData.publishDate !== null) {
        insertData.publishDate = validatedData.publishDate;
      }
      if (validatedData.videoLink !== undefined && validatedData.videoLink !== null) {
        insertData.videoLink = validatedData.videoLink;
      }
      if (validatedData.scriptLink !== undefined && validatedData.scriptLink !== null) {
        insertData.scriptLink = validatedData.scriptLink;
      }
      if (validatedData.remarks !== undefined && validatedData.remarks !== null) {
        insertData.remarks = validatedData.remarks;
      }

    const { data, error } = await supabase
      .from('content')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("Insert error:", error);
      return NextResponse.json(
        { error: "Failed to create content", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating content:", error);
    return NextResponse.json(
      { error: "Failed to create content" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    const validatedData = ContentSchema.partial().parse(updateData);

    const updateFields: any = {
      ...validatedData,
      updatedAt: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('content')
      .update(updateFields)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Update error:", error);
      return NextResponse.json(
        { error: "Failed to update content", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating content:", error);
    return NextResponse.json(
      { error: "Failed to update content" },
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
        { error: "Content ID is required" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('content')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Delete error:", error);
      return NextResponse.json(
        { error: "Failed to delete content", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Content deleted successfully" });
  } catch (error) {
    console.error("Error deleting content:", error);
    return NextResponse.json(
      { error: "Failed to delete content" },
      { status: 500 }
    );
  }
}
