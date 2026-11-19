import React from "react";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, disabled }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => {
        if (!disabled) onChange(!checked);
      }}
      className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out ${
        disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
      } ${
        checked ? "bg-primaryColor justify-end" : "bg-stone-800 justify-start"
      }`}
    >
      <div
        className={`size-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
          checked ? "bg-stone-950" : "bg-stone-500"
        }`}
      />
    </button>
  );
};
