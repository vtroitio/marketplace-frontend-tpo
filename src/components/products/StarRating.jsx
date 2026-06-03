import { StarIcon } from "../icons";

export function StarRating({ rating, max = 5, size = 14 }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <StarIcon key={i} filled={i < Math.round(rating)} size={size} />
      ))}
    </span>
  );
}
