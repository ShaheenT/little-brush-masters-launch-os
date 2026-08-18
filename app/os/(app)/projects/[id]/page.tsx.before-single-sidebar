import Link from "next/link";
import OSNav from "../../../components/OSNav";

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
