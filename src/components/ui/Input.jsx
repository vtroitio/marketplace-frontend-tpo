import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "../icons";

export function Input({ label, ...props }) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  return (
    <label className="flex w-full flex-col gap-4">
      {label && (
        <span className="text-base font-bold uppercase leading-3 tracking-[1.2px] text-secondary">
          {label}
        </span>
      )}

      <div className={`inline-flex gap-2 items-center border border-secondary p-4 cursor-text ${isInputFocused ? "ring-2" : ""}`}>
        <input
          className="w-full bg-transparent text-lg focus:outline-none"
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
          name={label}
          {...props}
          type={
            props.type === "password"
              ? isPasswordVisible
                ? "text"
                : "password"
              : props.type
          }
        />
        {props.type === "password" && (
          <button
            type="button"
            onClick={() => setIsPasswordVisible((v) => !v)}
            className="p-0 flex shrink-0 items-center text-secondary"
            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
          >
            {isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>
    </label>
  );
}
