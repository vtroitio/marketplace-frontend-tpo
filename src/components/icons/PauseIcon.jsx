export function PauseIcon({ size = 14, className = "", ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      className={className}
      {...props}
    >
      <path
        d="M8 14V0H14V14H8ZM0 14V0H6V14H0ZM10 12H12V2H10V12ZM2 12H4V2H2V12Z"
        fill="currentColor"
      />
    </svg>
  );
}
