import Link from "next/link";
import OSNav from "../../../components/OSNav";

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
