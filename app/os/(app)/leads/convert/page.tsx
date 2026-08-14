import Link from "next/link";
import OSNav from "../../../components/OSNav";

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
