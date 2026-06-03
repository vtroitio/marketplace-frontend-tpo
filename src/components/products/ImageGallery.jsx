import { useState } from "react";

export function ImageGallery({ images, productName }) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      <div className="border border-secondary aspect-square overflow-hidden bg-secondary/5">
        <img
          src={images[active]}
          alt={productName}
          className="w-full h-full object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`shrink-0 w-20 h-20 border overflow-hidden transition-all ${
                active === i
                  ? "border-secondary"
                  : "border-secondary/30 opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={img}
                alt={`${productName} ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
