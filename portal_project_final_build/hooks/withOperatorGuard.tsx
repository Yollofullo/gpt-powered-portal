import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';

export function withOperatorGuard<P extends object>(Component: React.ComponentType<P>) {
  return function OperatorGuarded(props: P) {
    const router = useRouter();
    const { user, loading } = useUser();
    console.log('🔍 [withOperatorGuard.tsx] const { user, loading } = useUser();');

    useEffect(() => {
      if (loading) return;
      if (user?.role !== 'operator') {
        router.replace('/login');
      }
    }, [user, loading, router]);

    if (loading) return null;
    if (user?.role !== 'operator') return null;
    console.log('🔍 [withOperatorGuard.tsx] if (user?.role !== 'operator') return null;');
    return <Component {...props} />;
  };
}
