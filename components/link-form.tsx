"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, Check, X, Shuffle, Copy, QrCode, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { isValidUrl, isValidSlug, generateRandomSlug } from "@/lib/url";
import { useHistory } from "@/hooks/useHistory";

type Step = "url" | "vanity" | "result";

export default function LinkForm() {
  const { addItem, hasSlug } = useHistory();
  const [step, setStep] = useState<Step>("url");
  const [longUrl, setLongUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const [slug, setSlug] = useState("");
  const [slugError, setSlugError] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Step 1: Submit URL
  const handleUrlSubmit = useCallback(() => {
    const trimmed = longUrl.trim();
    if (!trimmed) {
      setUrlError("Please enter a URL");
      return;
    }
    if (!isValidUrl(trimmed)) {
      setUrlError("Please enter a valid URL starting with http:// or https://");
      return;
    }
    setUrlError("");
    setSlug(generateRandomSlug());
    setStep("vanity");
  }, [longUrl]);

  // Step 2: Confirm slug / generate random
  const handleRandomSlug = useCallback(() => {
    let newSlug: string;
    do {
      newSlug = generateRandomSlug();
    } while (hasSlug(newSlug));
    setSlug(newSlug);
    setSlugError("");
  }, [hasSlug]);

  const handleSlugChange = useCallback(
    (value: string) => {
      // Strip prefix if pasted
      const cleaned = value.replace(/^https?:\/\/linkjet\.cc\//, "").replace(/^linkjet\.cc\//, "");
      setSlug(cleaned);

      if (!cleaned) {
        setSlugError("");
        return;
      }

      const result = isValidSlug(cleaned);
      if (!result.valid) {
        setSlugError(result.error!);
      } else if (hasSlug(cleaned)) {
        setSlugError("This slug is already taken");
      } else {
        setSlugError("");
      }
    },
    [hasSlug]
  );

  // Step 2 -> Step 3: Create short link
  const handleCreateLink = useCallback(() => {
    const finalSlug = slug.trim() || generateRandomSlug();

    if (hasSlug(finalSlug)) {
      setSlugError("This slug is already taken");
      return;
    }

    const result = isValidSlug(finalSlug);
    if (!result.valid) {
      setSlugError(result.error!);
      return;
    }

    const url = `https://linkjet.cc/${finalSlug}`;
    setShortUrl(url);
    addItem({ shortUrl: url, slug: finalSlug, originalUrl: longUrl.trim() });
    setStep("result");
  }, [slug, longUrl, addItem, hasSlug]);

  // Step 3: Copy to clipboard
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
    } catch {
      // Fallback: select text
      if (inputRef.current) {
        inputRef.current.select();
      }
    }
    // Always show feedback even if clipboard API fails (e.g. headless browser)
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [shortUrl]);

  // Create another
  const handleCreateAnother = useCallback(() => {
    setLongUrl("");
    setUrlError("");
    setSlug(generateRandomSlug());
    setSlugError("");
    setShortUrl("");
    setCopied(false);
    setStep("url");
  }, []);

  const slugValid = slug.length > 0 && !slugError && isValidSlug(slug).valid;

  return (
    <Card>
      <AnimatePresence mode="wait">
        {step === "url" && (
          <motion.div
            key="step-url"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <label className="mb-2 block text-sm font-medium text-text">Long URL</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Link className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <Input
                  ref={inputRef}
                  id="link-input"
                  type="url"
                  placeholder="https://example.com/very-long-link"
                  value={longUrl}
                  onChange={(e) => {
                    setLongUrl(e.target.value);
                    if (urlError) setUrlError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleUrlSubmit();
                  }}
                  error={!!urlError}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleUrlSubmit}>
                Shorten
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
            {urlError && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-400"
              >
                {urlError}
              </motion.p>
            )}
          </motion.div>
        )}

        {step === "vanity" && (
          <motion.div
            key="step-vanity"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-text">
                Custom slug (optional)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted">
                  linkjet.cc/
                </span>
                <Input
                  type="text"
                  placeholder="your-custom-link"
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && slug.length > 0 && !slugError) handleCreateLink();
                  }}
                  error={!!slugError}
                  success={slugValid}
                  className="pl-[7.5rem] pr-10"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
                  {slugError && <X className="h-4 w-4 text-red-400" />}
                  {slugValid && <Check className="h-4 w-4 text-green-400" />}
                </span>
              </div>
              {slugError && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1.5 text-sm text-red-400"
                >
                  {slugError}
                </motion.p>
              )}
              {slugValid && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1.5 text-sm text-green-400"
                >
                  Slug is available
                </motion.p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={handleRandomSlug}>
                <Shuffle className="h-4 w-4" />
                Generate random
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setStep("url")}
                >
                  Back
                </Button>
                <Button
                  size="sm"
                  onClick={handleCreateLink}
                  disabled={slug.length > 0 && !!slugError}
                >
                  Create link
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {step === "result" && (
          <motion.div
            key="step-result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <label className="block text-sm font-medium text-text">Your short link</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  ref={inputRef}
                  type="text"
                  value={shortUrl}
                  readOnly
                  className="pr-10 text-accent font-medium"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <Link className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              </div>
              <Button onClick={handleCopy}>
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
              <Button variant="secondary">
                <QrCode className="h-4 w-4" />
              </Button>
            </div>

            {/* Copied toast */}
            <AnimatePresence>
              {copied && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-2 text-sm text-green-400 text-center"
                >
                  Copied to clipboard!
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleCreateAnother}>
                Shorten another link
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
