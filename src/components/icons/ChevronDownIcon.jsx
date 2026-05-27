export function ChevronDownIcon({ size = 14, className = "", ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 14 8"
      fill="none"
      className={className}
      {...props}
    >
      <path
        d="M1 1L7 7L13 1"
        stroke="currentColor"
        stroke-width="2"
        strokeLinecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
