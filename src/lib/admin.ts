export const ADMIN_EMAIL = "hkkim9953@gmail.com";

export function isAdminEmail(email?: string | null) {
  return (email ?? "").trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
}
