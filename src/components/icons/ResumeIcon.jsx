export function ResumeIcon({ size = 14, className = "", ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 11 14"
      fill="none"
      className={className}
      {...props}
    >
      <path
        d="M0 14V0L11 7L0 14V14M2 7V7V7V7V7M2 10.35L7.25 7L2 3.65V10.35V10.35"
        fill="currentColor"
      />
    </svg>
  );
}
