export function StarIcon({ filled, size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path
        d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.27l-4.77 2.44.91-5.32-3.87-3.77 5.34-.78L10 1z"
        fill={filled ? "#e60012" : "none"}
        stroke="#e60012"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
