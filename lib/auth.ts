import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getRole, hasPermission, type Permission } from "@/utils/permissions";
import { requestLogger } from "@/lib/axiom/request-logger";

/**
 * Server-side authorization for server actions and pages. Server actions are
 * public POST endpoints, so every one must call this instead of trusting that
 * the page that renders the button already checked the role.
 * Redirects anonymous users to /login; throws for users lacking the permission.
 */
export async function requirePermission(permission: Permission) {
  const { userId } = await auth();
  if (!userId) {
    await requestLogger.warn("auth:unauthenticated", { permission });
    redirect("/login");
  }

  const user = await currentUser();
  const role = getRole(user?.publicMetadata as Record<string, unknown>);

  if (!hasPermission(role, permission)) {
    await requestLogger.warn("auth:forbidden", { userId, role, permission });
    await requestLogger.flush();
    throw new Error("Forbidden");
  }

  return { userId, role };
}
