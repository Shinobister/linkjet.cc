"use client";

import Header from "@/components/header";

export default function FramePageClient({
  originalUrl,
  slug,
}: {
  originalUrl: string;
  slug: string;
}) {
  return (
    <>
      <Header slug={slug} originalUrl={originalUrl} />
      <main className="flex-1 flex flex-col min-h-0">
        <iframe
          src={originalUrl}
          className="flex-1 w-full"
          title={originalUrl}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
        />
      </main>
    </>
  );
}
