import React, { ReactNode, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import TabBar from "./TabBar";
import { useUser } from "../hooks/useUser";
import { usePathname } from "next/navigation";

interface ResponsivePortalLayoutProps {
  children: ReactNode;
}

// Custom hook for media query
function useMediaQuery(query: string): boolean {
console.log('🔍 [ResponsivePortalLayout.tsx] Entering function: function useMediaQuery');
  const [matches, setMatches] = useState(false);
  console.log('🔍 [ResponsivePortalLayout.tsx] const [matches, setMatches] = useState(false);');

  useEffect(() => {
    const media = window.matchMedia(query);
    console.log('🔍 [ResponsivePortalLayout.tsx] const media = window.matchMedia(query);');
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    console.log('🔍 [ResponsivePortalLayout.tsx] const listener = () => setMatches(media.matches);');
    console.log('🔍 [ResponsivePortalLayout.tsx] Entering function: const listener = ');
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
    console.log('🔍 [ResponsivePortalLayout.tsx] return () => media.removeEventListener("change", listener);');
  }, [matches, query]);

  return matches;
}

const ResponsivePortalLayout: React.FC<ResponsivePortalLayoutProps> = ({ children }) => {
console.log('🔍 [ResponsivePortalLayout.tsx] Entering function: const ResponsivePortalLayout: React.FC<ResponsivePortalLayoutProps> = ');
  const { user } = useUser();
  console.log('🔍 [ResponsivePortalLayout.tsx] const { user } = useUser();');
  const pathname = usePathname();
  console.log('🔍 [ResponsivePortalLayout.tsx] const pathname = usePathname();');
  const isDesktop = useMediaQuery("(min-width: 768px)");
  console.log('🔍 [ResponsivePortalLayout.tsx] const isDesktop = useMediaQuery("(min-width: 768px)");');
  const isMobile = useMediaQuery("(max-width: 767px)");
  console.log('🔍 [ResponsivePortalLayout.tsx] const isMobile = useMediaQuery("(max-width: 767px)");');
  const role = user?.role;
  console.log('🔍 [ResponsivePortalLayout.tsx] const role = user?.role;');

  // Desktop operator: sidebar + content
  if (isDesktop && role === "operator") {
    return (
      <div className="min-h-screen w-full flex flex-row">
        <Sidebar activePath={pathname ?? undefined} />
        <main className="flex-1 overflow-y-auto h-screen bg-white dark:bg-gray-950">{children}</main>
      </div>
    );
  }

  // Mobile client: content + tab bar
  if (isMobile && role === "client") {
    return (
      <div className="min-h-screen w-full flex flex-col bg-white dark:bg-gray-950 pb-16">
        <main className="flex-1 overflow-y-auto px-2 pt-2">{children}</main>
        <TabBar />
      </div>
    );
  }

  // Fallback: just content
  return (
    <div className="min-h-screen w-full flex flex-col bg-white dark:bg-gray-950">
      <main className="flex-1 overflow-y-auto p-4">{children}</main>
    </div>
  );
};

export default ResponsivePortalLayout;
