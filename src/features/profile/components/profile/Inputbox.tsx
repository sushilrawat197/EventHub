import React from "react";

interface InputboxProps {
  id: string;
  label: string;
  placeholder?: string;
  name?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ElementType;
  onClick?: () => void; // ✅ optional click handler
  maxLength?: number;
}

const Inputbox: React.FC<InputboxProps> = ({
  id,
  label,
  placeholder,
  name,
  type = "text",
  value,
  onChange,
  icon: Icon,
  onClick, // ✅ destructure onClick
  maxLength
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <label htmlFor={id} className="sm:w-32 text-gray-700 font-semibold text-base">
        {label}
      </label>

      <div className="w-full sm:w-[70%] relative group">
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          onClick={onClick}
          maxLength={maxLength}
          className="w-full p-3 pr-10 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white shadow-sm focus:shadow-lg group-hover:border-gray-300"
        />
        {Icon && (
          <Icon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
        )}
      </div>
    </div>
  );
};

export default Inputbox;
