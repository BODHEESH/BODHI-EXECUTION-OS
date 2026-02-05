import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { z } from "zod";
import { BusinessSchema } from "@/lib/schemas";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const monthly = searchParams.get("monthly");

    if (monthly === "profit" && userId) {
      // Calculate monthly profit for user
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
      
      const { data: monthlyOrders, error } = await supabase
        .from('business')
        .select('*')
        .eq('userId', userId)
        .like('orderDate', `${currentMonth}%`);

      if (error) {
        console.error("Supabase error:", error);
        return NextResponse.json(
          { error: "Failed to fetch monthly profit", details: error.message },
          { status: 500 }
        );
      }

      const totalRevenue = monthlyOrders.reduce((sum: number, order: any) => sum + order.amount, 0);
      const totalCost = monthlyOrders.reduce((sum: number, order: any) => sum + order.cost, 0);
      const profit = totalRevenue - totalCost;

      return NextResponse.json({ profit });
    }

    let query = supabase.from('business').select('*');

    if (userId) {
      query = query.eq('userId', userId);
    }

    const { data, error } = await query.order('orderDate', { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch business data", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching business data:", error);
    return NextResponse.json(
      { error: "Failed to fetch business data" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = BusinessSchema.parse(body);

    const insertData: any = {
        customerName: validatedData.customerName,
        businessType: validatedData.businessType,
        orderStatus: validatedData.orderStatus,
        amount: validatedData.amount,
        cost: validatedData.cost,
        profit: validatedData.profit || (validatedData.amount - validatedData.cost),
        paymentStatus: validatedData.paymentStatus,
        handledBy: validatedData.handledBy,
        userId: validatedData.userId,
        updatedAt: new Date().toISOString(),
      };

      // Only include optional fields if they're provided
      if (validatedData.deliveryDate !== undefined && validatedData.deliveryDate !== null) {
        insertData.deliveryDate = validatedData.deliveryDate;
      }
      if (validatedData.notes !== undefined && validatedData.notes !== null) {
        insertData.notes = validatedData.notes;
      }

    const { data, error } = await supabase
      .from('business')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("Insert error:", error);
      return NextResponse.json(
        { error: "Failed to create business", details: error.message, code: error.code },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating business:", error);
    return NextResponse.json(
      { error: "Failed to create business" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    const validatedData = BusinessSchema.partial().parse(updateData);

    const updateFields: any = {
      ...validatedData,
      updatedAt: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('business')
      .update(updateFields)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Update error:", error);
      return NextResponse.json(
        { error: "Failed to update business", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating business:", error);
    return NextResponse.json(
      { error: "Failed to update business" },
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
        { error: "Business ID is required" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('business')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Delete error:", error);
      return NextResponse.json(
        { error: "Failed to delete business", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Business deleted successfully" });
  } catch (error) {
    console.error("Error deleting business:", error);
    return NextResponse.json(
      { error: "Failed to delete business" },
      { status: 500 }
    );
  }
}
