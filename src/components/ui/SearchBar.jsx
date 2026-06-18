import { useState } from "react";
import { SearchIcon } from "../icons";

export function SearchBar({
  value,
  onChange,
  placeholder = "Buscar prendas...",
  ...props
}) {
  const [isInputFocused, setIsInputFocused] = useState(false);
  return (
    <div
      className={`w-full inline-flex gap-2 items-center border border-secondary p-4 cursor-text ${isInputFocused ? "ring-2" : ""}`}
    >
      <SearchIcon />
      <input
        type="search"
        value={value}
        onChange={onChange}
        onFocus={() => setIsInputFocused(true)}
        onBlur={() => setIsInputFocused(false)}
        placeholder={placeholder}
        className="w-full bg-transparent text-lg focus:outline-none"
        {...props}
      />
    </div>
  );
}
