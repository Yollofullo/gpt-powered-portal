// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="jest" />
import { getRedirectPath } from '../lib/authRedirect';

describe('getRedirectPath', () => {
  it('redirects to /login if session is falsy', () => {
    expect(getRedirectPath({ session: null, pathname: '/admin/dashboard' })).toBe('/login');
  });

  it('redirects to /login if userRole is missing', () => {
    const session = { user: { user_metadata: {} } };
    expect(getRedirectPath({ session, pathname: '/admin/dashboard' })).toBe('/login');
  });

  it('redirects to /access-denied if role does not match route', () => {
    const session = { user: { user_metadata: { role: 'client' } } };
    expect(getRedirectPath({ session, pathname: '/admin/dashboard' })).toBe('/access-denied');
  });

  it('returns null if session and role match route', () => {
    const session = { user: { user_metadata: { role: 'admin' } } };
    expect(getRedirectPath({ session, pathname: '/admin/dashboard' })).toBeNull();
  });

  it('returns null for non-protected route', () => {
    const session = { user: { user_metadata: { role: 'admin' } } };
    expect(getRedirectPath({ session, pathname: '/public' })).toBeNull();
  });
});
