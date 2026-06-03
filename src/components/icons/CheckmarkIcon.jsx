export function CheckmarkIcon({ size = 8, className = "", ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={(size * 6) / 8}
      viewBox="0 0 8 6"
      fill="none"
      className={className}
      {...props}
    >
      <path
        d="M1 3l2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
