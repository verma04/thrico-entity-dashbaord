import { DomainDetail } from "@/components/settings/domains/domain-detail";

export default async function page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <DomainDetail id={slug} />;
}
