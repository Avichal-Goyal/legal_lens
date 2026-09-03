import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";

export async function GET() {
  const startedAt = Date.now();
  const timestamp = new Date().toISOString();

  try {
    const mongoose = await dbConnect();

    // Confirms that the database is reachable now, not merely cached.
    await mongoose.connection.db.admin().ping();

    return NextResponse.json(
      {
        status: "ok",
        timestamp,
        durationMs: Date.now() - startedAt,
        checks: {
          mongodb: "ok",
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      JSON.stringify({
        level: "error",
        event: "health_check_failed",
        timestamp,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    );

    return NextResponse.json(
      {
        status: "error",
        timestamp,
        durationMs: Date.now() - startedAt,
        checks: {
          mongodb: "error",
        },
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}