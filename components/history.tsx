"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Trash2, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/button";
import { useHistory } from "@/hooks/useHistory";

function formatTime(ts: number): string {
  const date = new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}

export default function History() {
  const { items, removeItem, clearAll } = useHistory();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Clipboard not available
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted" />
          History
        </CardTitle>
        {items.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAll}>
            Clear all
          </Button>
        )}
      </CardHeader>

      {items.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted">
          No links yet. Create your first short link above.
        </p>
      ) : (
        <div className="space-y-1">
          {/* Desktop table header */}
          <div className="hidden sm:grid sm:grid-cols-[1fr_1fr_auto_auto] gap-3 px-3 py-2 text-xs font-medium text-muted uppercase tracking-wider">
            <span>Short link</span>
            <span>Original</span>
            <span>Created</span>
            <span className="w-20 text-right">Actions</span>
          </div>

          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="group overflow-hidden"
              >
                {/* Desktop row */}
                <div className="hidden sm:grid sm:grid-cols-[1fr_1fr_auto_auto] gap-3 items-center rounded-lg px-3 py-2.5 hover:bg-card-light transition-colors">
                  <a
                    href={item.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate text-sm font-medium text-accent hover:underline"
                  >
                    {item.shortUrl}
                  </a>
                  <span className="truncate text-sm text-muted">{item.originalUrl}</span>
                  <span className="text-xs text-muted whitespace-nowrap">
                    {formatTime(item.createdAt)}
                  </span>
                  <div className="flex items-center gap-1 justify-end">
                    <button
                      onClick={() => handleCopy(item.shortUrl, item.id)}
                      className="rounded-lg p-1.5 text-muted hover:text-text hover:bg-card transition-colors"
                      aria-label="Copy short link"
                    >
                      {copiedId === item.id ? (
                        <Check className="h-4 w-4 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="rounded-lg p-1.5 text-muted hover:text-red-400 hover:bg-card transition-colors"
                      aria-label="Delete link"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Mobile card */}
                <div className="sm:hidden rounded-lg border border-border bg-card-light/50 p-3 mb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <a
                        href={item.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-accent hover:underline truncate block"
                      >
                        {item.shortUrl}
                      </a>
                      <p className="mt-1 text-xs text-muted truncate">{item.originalUrl}</p>
                      <p className="mt-1 text-xs text-muted">{formatTime(item.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleCopy(item.shortUrl, item.id)}
                        className="rounded-lg p-2 text-muted hover:text-text hover:bg-card transition-colors"
                        aria-label="Copy short link"
                      >
                        {copiedId === item.id ? (
                          <Check className="h-4 w-4 text-green-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="rounded-lg p-2 text-muted hover:text-red-400 hover:bg-card transition-colors"
                        aria-label="Delete link"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </Card>
  );
}
