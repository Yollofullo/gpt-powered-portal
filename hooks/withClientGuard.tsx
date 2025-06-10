import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';

export function withClientGuard<P extends object>(Component: React.ComponentType<P>) {
  return function ClientGuarded(props: P) {
    const router = useRouter();
    const { user, loading } = useUser();
    console.log('🔍 [withClientGuard.tsx] const { user, loading } = useUser();');

    useEffect(() => {
      if (loading) return;
      if (user?.role !== 'client') {
        router.replace('/login');
      }
    }, [user, loading, router]);

    if (loading) return (
      <div className="flex justify-center items-center min-h-screen">
        <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      </div>
    );
    if (user?.role !== 'client') return null;
    console.log('🔍 [withClientGuard.tsx] if (user?.role !== 'client') return null;');
    return <Component {...props} />;
  };
}
