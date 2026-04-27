export type Role = "admin" | "member";

export type Permission =
  | "dashboard:access"
  | "dashboard:edit"
  | "mitglieder:access";

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: ["dashboard:access", "dashboard:edit", "mitglieder:access"],
  member: ["mitglieder:access"],
};

export function hasPermission(
  role: string | null | undefined,
  permission: Permission
): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role as Role]?.includes(permission) ?? false;
}

export function getRole(
  publicMetadata: Record<string, unknown> | null | undefined
): Role {
  const role = publicMetadata?.role;
  if (role === "admin") return "admin";
  return "member";
}
