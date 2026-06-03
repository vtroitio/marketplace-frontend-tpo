export function DiamondIcon({ size = 40, className = "", ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 40 36"
      fill="none"
      className={className}
      {...props}
    >
      <path
        d="M20 36L0 12L6 0H34L40 12L20 36V36M15.25 10H24.75L21.75 4H18.25L15.25 10V10M18 27.35V14H6.9L18 27.35V27.35M22 27.35L33.1 14H22V27.35V27.35M29.2 10H34.5L31.5 4H26.2L29.2 10V10M5.5 10H10.8L13.8 4H8.5L5.5 10V10"
        fill="currentColor"
      />
    </svg>
  );
}
