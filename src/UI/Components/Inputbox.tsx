import React from "react";


interface InputboxProps {
  id: string;
  label: string;
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ElementType;
}

const Inputbox: React.FC<InputboxProps> = ({
  id,
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  icon: Icon,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
      <label htmlFor={id} className="sm:w-40 text-gray-700 font-medium">
        {label}
      </label>

      <div className="w-full sm:w-[70%] relative">
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full p-3 pr-10 rounded-md ring focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
        />
        {Icon && (
          <Icon className="absolute right-3 top-1/2 -translate-y-1/2" />
        )}
      </div>
    </div>
  );
};

export default Inputbox;
