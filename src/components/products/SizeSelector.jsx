export function SizeSelector({ sizes, selectedSize, onSelect }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold uppercase tracking-[1.2px] text-secondary">
          Talla
        </p>
        <button className="text-xs text-primary uppercase tracking-[1.2px] font-bold hover:underline">
          Guía de talles
        </button>
      </div>
      <div className="flex gap-2 flex-wrap">
        {sizes.map((size) => {
          const isDisabled = size.stock === 0;
          const isSelected = selectedSize === size.label;
          return (
            <button
              key={size.label}
              onClick={() => onSelect(isSelected ? null : size.label)}
              disabled={isDisabled}
              className={`
                px-4 py-2 text-xs font-bold uppercase tracking-[1.2px] border transition-all
                ${isDisabled ? "opacity-30 cursor-not-allowed border-secondary/30 text-secondary/30" : ""}
                ${isSelected && !isDisabled ? "bg-secondary text-neutral border-secondary" : ""}
                ${!isSelected && !isDisabled ? "bg-transparent text-secondary border-secondary hover:border-primary hover:text-primary" : ""}
              `}
            >
              {size.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
