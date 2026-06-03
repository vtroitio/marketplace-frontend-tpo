export function ColorSelector({ colors, selectedColor, onSelect }) {
  return (
    <div className="mb-6">
      <p className="text-xs font-bold uppercase tracking-[1.2px] text-secondary mb-2">
        Color{" "}
        {selectedColor && (
          <span className="font-normal text-tertiary normal-case tracking-normal">
            {selectedColor.value}
          </span>
        )}
      </p>
      <div className="flex gap-2 flex-wrap">
        {colors.map((color) => (
          <button
            key={color.id}
            onClick={() => onSelect(selectedColor?.id === color.id ? null : color)}
            title={color.value}
            className={`w-7 h-7 border-2 transition-all ${
              selectedColor?.id === color.id
                ? "border-secondary scale-110"
                : "border-transparent hover:border-tertiary"
            }`}
            style={{ backgroundColor: color.hexColor }}
            aria-label={color.value}
            aria-pressed={selectedColor?.id === color.id}
          />
        ))}
      </div>
    </div>
  );
}
