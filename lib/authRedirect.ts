// Pure function for session/role/route validation
export function getRedirectPath({ session, pathname }: { session: any, pathname: string }): string | null {
  if (!session) return '/login';
  const userRole = session.user?.user_metadata?.role;
  if (!userRole) return '/login';
  const routeRoles = [
    { path: '/admin', role: 'admin' },
    { path: '/portal', role: 'client' },
    { path: '/operator', role: 'operator' },
    { path: '/client', role: 'client' },
  ];
  for (const { path, role } of routeRoles) {
    if (pathname.startsWith(path) && userRole !== role) {
      return '/access-denied';
    }
  }
  return null;
}
