import type { PublishedReview } from "@/lib/published-reviews";

type PublicRow = {
  id: string;
  display_name: string;
  organization: string | null;
  rating: number;
  comment: string;
};

function databaseConfig() {
  const url = process.env.NEXO_SUPABASE_URL;
  const key = process.env.NEXO_SUPABASE_ANON_KEY;
  if (!url || !key || !/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(url)) return null;
  return { url, key };
}

export async function loadPublishedReviews(): Promise<PublishedReview[]> {
  const config = databaseConfig();
  if (!config) return [];
  try {
    const endpoint = new URL("/rest/v1/nexo_customer_reviews", config.url);
    endpoint.searchParams.set("select", "id,display_name,organization,rating,comment");
    endpoint.searchParams.set("moderation_status", "eq.published");
    endpoint.searchParams.set("publication_consent", "eq.true");
    endpoint.searchParams.set("order", "published_at.desc");
    endpoint.searchParams.set("limit", "9");
    const response = await fetch(endpoint, {
      headers: { apikey: config.key, Authorization: "Bearer " + config.key },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error("Review storage unavailable: HTTP " + response.status);
    const data: unknown = await response.json();
    if (!Array.isArray(data)) return [];
    return (data as PublicRow[])
      .filter((item) => typeof item.id === "string"
        && typeof item.display_name === "string"
        && typeof item.comment === "string"
        && Number.isInteger(item.rating) && item.rating >= 1 && item.rating <= 5)
      .map((item) => ({
        id: item.id,
        displayName: item.display_name,
        organization: typeof item.organization === "string" ? item.organization : undefined,
        rating: item.rating as PublishedReview["rating"],
        comment: item.comment,
      }));
  } catch {
    // Keep the rest of the site available. Never expose the Supabase error to visitors.
    console.error("Nexo reviews could not be loaded from the public data endpoint");
    return [];
  }
}
