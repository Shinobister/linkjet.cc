import { NextResponse } from "next/server";
import { saveLink } from "@/lib/storage";
import type { HistoryItem } from "@/types";

export async function POST(request: Request) {
  try {
    const item: HistoryItem = await request.json();

    if (!item.slug || !item.originalUrl) {
      return NextResponse.json(
        { error: "Slug and originalUrl are required" },
        { status: 400 }
      );
    }

    await saveLink(item);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to save link" },
      { status: 500 }
    );
  }
}
