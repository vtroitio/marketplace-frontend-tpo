export function Button({ children, variant, ...props }) {
  const base = "inline-flex items-center justify-center w-fit gap-2";
  const variants = {
    primary: "bg-primary border border-primary text-neutral",
    outline: "bg-transparent border border-secondary text-secondary",
    text: "bg-transparent text-primary p-4",
  };

  return (
    <button
      className={`
        ${base} ${variants[variant] || variants.primary}
        ${
          variant === "text"
            ? "hover:font-black"
            : "hover:bg-transparent hover:text-primary hover:border-primary"
        }
      `}
      {...props}
    >
      {children}
    </button>
  );
}
