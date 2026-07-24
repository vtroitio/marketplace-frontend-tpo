import { useState } from "react";

export function Textarea({ label, ...props }) {
  const [isInputFocused, setIsInputFocused] = useState(false);

  return (
    <label className="flex w-full flex-col gap-4">
      {label && (
        <span className="text-base font-bold uppercase leading-3 tracking-[1.2px] text-secondary">
          {label}
        </span>
      )}

      <div
        className={`inline-flex gap-2 items-center border border-secondary p-4 cursor-text ${isInputFocused ? "ring-2" : ""}`}
      >
        <textarea
          className="w-full bg-transparent text-lg focus:outline-none cursor-text"
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
          {...props}
        />
      </div>
    </label>
  );
}
