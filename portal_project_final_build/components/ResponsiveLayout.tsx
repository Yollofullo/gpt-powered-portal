import React, { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
// To fix: Cannot find module 'react-icons/fa'
// Run: npm install react-icons
import { FaHome, FaBox, FaUser, FaCog } from 'react-icons/fa';

interface ResponsiveLayoutProps {
  children: ReactNode;
  role: 'operator' | 'client';
}

function useMediaQuery(query: string): boolean {
console.log('🔍 [ResponsiveLayout.tsx] Entering function: function useMediaQuery');
  const [matches, setMatches] = useState(false);
  console.log('🔍 [ResponsiveLayout.tsx] const [matches, setMatches] = useState(false);');
  useEffect(() => {
    const media = window.matchMedia(query);
    console.log('🔍 [ResponsiveLayout.tsx] const media = window.matchMedia(query);');
    if (media.matches !== matches) setMatches(media.matches);
    console.log('🔍 [ResponsiveLayout.tsx] if (media.matches !== matches) setMatches(media.matches);');
    const listener = () => setMatches(media.matches);
    console.log('🔍 [ResponsiveLayout.tsx] const listener = () => setMatches(media.matches);');
    console.log('🔍 [ResponsiveLayout.tsx] Entering function: const listener = ');
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
    console.log('🔍 [ResponsiveLayout.tsx] return () => media.removeEventListener('change', listener);');
  }, [matches, query]);
  return matches;
}

const sidebarLinks = [
  { href: '/dashboard/operator', label: 'Dashboard', icon: <FaHome /> },
  { href: '/dashboard/operator/warehouse', label: 'Warehouse', icon: <FaBox /> },
  { href: '/profile', label: 'Profile', icon: <FaUser /> },
  { href: '/settings', label: 'Settings', icon: <FaCog /> },
];

const tabLinks = [
  { href: '/dashboard/client', label: 'Home', icon: <FaHome /> },
  { href: '/orders', label: 'Orders', icon: <FaBox /> },
  { href: '/profile', label: 'Profile', icon: <FaUser /> },
  { href: '/settings', label: 'Settings', icon: <FaCog /> },
];

export default function ResponsiveLayout({ children, role }: ResponsiveLayoutProps) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  console.log('🔍 [ResponsiveLayout.tsx] const isDesktop = useMediaQuery('(min-width: 1024px)');');
  const pathname = usePathname();
  console.log('🔍 [ResponsiveLayout.tsx] const pathname = usePathname();');

  // Dark mode support
  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  if (role === 'operator' && isDesktop) {
    // Desktop sidebar layout
    return (
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
        <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg flex flex-col">
          <div className="h-16 flex items-center justify-center font-bold text-xl border-b dark:border-gray-700 dark:text-white">Operator Portal</div>
          <nav className="flex-1 py-4">
            <ul className="space-y-2">
              {sidebarLinks.map(link => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={`flex items-center px-6 py-3 rounded-lg transition-colors font-medium text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-700 ${pathname === link.href ? 'bg-blue-100 dark:bg-gray-700 font-bold' : ''}`}
                  >
                    <span className="mr-3 text-lg">{link.icon}</span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    );
  }

  // Mobile client layout with bottom tab bar
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="flex-1 pb-16 pt-4 px-2">{children}</main>
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-t dark:border-gray-700 flex justify-around items-center z-50 shadow-lg">
        {tabLinks.map(link => (
          <a
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center justify-center text-xs text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition ${pathname === link.href ? 'text-blue-600 dark:text-blue-400 font-bold' : ''}`}
          >
            <span className="text-xl mb-1">{link.icon}</span>
            {link.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
