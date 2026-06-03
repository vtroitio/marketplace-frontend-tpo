export function FilterSection({ title, children }) {
  return (
    <div className="border-b border-secondary pb-5 mb-5 last:border-0 last:mb-0">
      <p className="text-xs font-bold uppercase tracking-[1.2px] text-secondary mb-3">
        {title}
      </p>
      {children}
    </div>
  );
}
