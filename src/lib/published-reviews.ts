/** Only genuinely consented, moderator-approved reviews may be publicly rendered. */
export type PublishedReview = {
  id: string;
  displayName: string;
  organization?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
};
