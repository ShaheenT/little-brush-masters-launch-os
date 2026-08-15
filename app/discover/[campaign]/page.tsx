import { redirect } from "next/navigation";

const campaigns: Record<string, string> = {
  silvertree: "estate-silvertree",
};

export default async function DiscoverPage({
  params,
}: {
  params: Promise<{ campaign: string }>;
}) {
  const { campaign } = await params;

  const source = campaigns[campaign];

  if (!source) {
    redirect("/brushy");
  }

  redirect(`/brushy?source=${encodeURIComponent(source)}`);
}