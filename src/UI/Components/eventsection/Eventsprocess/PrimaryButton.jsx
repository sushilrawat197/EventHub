import React from "react";

export default function PrimaryButton({
  label = "Proceed",
  onClick,
  disabled = false,
  className = "",
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full py-3 rounded-lg font-semibold  
        ${
          disabled
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-sky-500 text-white hover:bg-sky-600"
        } 
        ${className}
      `}
    >
      {label}
    </button>
  );
}
