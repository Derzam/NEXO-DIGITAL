/**
 * Public testimonials approved for publication by the reviewer and checked by
 * Nexo Digital Studio. NEVER add invented examples or copy private feedback
 * here without a clear, recorded permission to publish.
 *
 * The public website intentionally starts without any review cards.
 * Submission via WhatsApp does not add an entry automatically.
 */
export type PublishedReview = {
  id: string;
  displayName: string;
  organization?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
};

export const publishedReviews: readonly PublishedReview[] = [];
