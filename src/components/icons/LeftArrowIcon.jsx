export function LeftArrowIcon({ size = 13, className = "", ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox={`0 0 13 13`}
      fill="none"
      className={className}
      {...props}
    >
      <path
        d="M3.10781 7.3125H13V5.6875H3.10781L7.65781 1.1375L6.5 0L-3.8743e-07 6.5L6.5 13L7.65781 11.8625L3.10781 7.3125V7.3125"
        fill="currentColor"
      />
    </svg>
  );
}
