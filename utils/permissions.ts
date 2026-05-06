export type Role = "admin" | "member";

export enum RoleType {
  admin = "admin",
  member = "member"
}

export type Permission =
    | "dashboard:access"
    | "dashboard:edit"
    | "mitglieder:access"
    | "teilnehmerliste:access";

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
    admin: [
        "dashboard:access",
        "dashboard:edit",
        "mitglieder:access",
        "teilnehmerliste:access",
    ],
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
  if (role === "admin") return RoleType.admin;
  return RoleType.member;
}
