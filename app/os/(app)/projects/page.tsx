import Link from "next/link";
import {
  MagneticLink,
  MovingBorderLink,
  HoverBorderButton,
} from "../../components/LBMOSInteractive";

const projects = [
  {
    id: "maya-ocean-adventure",
    name: "Maya's Ocean Adventure",
    family: "Williams Family",
    progress: 70,
    status: "Preparation",
    date: "24 Aug 2026",
  },
  {
    id: "leo-space-room",
    name: "Leo's Space Room",
    family: "Petersen Family",
    progress: 42,
    status: "Booked",
    date: "30 Aug 2026",
  },
];

export default function ProjectsPage() {
  return (
    <div className="lbmAcPage">
      <header className="lbmAcPageHeader">
        <div>
          <p className="lbmAcEyebrow">LBMOS · PROJECT DELIVERY</p>
          <h1>Projects</h1>
          <p>
            Track every childhood experience from confirmation through
            completion.
          </p>
        </div>

        <MagneticLink href="/os/bookings">
          + New Project
        </MagneticLink>
      </header>

      <div className="lbmAcStats">
        <div className="lbmAcStat">
          <span>Active projects</span>
          <strong>2</strong>
        </div>
        <div className="lbmAcStat">
          <span>Preparation</span>
          <strong>1</strong>
        </div>
        <div className="lbmAcStat">
          <span>Upcoming</span>
          <strong>2</strong>
        </div>
      </div>

      <div className="lbmAcToolbar">
        <HoverBorderButton type="button">All Projects</HoverBorderButton>
        <HoverBorderButton type="button">Active</HoverBorderButton>
        <HoverBorderButton type="button">Completed</HoverBorderButton>
      </div>

      <section className="lbmAcGrid">
        {projects.map((project) => (
          <article className="lbmAcCard" key={project.id}>
            <div className="lbmAcCardTop">
              <div>
                <p className="lbmAcEyebrow">ACTIVE PROJECT</p>
                <h3>{project.name}</h3>
                <div className="lbmAcMeta">
                  {project.family} · {project.date}
                </div>
              </div>

              <span className="lbmAcBadge gold">{project.status}</span>
            </div>

            <div>
              <div className="lbmAcMeta">
                Delivery progress · {project.progress}%
              </div>
              <div
                style={{
                  height: 8,
                  marginTop: 10,
                  overflow: "hidden",
                  borderRadius: 99,
                  background: "rgba(30,42,68,.08)",
                }}
              >
                <div
                  style={{
                    width: `${project.progress}%`,
                    height: "100%",
                    borderRadius: 99,
                    background: "#d4af37",
                  }}
                />
              </div>
            </div>

            <div className="lbmAcCardFooter">
              <span className="lbmAcMeta">
                Booked → Preparation → Experience
              </span>
              <MovingBorderLink href={`/os/projects/${project.id}`}>
                Open Project
              </MovingBorderLink>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
