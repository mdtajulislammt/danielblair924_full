import React from "react";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const Toggle: React.FC<ToggleProps> = ({ checked, onChange }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${
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
