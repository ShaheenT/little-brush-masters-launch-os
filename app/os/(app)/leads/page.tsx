import Link from "next/link";
import {
  HoverBorderButton,
  MagneticLink,
  MovingBorderLink,
} from "../../components/LBMOSInteractive";

const demoLeads = [
  {
    name: "Sarah Williams",
    child: "Maya",
    age: 8,
    status: "New",
    source: "Website",
  },
  {
    name: "Nadia Petersen",
    child: "Leo",
    age: 7,
    status: "Qualified",
    source: "Instagram",
  },
  {
    name: "Ayesha Daniels",
    child: "Zara",
    age: 10,
    status: "New",
    source: "WhatsApp",
  },
];

export default function LeadsPage() {
  return (
    <div className="lbmAcPage">
      <header className="lbmAcPageHeader">
        <div>
          <p className="lbmAcEyebrow">LBMOS · LEAD MANAGEMENT</p>
          <h1>Lead Inbox</h1>
          <p>
            Every family enquiry, qualification and conversion in one
            premium operational workspace.
          </p>
        </div>

        <MagneticLink href="/os/leads/new">
          + New Lead
        </MagneticLink>
      </header>

      <div className="lbmAcToolbar">
        <input
          className="lbmAcSearch"
          placeholder="Search families, children or enquiries..."
          aria-label="Search leads"
        />

        <HoverBorderButton type="button">All</HoverBorderButton>
        <HoverBorderButton type="button">New</HoverBorderButton>
        <HoverBorderButton type="button">Qualified</HoverBorderButton>
      </div>

      <section className="lbmAcGrid">
        {demoLeads.map((lead) => (
          <article className="lbmAcCard" key={lead.name}>
            <div className="lbmAcCardTop">
              <div>
                <p className="lbmAcEyebrow">FAMILY ENQUIRY</p>
                <h3>{lead.name}</h3>
                <div className="lbmAcMeta">
                  {lead.child} · age {lead.age} · {lead.source}
                </div>
              </div>

              <span
                className={`lbmAcBadge ${
                  lead.status === "Qualified" ? "gold" : ""
                }`}
              >
                {lead.status}
              </span>
            </div>

            <p className="lbmAcMeta">
              Private Little Brush Masters experience enquiry.
            </p>

            <div className="lbmAcCardFooter">
              <span className="lbmAcMeta">18 Aug 2026</span>

              {lead.status === "Qualified" ? (
                <MovingBorderLink href="/os/leads/convert">
                  Convert
                </MovingBorderLink>
              ) : (
                <Link
                  href="/os/leads/new"
                  className="lbmOsButton secondary"
                >
                  View Lead
                </Link>
              )}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
