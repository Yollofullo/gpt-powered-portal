import React from "react";
import Link from "next/link";
import { FaHome, FaBox, FaClipboardList, FaCog } from "react-icons/fa";

// Define the type for navigation links
interface NavLink {
  href: string;
  icon: React.ElementType;
  label: string;
}

// Navigation items
const navLinks: NavLink[] = [
  { href: "/dashboard", icon: FaHome, label: "Dashboard" },
  { href: "/orders", icon: FaClipboardList, label: "Orders" },
  { href: "/inventory", icon: FaBox, label: "Inventory" },
  { href: "/settings", icon: FaCog, label: "Settings" }
];

interface SidebarProps {
  activePath?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activePath }) => {
console.log('🔍 [Sidebar.tsx] Entering function: const Sidebar: React.FC<SidebarProps> = ');
  return (
    <aside className="h-screen w-64 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 flex flex-col p-4 shadow-md">
      {/* Logo or App Title */}
      <div className="text-lg font-semibold mb-6 text-center">
        <Link href="/">
          <span className="cursor-pointer">Logistics Portal</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-4">
        {navLinks.map(({ href, icon: Icon, label }) => {
          const isActive = activePath === href || (activePath?.startsWith(href) && href !== "/");
          console.log('🔍 [Sidebar.tsx] const isActive = activePath === href || (activePath?.startsWith(href) && href !== "/");');
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 p-3 rounded-md transition ${
                isActive
                  ? "bg-blue-600 text-white dark:bg-blue-500 dark:text-white font-semibold shadow"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <Icon className="text-xl" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
