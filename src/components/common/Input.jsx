import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = forwardRef(({
  label,
  type = 'text',
  error,
  helperText,
  icon: Icon,
  className = '',
  containerClassName = '',
  showPasswordToggle = false,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const inputType = type === 'password' && showPasswordToggle
    ? (showPassword ? 'text' : 'password')
    : type;

  return (
    <div className={`${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-dark-300 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-dark-400" />
          </div>
        )}
        <input
          ref={ref}
          type={inputType}
          className={`
            w-full bg-dark-800 border border-dark-600 rounded-lg
            text-white placeholder-dark-400
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            transition-colors duration-200
            ${Icon ? 'pl-10' : 'pl-4'} 
            ${showPasswordToggle && type === 'password' ? 'pr-10' : 'pr-4'}
            py-2.5
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-dark-400 hover:text-dark-300 transition-colors"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
      {(error || helperText) && (
        <p className={`mt-1.5 text-sm ${error ? 'text-red-500' : 'text-dark-400'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
