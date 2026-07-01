import { Link } from "react-router-dom";
import { formatCurrency, getImageUrl } from "../../helpers/formatters";

export function Card({
  image,
  title,
  price,
  to = "#",
  variant,
  imageAlt,
  className = "",
}) {
  const base =
    "group block overflow-hidden border border-secondary bg-neutral text-secondary";
  const variants = {
    large: {
      card: "w-full max-w-[394px]",
      image: "aspect-[394/369]",
      body: "gap-2 px-3 py-3",
      title: "text-sm leading-5",
      price: "text-xs leading-4",
    },
    small: {
      card: "w-full max-w-[191px]",
      image: "aspect-[191/170]",
      body: "gap-1 px-2 py-2",
      title: "text-xs leading-4",
      price: "text-xs leading-4",
    },
  };
  const styles = variants[variant] || variants.large;

  return (
    <article className={`${base} ${styles.card} ${className}`}>
      <Link to={to} className="flex h-full flex-col text-secondary">
        <div
          className={`min-h-0 flex-1 overflow-hidden bg-neutral ${styles.image}`}
        >
          <img
            src={getImageUrl(image)}
            alt={imageAlt || title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div
          className={`flex shrink-0 flex-col border-t border-secondary ${styles.body}`}
        >
          <h3
            className={`line-clamp-2 font-bold normal-case tracking-normal text-secondary ${styles.title}`}
          >
            {title}
          </h3>
          <p className={`font-normal text-secondary ${styles.price}`}>
            {formatCurrency(price)}
          </p>
        </div>
      </Link>
    </article>
  );
}