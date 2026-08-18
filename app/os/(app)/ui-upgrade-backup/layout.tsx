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

import "../os.css";

export default function OsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/os") {
      return pathname === "/os";
    }

    return pathname.startsWith(href);
  };

  return (
    <div className="lbmOsLayout">
      <aside className="lbmOsSidebar">
        <div>
          <div className="lbmOsBrand">
            <div className="lbmOsBrandMark">
              LB
            </div>

            <div>
              <strong>
                LITTLE BRUSH
              </strong>

              <span>
                MASTERS
              </span>
            </div>
          </div>

          <div className="lbmOsLabel">
            LBMOS · COMMAND CENTRE
          </div>

          <nav aria-label="LBMOS navigation">
            <Link
              href="/os"
              className={`lbmOsNavItem ${
                isActive("/os")
                  ? "active"
                  : ""
              }`}
            >
              <LayoutDashboard
                size={17}
                strokeWidth={1.8}
              />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/os/leads"
              className={`lbmOsNavItem ${
                isActive("/os/leads")
                  ? "active"
                  : ""
              }`}
            >
              <Inbox
                size={17}
                strokeWidth={1.8}
              />
              <span>Lead Inbox</span>
            </Link>

            <Link
              href="/os/clients"
              className={`lbmOsNavItem ${
                isActive("/os/clients")
                  ? "active"
                  : ""
              }`}
            >
              <Users
                size={17}
                strokeWidth={1.8}
              />
              <span>Clients</span>
            </Link>

            <Link
              href="/os/projects"
              className={`lbmOsNavItem ${
                isActive("/os/projects")
                  ? "active"
                  : ""
              }`}
            >
              <FolderKanban
                size={17}
                strokeWidth={1.8}
              />
              <span>Projects</span>
            </Link>

            <Link
              href="/os/bookings"
              className={`lbmOsNavItem ${
                isActive("/os/bookings")
                  ? "active"
                  : ""
              }`}
            >
              <CalendarDays
                size={17}
                strokeWidth={1.8}
              />
              <span>Private Bookings</span>
            </Link>
          </nav>
        </div>

        <div className="lbmOsSidebarBottom">
          <Link
            href="/os/settings"
            className={`lbmOsNavItem ${
              isActive("/os/settings")
                ? "active"
                : ""
            }`}
          >
            <Settings
              size={17}
              strokeWidth={1.8}
            />
            <span>Settings</span>
          </Link>

          <Link
            href="/os/logout"
            className="lbmOsNavItem"
          >
            <LogOut
              size={17}
              strokeWidth={1.8}
            />
            <span>Logout</span>
          </Link>
        </div>
      </aside>

      <main className="lbmOsMain">
        {children}
      </main>
    </div>
  );
}
