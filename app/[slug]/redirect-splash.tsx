"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const splashStyles = `
@keyframes jet-spin {
  0%   { transform: rotate(0deg); }
  20%  { transform: rotate(360deg); }
  33%  { transform: rotate(360deg); }
  42%  { transform: rotate(380deg); }
  48%  { transform: rotate(340deg); }
  50%  { transform: rotate(360deg); }
  70%  { transform: rotate(720deg); }
  83%  { transform: rotate(720deg); }
  92%  { transform: rotate(740deg); }
  96%  { transform: rotate(700deg); }
  100% { transform: rotate(720deg); }
}
@-webkit-keyframes jet-spin {
  0%   { -webkit-transform: rotate(0deg); }
  20%  { -webkit-transform: rotate(360deg); }
  33%  { -webkit-transform: rotate(360deg); }
  42%  { -webkit-transform: rotate(380deg); }
  48%  { -webkit-transform: rotate(340deg); }
  50%  { -webkit-transform: rotate(360deg); }
  70%  { -webkit-transform: rotate(720deg); }
  83%  { -webkit-transform: rotate(720deg); }
  92%  { -webkit-transform: rotate(740deg); }
  96%  { -webkit-transform: rotate(700deg); }
  100% { -webkit-transform: rotate(720deg); }
}
@keyframes glow-pulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50%      { opacity: 0.6; transform: scale(1.15); }
}
@-webkit-keyframes glow-pulse {
  0%, 100% { opacity: 0.3; -webkit-transform: scale(1); }
  50%      { opacity: 0.6; -webkit-transform: scale(1.15); }
}
.splash-jet-spin {
  animation: jet-spin 6s ease-in-out infinite;
  -webkit-animation: jet-spin 6s ease-in-out infinite;
}
.splash-glow-pulse {
  animation: glow-pulse 4s ease-in-out infinite;
  -webkit-animation: glow-pulse 4s ease-in-out infinite;
}
`;

export default function RedirectSplash({ originalUrl }: { originalUrl: string }) {
  const [secondsLeft, setSecondsLeft] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((s) => Math.max(s - 1, 0));
    }, 1000);

    const redirect = setTimeout(() => {
      window.location.href = originalUrl;
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(redirect);
    };
  }, [originalUrl]);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-bg px-4">
      {/* Inline styles for Safari — CSS chunk may load too late on slow connections */}
      <style>{splashStyles}</style>

      {/* Background glow */}
      <div className="absolute h-72 w-72 rounded-full bg-accent/10 blur-[120px] splash-glow-pulse" />

      <motion.div
        className="relative flex flex-col items-center gap-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Jet spinner — spin, pause, waver, spin, pause, waver */}
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-card splash-jet-spin">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-accent"
          >
            <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
          </svg>
        </div>

        {/* LinkJet.cc branding */}
        <h1 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">
          Link<span className="text-accent">Jet</span>
          <span className="text-muted">.cc</span>
        </h1>

        {/* Loading text */}
        <p className="text-base text-muted sm:text-lg">Loading your page</p>

        {/* Seconds counter */}
        <p className="text-xs text-muted/50">Redirecting in {secondsLeft}s</p>
      </motion.div>
    </main>
  );
}
