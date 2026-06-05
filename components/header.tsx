"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X, ExternalLink } from "lucide-react";
import Button from "@/components/ui/button";

const navLinks = [
  { label: "About", href: "#" },
  { label: "FAQ", href: "#" },
];

export default function Header({
  slug,
  originalUrl,
}: {
  slug?: string;
  originalUrl?: string;
} = {}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Framed redirect variant — show slug/URL info in the header bar
  if (slug && originalUrl) {
    return (
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2.5 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-accent"
              >
                <path d="M12 2v20" />
                <path d="M2 12h20" />
                <path d="m6 8 4 4-4 4" />
                <path d="m18 8-4 4 4 4" />
              </svg>
            </div>
            <span className="text-base font-bold tracking-tight text-text">
              Link<span className="text-accent">Jet</span>
            </span>
          </Link>

          {/* Slug + URL info — hidden on very narrow screens */}
          <div className="hidden min-w-0 items-center gap-1.5 truncate px-2 text-xs sm:flex">
            <span className="shrink-0 font-medium text-text">linkjet.cc/{slug}</span>
            <svg
              width="12"
              height="12"
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
          </div>

          {/* Open in new tab */}
          <a
            href={originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-accent hover:text-accent-hover transition-colors text-xs font-medium"
          >
            Open in new tab
          </a>
        </div>
      </motion.header>
    );
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-accent"
            >
              <path d="M12 2v20" />
              <path d="M2 12h20" />
              <path d="m6 8 4 4-4 4" />
              <path d="m18 8-4 4 4 4" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-text">
            Link<span className="text-accent">Jet</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 sm:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:text-text"
            >
              {link.label}
            </a>
          ))}
          <div className="ml-2">
            <Button size="sm" onClick={() => document.getElementById("link-input")?.focus()}>
              <ExternalLink className="h-4 w-4" />
              Paste a link
            </Button>
          </div>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center justify-center rounded-lg p-2 text-muted hover:text-text hover:bg-card sm:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border sm:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="rounded-lg px-3 py-2.5 text-sm text-muted transition-colors hover:text-text hover:bg-card"
                >
                  {link.label}
                </a>
              ))}
              <Button size="sm" className="mt-2 w-full justify-center">
                <ExternalLink className="h-4 w-4" />
                Paste a link
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
