const SLUG_REGEX = /^[a-zA-Z0-9-]+$/;
const MIN_SLUG_LENGTH = 3;
const MAX_SLUG_LENGTH = 30;

export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function generateRandomSlug(length = 7): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let slug = "";
  for (let i = 0; i < length; i++) {
    slug += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return slug;
}

export function isValidSlug(slug: string): { valid: boolean; error?: string } {
  if (!slug || slug.trim().length === 0) {
    return { valid: false, error: "Slug is required" };
  }
  if (slug.length < MIN_SLUG_LENGTH) {
    return { valid: false, error: `Slug must be at least ${MIN_SLUG_LENGTH} characters` };
  }
  if (slug.length > MAX_SLUG_LENGTH) {
    return { valid: false, error: `Slug must be at most ${MAX_SLUG_LENGTH} characters` };
  }
  if (!SLUG_REGEX.test(slug)) {
    return { valid: false, error: "Only letters, numbers, and hyphens allowed" };
  }
  return { valid: true };
}
