import { Link } from "react-router-dom";
export function Button({ children, variant, fullWidth, className, ...props }) {
  const base = `cursor-pointer uppercase text-xs font-bold px-8 py-4 leading-3 tracking-[1.2px] inline-flex items-center justify-center ${fullWidth ? "w-full" : "w-fit"} gap-2`;
  const variants = {
    primary:
      "bg-primary border border-primary text-neutral hover:bg-transparent hover:text-primary hover:border-primary",
    inverted:
      "bg-transparent border border-primary text-primary hover:bg-primary hover:text-neutral",
    outline:
      "bg-transparent border border-secondary text-secondary hover:bg-transparent hover:text-primary hover:border-primary",
    text: "bg-transparent text-primary p-4 hover:font-black",
  };

  const classes =
    `${base} ${variants[variant] || variants.primary} ${className || ""}`.trim();

  if (props.to) {
    return (
      <div className="">
        <Link className={classes} to={props.to} {...props}>
          {children}
        </Link>
      </div>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
