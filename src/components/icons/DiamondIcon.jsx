// DiamondIcon — path ocupa 20x22, se centra en 24x24
export function DiamondIcon({ size = 20, className = "", ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      {...props}
    >
      <g transform="translate(2, 1)">
        <path
          d="M10 22L0 10L3 4H17L20 10L10 22ZM7.625 9H12.375L10.875 6H9.125L7.625 9ZM9 17.675V11H3.45L9 17.675ZM11 17.675L16.55 11H11V17.675ZM14.6 9H17.25L15.75 6H13.1L14.6 9ZM2.75 9H5.4L6.9 6H4.25L2.75 9Z"
          fill="currentColor"
        />
      </g>
    </svg>
  );
}
