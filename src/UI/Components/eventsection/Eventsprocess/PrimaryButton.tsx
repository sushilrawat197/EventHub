import React, {type ReactNode } from "react";

interface PrimaryButtonProps {
  label?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;   // <-- yeh add karo
}

export default function PrimaryButton({
  label,
  onClick,
  disabled = false,
  className = "",
  children,
}: PrimaryButtonProps) {
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
      {children ?? label}   {/* agar children diya hai to wo dikhega, warna label */}
    </button>
  );
}
