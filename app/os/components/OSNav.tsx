"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  Users,
  FolderKanban,
  CalendarDays,
  Settings,
  LogOut,
} from "lucide-react";

const navigation = [
  {
    href: "/os",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/os/leads",
    label: "Lead Inbox",
    icon: Inbox,
  },
  {
    href: "/os/clients",
    label: "Clients",
    icon: Users,
  },
  {
    href: "/os/projects",
    label: "Projects",
    icon: FolderKanban,
  },
  {
    href: "/os/bookings",
    label: "Private Bookings",
    icon: CalendarDays,
  },
];

export default function OSNav() {
  const pathname = usePathname();

  return (
    <aside className="lbmOsSidebar">
      <div className="lbmOsBrand">
        <div className="lbmOsBrandMark">LB</div>

        <div>
          <strong>LITTLE BRUSH</strong>
          <span>MASTERS</span>
        </div>
      </div>

      <div className="lbmOsLabel">
        LBMOS · COMMAND CENTRE
      </div>

      <nav aria-label="LBMOS navigation">
        {navigation.map((item) => {
          const Icon = item.icon;

          const active =
            item.href === "/os"
              ? pathname === "/os"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`lbmOsNavItem ${
                active ? "active" : ""
              }`}
            >
              <Icon size={17} strokeWidth={1.8} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="lbmOsSidebarBottom">
        <Link
          href="/os/settings"
          className={`lbmOsNavItem ${
            pathname.startsWith("/os/settings")
              ? "active"
              : ""
          }`}
        >
          <Settings size={17} />
          <span>Settings</span>
        </Link>

        <Link
          href="/os/logout"
          className="lbmOsNavItem"
        >
          <LogOut size={17} />
          <span>Logout</span>
        </Link>
      </div>
    </aside>
  );
}
