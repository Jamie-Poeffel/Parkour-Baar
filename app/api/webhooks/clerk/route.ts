import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { logger } from "@/lib/axiom/server";

type ClerkEvent = {
    type: string;
    data: Record<string, unknown>;
};

export async function POST(req: Request) {
    const secret = process.env.CLERK_WEBHOOK_SECRET;
    if (!secret) {
        logger.error("webhook:clerk:missing-secret", {});
        await logger.flush();
        return new NextResponse("Webhook secret not configured", { status: 500 });
    }

    const headersList = await headers();
    const svixId = headersList.get("svix-id");
    const svixTimestamp = headersList.get("svix-timestamp");
    const svixSignature = headersList.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
        return new NextResponse("Missing svix headers", { status: 400 });
    }

    const body = await req.text();
    const wh = new Webhook(secret);

    let event: ClerkEvent;
    try {
        event = wh.verify(body, {
            "svix-id": svixId,
            "svix-timestamp": svixTimestamp,
            "svix-signature": svixSignature,
        }) as ClerkEvent;
    } catch {
        return new NextResponse("Invalid signature", { status: 400 });
    }

    const { type, data } = event;

    if (type === "session.created") {
        logger.info("auth:login", {
            userId: data.user_id,
            sessionId: data.id,
            clientId: data.client_id,
            status: data.status,
        });
    } else if (type === "session.ended" || type === "session.removed" || type === "session.revoked") {
        logger.info("auth:logout", {
            userId: data.user_id,
            sessionId: data.id,
            clientId: data.client_id,
            status: data.status,
            eventType: type,
        });
    }

    await logger.flush();
    return NextResponse.json({ received: true });
}
