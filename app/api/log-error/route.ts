import { NextResponse } from "next/server";
import { requestLogger } from "@/lib/axiom/request-logger";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    await requestLogger.error("app.error_boundary", {
      message: body.message,
      digest: body.digest,
      stack: body.stack,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Logging failed" }, { status: 500 });
  }
}
