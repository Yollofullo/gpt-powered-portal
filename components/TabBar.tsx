import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaClipboardList, FaShoppingCart, FaUser } from "react-icons/fa";

interface TabItem {
  href: string;
  icon: React.ElementType;
  label: string;
}

const tabItems: TabItem[] = [
  { href: "/", icon: FaHome, label: "Home" },
  { href: "/orders", icon: FaClipboardList, label: "Orders" },
  { href: "/cart", icon: FaShoppingCart, label: "Cart" },
  { href: "/profile", icon: FaUser, label: "Profile" },
];

const TabBar: React.FC = () => {
console.log('🔍 [TabBar.tsx] Entering function: const TabBar: React.FC = ');
  const pathname = usePathname();
  console.log('🔍 [TabBar.tsx] const pathname = usePathname();');

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex justify-around items-center h-16 shadow-t transition-colors">
      {tabItems.map(({ href, icon: Icon, label }) => {
        const currentPath = pathname ?? "";
        console.log('🔍 [TabBar.tsx] const currentPath = pathname ?? "";');
        const isActive = currentPath === href || (href !== "/" && currentPath.startsWith(href));
        console.log('🔍 [TabBar.tsx] const isActive = currentPath === href || (href !== "/" && currentPath.startsWith(href));');
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center flex-1 py-2 transition active:scale-95 duration-100 ${
              isActive
                ? "text-blue-600 dark:text-blue-400 font-semibold"
                : "text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-300"
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon className="text-xl mb-1" />
            <span className="text-xs leading-none">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default TabBar;
