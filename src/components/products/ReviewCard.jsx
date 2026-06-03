import { StarRating } from "./StarRating";

export function ReviewCard({ review }) {
  return (
    <div className="border-b border-secondary pb-6 last:border-0">
      <div className="flex items-center justify-between mb-1">
        <StarRating rating={review.rating} />
        <span className="text-xs text-tertiary">{review.date}</span>
      </div>
      <p className="text-sm font-bold text-secondary mt-1">{review.title}</p>
      <p className="text-sm text-tertiary mt-1 leading-5">{review.description}</p>
    </div>
  );
}
