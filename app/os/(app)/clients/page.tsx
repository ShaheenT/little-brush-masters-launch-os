import Link from "next/link";
import { MagneticLink, HoverBorderButton } from "../../components/LBMOSInteractive";

const families = [
  {
    id: "williams-family",
    name: "Williams Family",
    child: "Maya",
    experiences: 2,
    last: "12 Aug 2026",
  },
  {
    id: "petersen-family",
    name: "Petersen Family",
    child: "Leo",
    experiences: 1,
    last: "03 Aug 2026",
  },
  {
    id: "daniels-family",
    name: "Daniels Family",
    child: "Zara",
    experiences: 3,
    last: "28 Jul 2026",
  },
];

export default function ClientsPage() {
  return (
    <div className="lbmAcPage">
      <header className="lbmAcPageHeader">
        <div>
          <p className="lbmAcEyebrow">LBMOS · RELATIONSHIPS</p>
          <h1>Clients</h1>
          <p>
            The families who have trusted Little Brush Masters to create
            something unforgettable.
          </p>
        </div>

        <MagneticLink href="/os/leads">
          + Add Client
        </MagneticLink>
      </header>

      <div className="lbmAcToolbar">
        <input
          className="lbmAcSearch"
          placeholder="Search family or child..."
          aria-label="Search clients"
        />
        <HoverBorderButton type="button">All Families</HoverBorderButton>
      </div>

      <section className="lbmAcGrid">
        {families.map((family) => (
          <article className="lbmAcCard" key={family.id}>
            <div className="lbmAcCardTop">
              <div>
                <p className="lbmAcEyebrow">FAMILY</p>
                <h3>{family.name}</h3>
                <div className="lbmAcMeta">
                  {family.child} · {family.experiences} experience
                  {family.experiences !== 1 ? "s" : ""}
                </div>
              </div>

              <span className="lbmAcBadge">ACTIVE</span>
            </div>

            <div className="lbmAcMeta">
              Last experience · {family.last}
            </div>

            <div className="lbmAcCardFooter">
              <span className="lbmAcMeta">Family relationship</span>
              <Link
                href={`/os/clients/${family.id}`}
                className="lbmOsButton secondary"
              >
                View Family
              </Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
