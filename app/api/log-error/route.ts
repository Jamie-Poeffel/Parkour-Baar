import { NextResponse } from "next/server";
import { requestLogger } from "@/lib/axiom/request-logger";

const clip = (v: unknown, max: number) =>
    typeof v === "string" ? v.slice(0, max) : undefined;

export async function POST(req: Request) {
    try {
        const body = await req.json();

        await requestLogger.error("client.error", {
            source: clip(body.source, 100) ?? "error_boundary",
            message: clip(body.message, 1000),
            errorName: clip(body.name, 100),
            digest: clip(body.digest, 100),
            stack: clip(body.stack, 8000),
            url: clip(body.url, 500),
            filename: clip(body.filename, 500),
            line: typeof body.line === "number" ? body.line : undefined,
            origin: "browser",
        });

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Logging failed" }, { status: 500 });
    }
}
