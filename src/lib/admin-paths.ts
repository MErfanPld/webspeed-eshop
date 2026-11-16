/** Admin routes reachable without a session (login and password recovery). */
export const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/forgot-password", "/admin/reset-password"];

export function isPublicAdminPath(pathname: string | null | undefined): boolean {
  return !!pathname && PUBLIC_ADMIN_PATHS.includes(pathname);
}
