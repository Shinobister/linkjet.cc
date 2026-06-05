"use client";

import Header from "@/components/header";
import Hero from "@/components/hero";
import LinkForm from "@/components/link-form";
import History from "@/components/history";
import { HistoryProvider } from "@/hooks/useHistory";

export default function Home() {
  return (
    <HistoryProvider>
      <Header />
      <main className="flex-1 flex flex-col items-center px-4 pb-24">
        <Hero />
        <div className="w-full max-w-2xl space-y-6 -mt-12 relative z-10">
          <LinkForm />
          <History />
        </div>
      </main>
    </HistoryProvider>
  );
}
