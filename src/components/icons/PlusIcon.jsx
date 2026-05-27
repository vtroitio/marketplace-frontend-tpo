export function PlusIcon({ size = 13, className = "", ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox={`0 0 16 16`}
      fill="none"
      className={className}
      {...props}
    >
      <path
        d="M8 1V15M1 8H15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
