import { ChevronDownIcon } from "../icons";

export function Select({ label, value, placeholder, children, ...props }) {
  return (
    <label className="flex w-full flex-col gap-4">
      {label && (
        <span className="text-base font-bold uppercase leading-3 tracking-[1.2px] text-secondary">
          {label}
        </span>
      )}

      <div className="relative w-full">
        <select
          value={value}
          className={`${props.disabled ? "cursor-not-allowed! opacity-50" : ""}
            inline-flex gap-2 items-center border border-secondary p-4 w-full bg-transparent text-lg
            appearance-none focus:outline-none cursor-pointer
        `}
          {...props}
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>
          {children}
        </select>

        <span className="pointer-events-none absolute right-4 top-1/2 flex -translate-y-1/2 items-center text-secondary">
          <ChevronDownIcon />
        </span>
      </div>
    </label>
  );
}
