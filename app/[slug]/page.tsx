import { getLinkBySlug } from "@/lib/storage";
import { notFound } from "next/navigation";
import RedirectSplash from "./redirect-splash";

export default async function SlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const link = await getLinkBySlug(slug);

  if (!link) {
    notFound();
  }

  return <RedirectSplash originalUrl={link.originalUrl} />;
}
