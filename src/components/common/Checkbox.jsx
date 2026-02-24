import { forwardRef } from 'react';

const Checkbox = forwardRef(({
  label,
  className = '',
  ...props
}, ref) => {
  return (
    <label className="flex items-center cursor-pointer">
      <input
        ref={ref}
        type="checkbox"
        className={`
          w-4 h-4 rounded border-dark-600 bg-dark-800
          text-primary-600 focus:ring-primary-500 focus:ring-offset-0
          focus:ring-2 focus:ring-offset-dark-900
          transition-colors duration-200
          ${className}
        `}
        {...props}
      />
      {label && (
        <span className="ml-2 text-sm text-dark-300">{label}</span>
      )}
    </label>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
