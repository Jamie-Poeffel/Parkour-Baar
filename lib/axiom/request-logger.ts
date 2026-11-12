import "server-only";

import { headers } from "next/headers";
import { logger } from "@/lib/axiom/server";

async function withRequestId(fields: Record<string, unknown> = {}) {
  const requestHeaders = await headers();
  const requestId = requestHeaders.get("x-request-id");

  return {
    ...fields,
    ...(requestId ? { requestId } : {}),
  };
}

export const requestLogger = {
  async info(message: string, fields: Record<string, unknown> = {}) {
    logger.info(message, await withRequestId(fields));
  },

  async warn(message: string, fields: Record<string, unknown> = {}) {
    logger.warn(message, await withRequestId(fields));
  },

  async error(message: string, fields: Record<string, unknown> = {}) {
    logger.error(message, await withRequestId(fields));
  },

  async flush() {
    await logger.flush();
  },
};
