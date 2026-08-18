import Link from "next/link";

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
    <>
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
    </>
  );
}
