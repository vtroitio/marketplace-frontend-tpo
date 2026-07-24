export function RightArrowIcon({ size = 13, className = "", ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      className={` ${className}`}
      {...props}
    >
      <path
        d="M9.89219 7.3125H0V5.6875H9.89219L5.34219 1.1375L6.5 0L13 6.5L6.5 13L5.34219 11.8625L9.89219 7.3125V7.3125"
        fill="currentColor"
      />
    </svg>
  );
}
