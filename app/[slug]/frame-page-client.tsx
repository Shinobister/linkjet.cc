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
      <Header />
      <main className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between gap-2 px-4 py-2.5 border-b border-border bg-card text-sm">
          <span className="text-muted truncate flex items-center gap-1.5 min-w-0">
            <span className="text-text font-medium shrink-0">
              linkjet.cc/{slug}
            </span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 text-border"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
            <span className="truncate text-muted">{originalUrl}</span>
          </span>
          <a
            href={originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-accent hover:text-accent-hover transition-colors text-xs font-medium"
          >
            Open in new tab
          </a>
        </div>
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
