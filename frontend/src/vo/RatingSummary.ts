export type RatingValue = "BAD" | "MEDIUM" | "GOOD";

export type RatingSummary = {
  good: number;
  medium: number;
  bad: number;
  score: number; // 0..2
  overall: RatingValue;
};
