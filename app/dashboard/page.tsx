
'use client';

import { useUserRole } from '../../components/UserRoleContext';


console.log('🔍 [Dashboard] Dashboard page loaded');
export default function Dashboard() {
  const { role, loading, error } = useUserRole();
  console.log('🔍 [page.tsx] const { role, loading, error } = useUserRole();');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  if (role === 'admin') {
    return <div><h2>Admin Dashboard</h2><p>Welcome, Admin!</p></div>;
  } else if (role === 'client') {
    return <div><h2>Client Dashboard</h2><p>Welcome, Client!</p></div>;
  } else {
    return <div><h2>Unknown Role</h2><p>Please contact support.</p></div>;
  }
}
