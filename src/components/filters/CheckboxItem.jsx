import { CheckmarkIcon } from "../icons";

export function CheckboxItem({ label, checked, onChange, colorHex }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer group mb-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span
        className={`w-4 h-4 border flex items-center justify-center shrink-0 transition-colors ${
          checked
            ? "border-primary bg-primary text-white"
            : "border-secondary bg-transparent"
        }`}
      >
        {checked && <CheckmarkIcon />}
      </span>
      {colorHex ? (
        <span className="flex items-center gap-2">
          <span
            className="w-4 h-4 border border-secondary"
            style={{ backgroundColor: colorHex }}
          />
          <span className="text-sm text-secondary group-hover:text-primary transition-colors">
            {label}
          </span>
        </span>
      ) : (
        <span className="text-sm text-secondary group-hover:text-primary transition-colors">
          {label}
        </span>
      )}
    </label>
  );
}
