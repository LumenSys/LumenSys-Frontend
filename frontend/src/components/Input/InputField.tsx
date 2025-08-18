// src/components/shared/InputField.tsx
import React, { useState } from 'react';
import eyeIcon from '../../assets/images/eye.svg';
import closeEyeIcon from '../../assets/images/closeEye.svg';

type InputFieldProps = {
  label?: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  maxLength?: number;
  required?: boolean;
  className?: string;
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  maxLength,
  required = false,
  className = '',
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  return (
    <div className="w-full relative">
      {label && (
        <label htmlFor={name} className="block mb-1 text-sm font-medium text-textPrimary">
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={isPassword && showPassword ? 'text' : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        maxLength={maxLength} 
        required={required}
        className={`w-full px-4 py-2 border rounded focus:ring-primary focus:outline-none ${className} ${isPassword ? 'pr-10' : ''}`}
      />
      {isPassword && (
        <button
          type="button"
          tabIndex={-1}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary focus:outline-none"
          onClick={() => setShowPassword((v) => !v)}
        >
          <img
            src={showPassword ? eyeIcon : closeEyeIcon}
            alt={showPassword ? "Ocultar senha" : "Mostrar senha"}
            className="h-5 w-5"
          />
        </button>
      )}
    </div>
  );
};

export default InputField;
