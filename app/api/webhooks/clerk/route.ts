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
        logger.info("auth:session.created", {
            userId: data.user_id,
            sessionId: data.id,
            clientId: data.client_id,
            status: data.status,
        });
    } else if (type === "session.ended") {
        logger.info("auth:session.ended", {
            userId: data.user_id,
            sessionId: data.id,
            clientId: data.client_id,
            status: data.status,
        });
    } else if (type === "session.pending") {
        logger.info("auth:session.pending", {
            userId: data.user_id,
            sessionId: data.id,
            clientId: data.client_id,
            status: data.status,
        });
    } else if (type === "session.removed") {
        logger.info("auth:session.removed", {
            userId: data.user_id,
            sessionId: data.id,
            clientId: data.client_id,
        });
    } else if (type === "session.revoked") {
        logger.info("auth:session.revoked", {
            userId: data.user_id,
            sessionId: data.id,
            clientId: data.client_id,
        });
    } else if (type === "email.created") {
        logger.info("auth:email.created", {
            userId: data.user_id,
            emailAddressId: data.email_address_id,
            slug: data.slug,
            status: data.status,
        });
    } else if (type === "user.created") {
        logger.info("auth:user.created", {
            userId: data.id,
            email: (data.email_addresses as Array<{ email_address: string }>)?.[0]?.email_address,
            firstName: data.first_name,
            lastName: data.last_name,
        });
    } else if (type === "user.updated") {
        logger.info("auth:user.updated", {
            userId: data.id,
            email: (data.email_addresses as Array<{ email_address: string }>)?.[0]?.email_address,
            firstName: data.first_name,
            lastName: data.last_name,
        });
    } else if (type === "user.deleted") {
        logger.info("auth:user.deleted", {
            userId: data.id,
            deleted: data.deleted,
        });
    }

    await logger.flush();
    return NextResponse.json({ received: true });
}
