#!/bin/bash

set -e

echo "=========================================="
echo " Little Brush Masters — LBMOS Route Setup"
echo "=========================================="

BASE="app/os"

echo ""
echo "Creating LBMOS route structure..."

mkdir -p \
  "$BASE/leads/new" \
  "$BASE/leads/[id]" \
  "$BASE/leads/convert" \
  "$BASE/clients/[id]" \
  "$BASE/projects/[id]" \
  "$BASE/bookings" \
  "$BASE/settings" \
  "$BASE/components" \
  "$BASE/logout"

# --------------------------------------------------
# Shared OS navigation
# --------------------------------------------------

cat > "$BASE/components/OSNav.tsx" <<'EOF'
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
EOF

# --------------------------------------------------
# Leads
# --------------------------------------------------

cat > "$BASE/leads/page.tsx" <<'EOF'
import Link from "next/link";
import OSNav from "../components/OSNav";

export default function LeadsPage() {
  return (
    <div className="lbmOsLayout">
      <OSNav />

      <main className="lbmOsMain">
        <header className="lbmOsHeader">
          <div>
            <p className="lbmOsEyebrow">LBMOS · LEAD MANAGEMENT</p>
            <h1>Lead Inbox</h1>
            <p>
              Manage enquiries and move qualified
              families into the Little Brush Masters
              client journey.
            </p>
          </div>

          <Link
            href="/os/leads/new"
            className="lbmOsButton primary"
          >
            + New Lead
          </Link>
        </header>

        <section className="lbmOsCard">
          <div className="lbmOsEmpty">
            <InboxIcon />
            <h2>No leads yet</h2>
            <p>
              New enquiries will appear here once
              connected to your Supabase lead pipeline.
            </p>

            <Link
              href="/os/leads/new"
              className="lbmOsButton primary"
            >
              Create first lead
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

function InboxIcon() {
  return (
    <div className="lbmOsEmptyIcon">
      ✦
    </div>
  );
}
EOF

cat > "$BASE/leads/new/page.tsx" <<'EOF'
"use client";

import { useState } from "react";
import Link from "next/link";
import OSNav from "../../components/OSNav";

export default function NewLeadPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="lbmOsLayout">
      <OSNav />

      <main className="lbmOsMain">
        <header className="lbmOsHeader">
          <div>
            <p className="lbmOsEyebrow">
              LBMOS · LEADS
            </p>
            <h1>New Lead</h1>
            <p>
              Capture a new family enquiry.
            </p>
          </div>

          <Link
            href="/os/leads"
            className="lbmOsButton secondary"
          >
            Back to leads
          </Link>
        </header>

        <section className="lbmOsCard">
          <form
            onSubmit={handleSubmit}
            className="lbmOsForm"
          >
            <label>
              Parent / Guardian name
              <input
                name="full_name"
                required
                placeholder="Full name"
              />
            </label>

            <label>
              Email
              <input
                name="email"
                type="email"
                placeholder="parent@example.com"
              />
            </label>

            <label>
              WhatsApp / Phone
              <input
                name="phone"
                placeholder="+27..."
              />
            </label>

            <label>
              Child's name
              <input
                name="child_name"
                placeholder="Child's name"
              />
            </label>

            <label>
              Enquiry
              <textarea
                name="message"
                rows={5}
                placeholder="Tell us about the project..."
              />
            </label>

            {submitted && (
              <div className="lbmOsSuccess">
                Lead captured locally. Supabase
                persistence will be connected next.
              </div>
            )}

            <button
              type="submit"
              className="lbmOsButton primary"
            >
              Create Lead
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
EOF

cat > "$BASE/leads/[id]/page.tsx" <<'EOF'
import Link from "next/link";
import OSNav from "../../components/OSNav";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function LeadDetailsPage({
  params,
}: Props) {
  const { id } = await params;

  return (
    <div className="lbmOsLayout">
      <OSNav />

      <main className="lbmOsMain">
        <header className="lbmOsHeader">
          <div>
            <p className="lbmOsEyebrow">
              LBMOS · LEAD
            </p>
            <h1>Lead Details</h1>
            <p>Lead reference: {id}</p>
          </div>

          <Link
            href="/os/leads"
            className="lbmOsButton secondary"
          >
            Back to leads
          </Link>
        </header>

        <section className="lbmOsCard">
          <h2>Lead information</h2>
          <p>
            This record is ready to be connected to
            the Supabase `leads` table.
          </p>
        </section>
      </main>
    </div>
  );
}
EOF

cat > "$BASE/leads/convert/page.tsx" <<'EOF'
import Link from "next/link";
import OSNav from "../../components/OSNav";

export default function ConvertLeadPage() {
  return (
    <div className="lbmOsLayout">
      <OSNav />

      <main className="lbmOsMain">
        <header className="lbmOsHeader">
          <div>
            <p className="lbmOsEyebrow">
              LBMOS · LEAD CONVERSION
            </p>
            <h1>Convert Lead</h1>
            <p>
              Convert a qualified lead into a client.
            </p>
          </div>
        </header>

        <section className="lbmOsCard">
          <h2>Client conversion</h2>
          <p>
            Select a qualified lead to create the
            corresponding client record.
          </p>

          <Link
            href="/os/leads"
            className="lbmOsButton primary"
          >
            Return to Lead Inbox
          </Link>
        </section>
      </main>
    </div>
  );
}
EOF

# --------------------------------------------------
# Clients
# --------------------------------------------------

cat > "$BASE/clients/page.tsx" <<'EOF'
import Link from "next/link";
import OSNav from "../components/OSNav";

export default function ClientsPage() {
  return (
    <div className="lbmOsLayout">
      <OSNav />

      <main className="lbmOsMain">
        <header className="lbmOsHeader">
          <div>
            <p className="lbmOsEyebrow">
              LBMOS · RELATIONSHIPS
            </p>
            <h1>Clients</h1>
            <p>
              Manage Little Brush Masters families and
              client relationships.
            </p>
          </div>
        </header>

        <section className="lbmOsCard">
          <div className="lbmOsEmpty">
            <div className="lbmOsEmptyIcon">♡</div>
            <h2>No clients yet</h2>
            <p>
              Converted leads will appear here.
            </p>

            <Link
              href="/os/leads"
              className="lbmOsButton primary"
            >
              View Lead Inbox
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
EOF

cat > "$BASE/clients/[id]/page.tsx" <<'EOF'
import Link from "next/link";
import OSNav from "../../components/OSNav";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ClientDetailsPage({
  params,
}: Props) {
  const { id } = await params;

  return (
    <div className="lbmOsLayout">
      <OSNav />

      <main className="lbmOsMain">
        <header className="lbmOsHeader">
          <div>
            <p className="lbmOsEyebrow">
              LBMOS · CLIENT
            </p>
            <h1>Client Details</h1>
            <p>Client reference: {id}</p>
          </div>

          <Link
            href="/os/clients"
            className="lbmOsButton secondary"
          >
            Back to clients
          </Link>
        </header>

        <section className="lbmOsCard">
          <h2>Client profile</h2>
          <p>
            This profile is ready to be connected to
            the Supabase `clients` table.
          </p>
        </section>
      </main>
    </div>
  );
}
EOF

# --------------------------------------------------
# Projects
# --------------------------------------------------

cat > "$BASE/projects/page.tsx" <<'EOF'
import Link from "next/link";
import OSNav from "../components/OSNav";

export default function ProjectsPage() {
  return (
    <div className="lbmOsLayout">
      <OSNav />

      <main className="lbmOsMain">
        <header className="lbmOsHeader">
          <div>
            <p className="lbmOsEyebrow">
              LBMOS · DELIVERY
            </p>
            <h1>Projects</h1>
            <p>
              Track every Little Brush Masters
              childhood project from booking to completion.
            </p>
          </div>
        </header>

        <section className="lbmOsCard">
          <div className="lbmOsEmpty">
            <div className="lbmOsEmptyIcon">✎</div>
            <h2>No projects yet</h2>
            <p>
              Client projects will appear here once
              created.
            </p>

            <Link
              href="/os/bookings"
              className="lbmOsButton primary"
            >
              View bookings
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
EOF

cat > "$BASE/projects/[id]/page.tsx" <<'EOF'
import Link from "next/link";
import OSNav from "../../components/OSNav";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProjectDetailsPage({
  params,
}: Props) {
  const { id } = await params;

  return (
    <div className="lbmOsLayout">
      <OSNav />

      <main className="lbmOsMain">
        <header className="lbmOsHeader">
          <div>
            <p className="lbmOsEyebrow">
              LBMOS · PROJECT
            </p>
            <h1>Project Details</h1>
            <p>Project reference: {id}</p>
          </div>

          <Link
            href="/os/projects"
            className="lbmOsButton secondary"
          >
            Back to projects
          </Link>
        </header>

        <section className="lbmOsCard">
          <h2>Project workspace</h2>
          <p>
            Project milestones, client information,
            booking information and delivery status
            will be managed here.
          </p>
        </section>
      </main>
    </div>
  );
}
EOF

# --------------------------------------------------
# Bookings
# --------------------------------------------------

cat > "$BASE/bookings/page.tsx" <<'EOF'
import OSNav from "../components/OSNav";

export default function BookingsPage() {
  return (
    <div className="lbmOsLayout">
      <OSNav />

      <main className="lbmOsMain">
        <header className="lbmOsHeader">
          <div>
            <p className="lbmOsEyebrow">
              LBMOS · PRIVATE EXPERIENCES
            </p>
            <h1>Private Bookings</h1>
            <p>
              Manage the Little Brush Masters private
              childhood experience calendar.
            </p>
          </div>
        </header>

        <section className="lbmOsStats">
          <div className="lbmOsStat">
            <span>Upcoming</span>
            <strong>0</strong>
          </div>

          <div className="lbmOsStat">
            <span>This month</span>
            <strong>0</strong>
          </div>

          <div className="lbmOsStat">
            <span>Capacity</span>
            <strong>Limited</strong>
          </div>
        </section>

        <section className="lbmOsCard">
          <div className="lbmOsEmpty">
            <div className="lbmOsEmptyIcon">◷</div>
            <h2>No private bookings</h2>
            <p>
              Confirmed experiences will appear here.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
EOF

# --------------------------------------------------
# Settings
# --------------------------------------------------

cat > "$BASE/settings/page.tsx" <<'EOF'
import OSNav from "../components/OSNav";

export default function SettingsPage() {
  return (
    <div className="lbmOsLayout">
      <OSNav />

      <main className="lbmOsMain">
        <header className="lbmOsHeader">
          <div>
            <p className="lbmOsEyebrow">
              LBMOS · ADMINISTRATION
            </p>
            <h1>Settings</h1>
            <p>
              Configure the Little Brush Masters
              operating system.
            </p>
          </div>
        </header>

        <section className="lbmOsCard">
          <h2>System settings</h2>
          <p>
            Account, notifications, business
            configuration and integrations will be
            managed here.
          </p>
        </section>
      </main>
    </div>
  );
}
EOF

# --------------------------------------------------
# Logout
# --------------------------------------------------

cat > "$BASE/logout/page.tsx" <<'EOF'
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/os");
  }, [router]);

  return (
    <main className="lbmOsLogout">
      <p>Signing out…</p>
    </main>
  );
}
EOF

# --------------------------------------------------
# Styling
# --------------------------------------------------

cat > "$BASE/os.css" <<'EOF'
.lbmOsLayout {
  min-height: 100vh;
  display: flex;
  background: #f8f5ef;
  color: #202634;
}

.lbmOsSidebar {
  width: 250px;
  min-height: 100vh;
  background: #1e2a44;
  color: white;
  padding: 28px 18px;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
}

.lbmOsBrand {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 4px 10px 25px;
}

.lbmOsBrandMark {
  width: 38px;
  height: 38px;
  border: 1px solid rgba(255,255,255,.25);
  display: grid;
  place-items: center;
  font-weight: 700;
  letter-spacing: .04em;
}

.lbmOsBrand strong,
.lbmOsBrand span {
  display: block;
  font-size: 10px;
  letter-spacing: .15em;
}

.lbmOsBrand span {
  opacity: .65;
  margin-top: 3px;
}

.lbmOsLabel {
  font-size: 9px;
  letter-spacing: .16em;
  color: rgba(255,255,255,.45);
  padding: 0 10px 15px;
}

.lbmOsSidebar nav {
  display: grid;
  gap: 4px;
}

.lbmOsNavItem {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 12px;
  color: rgba(255,255,255,.68);
  font-size: 13px;
  transition: .2s ease;
}

.lbmOsNavItem:hover,
.lbmOsNavItem.active {
  background: rgba(255,255,255,.1);
  color: white;
}

.lbmOsSidebarBottom {
  margin-top: auto;
  display: grid;
  gap: 4px;
  padding-top: 20px;
  border-top: 1px solid rgba(255,255,255,.1);
}

.lbmOsMain {
  width: 100%;
  max-width: 1500px;
  margin: 0 auto;
  padding: 55px 6vw 90px;
}

.lbmOsHeader {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 30px;
  margin-bottom: 42px;
}

.lbmOsEyebrow {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .18em;
  color: #a47c12;
  margin: 0 0 12px;
}

.lbmOsHeader h1 {
  font-size: clamp(38px, 5vw, 64px);
  line-height: .98;
  letter-spacing: -.045em;
  margin: 0 0 14px;
  font-weight: 600;
}

.lbmOsHeader p:last-child {
  max-width: 650px;
  color: #6d7280;
  line-height: 1.6;
  margin: 0;
}

.lbmOsCard {
  background: white;
  border: 1px solid #ddd9d0;
  padding: 32px;
}

.lbmOsCard h2 {
  margin-top: 0;
  letter-spacing: -.02em;
}

.lbmOsCard p {
  color: #6d7280;
  line-height: 1.65;
}

.lbmOsEmpty {
  min-height: 330px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
}

.lbmOsEmptyIcon {
  width: 54px;
  height: 54px;
  border: 1px solid #ddd9d0;
  display: grid;
  place-items: center;
  margin-bottom: 20px;
  font-size: 20px;
}

.lbmOsEmpty h2 {
  margin: 0 0 8px;
}

.lbmOsEmpty p {
  max-width: 460px;
  margin: 0 0 25px;
}

.lbmOsButton {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 18px;
  border: 0;
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
}

.lbmOsButton.primary {
  background: #d4af37;
  color: #171717;
}

.lbmOsButton.secondary {
  background: #1e2a44;
  color: white;
}

.lbmOsForm {
  display: grid;
  gap: 22px;
  max-width: 760px;
}

.lbmOsForm label {
  display: grid;
  gap: 7px;
  font-size: 12px;
  font-weight: 700;
}

.lbmOsForm input,
.lbmOsForm textarea {
  width: 100%;
  padding: 13px 14px;
  border: 1px solid #ccc9c1;
  background: #fff;
  color: #202634;
  font: inherit;
}

.lbmOsForm input:focus,
.lbmOsForm textarea:focus {
  outline: 2px solid rgba(212,175,55,.35);
  border-color: #d4af37;
}

.lbmOsSuccess {
  padding: 13px;
  background: #e8eee4;
  font-size: 13px;
}

.lbmOsStats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin-bottom: 25px;
}

.lbmOsStat {
  background: white;
  border: 1px solid #ddd9d0;
  padding: 25px;
}

.lbmOsStat span {
  display: block;
  color: #6d7280;
  font-size: 12px;
  margin-bottom: 12px;
}

.lbmOsStat strong {
  font-size: 30px;
  letter-spacing: -.03em;
}

.lbmOsLogout {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #f8f5ef;
}

@media (max-width: 850px) {
  .lbmOsSidebar {
    width: 210px;
  }

  .lbmOsHeader {
    align-items: flex-start;
    flex-direction: column;
  }

  .lbmOsStats {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 650px) {
  .lbmOsLayout {
    display: block;
  }

  .lbmOsSidebar {
    position: relative;
    width: 100%;
    height: auto;
    min-height: auto;
  }

  .lbmOsSidebarBottom {
    margin-top: 20px;
  }

  .lbmOsMain {
    padding: 40px 20px 70px;
  }
}
EOF

echo ""
echo "=========================================="
echo " LBMOS route structure created successfully"
echo "=========================================="
echo ""

find "$BASE" \
  -type f \
  -print \
  | sort

echo ""
echo "Next:"
echo "1. npm run build"
echo "2. Fix any existing route conflicts"
echo "3. Connect these pages to Supabase"
echo ""
