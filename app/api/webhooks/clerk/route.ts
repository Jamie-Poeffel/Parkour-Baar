import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { requestLogger as logger } from "@/lib/axiom/request-logger";
import { startTimer, getDurationMs } from "@/lib/axiom/timing";

type ClerkEvent = {
  type: string;
  data: Record<string, unknown>;
};

export async function POST(req: Request) {
  const start = startTimer();

  try {
    const secret = process.env.CLERK_WEBHOOK_SECRET;

    if (!secret) {
      await logger.error("webhook:clerk:missing-secret", {
        durationMs: getDurationMs(start),
      });

      return new NextResponse("Webhook secret not configured", {
        status: 500,
      });
    }

    const headersList = await headers();
    const svixId = headersList.get("svix-id");
    const svixTimestamp = headersList.get("svix-timestamp");
    const svixSignature = headersList.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
      await logger.warn("webhook:clerk:missing-headers", {
        durationMs: getDurationMs(start),
      });

      return new NextResponse("Missing svix headers", {
        status: 400,
      });
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
      await logger.warn("webhook:clerk:invalid-signature", {
        durationMs: getDurationMs(start),
      });

      return new NextResponse("Invalid signature", {
        status: 400,
      });
    }

    const { type, data } = event;

    const fields = {
      durationMs: getDurationMs(start),
    };

    if (type === "session.created") {
      await logger.info("auth:session.created", {
        userId: data.user_id,
        sessionId: data.id,
        clientId: data.client_id,
        status: data.status,
        ...fields,
      });
    } else if (type === "session.ended") {
      await logger.info("auth:session.ended", {
        userId: data.user_id,
        sessionId: data.id,
        clientId: data.client_id,
        status: data.status,
        ...fields,
      });
    } else if (type === "session.pending") {
      await logger.info("auth:session.pending", {
        userId: data.user_id,
        sessionId: data.id,
        clientId: data.client_id,
        status: data.status,
        ...fields,
      });
    } else if (type === "session.removed") {
      await logger.info("auth:session.removed", {
        userId: data.user_id,
        sessionId: data.id,
        clientId: data.client_id,
        ...fields,
      });
    } else if (type === "session.revoked") {
      await logger.info("auth:session.revoked", {
        userId: data.user_id,
        sessionId: data.id,
        clientId: data.client_id,
        ...fields,
      });
    } else if (type === "email.created") {
      await logger.info("auth:email.created", {
        userId: data.user_id,
        emailAddressId: data.email_address_id,
        slug: data.slug,
        status: data.status,
        ...fields,
      });
    } else if (type === "user.created") {
      await logger.info("auth:user.created", {
        userId: data.id,
        email: (data.email_addresses as Array<{ email_address: string }>)?.[0]
          ?.email_address,
        firstName: data.first_name,
        lastName: data.last_name,
        ...fields,
      });
    } else if (type === "user.updated") {
      await logger.info("auth:user.updated", {
        userId: data.id,
        email: (data.email_addresses as Array<{ email_address: string }>)?.[0]
          ?.email_address,
        firstName: data.first_name,
        lastName: data.last_name,
        ...fields,
      });
    } else if (type === "user.deleted") {
      await logger.info("auth:user.deleted", {
        userId: data.id,
        deleted: data.deleted,
        ...fields,
      });
    } else {
      await logger.info("webhook:clerk:unhandled-event", {
        eventType: type,
        ...fields,
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    await logger.error("webhook:clerk:failed", {
      error: error instanceof Error ? error.message : String(error),
      durationMs: getDurationMs(start),
    });

    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
