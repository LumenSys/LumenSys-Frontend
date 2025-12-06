import React from 'react';

type TextareaFieldProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  name: string;
  className?: string;
};

const TextareaField: React.FC<TextareaFieldProps> = ({
  label,
  name,
  className = '',
  rows = 4,
  ...props
}) => {
  return (
    <div className="w-full relative">
      {label && (
        <label
          htmlFor={name}
          className="block mb-1 text-sm font-medium text-textPrimary"
        >
          {label}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        rows={rows}
        className={`w-full px-4 py-2 border rounded focus:ring-primary focus:outline-none resize-none ${className}`}
        {...props}
      />
    </div>
  );
};

export default TextareaField;