import { getLinkBySlug } from "@/lib/storage";
import { notFound } from "next/navigation";
import FramePageClient from "./frame-page-client";

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

  return <FramePageClient originalUrl={link.originalUrl} slug={slug} />;
}
