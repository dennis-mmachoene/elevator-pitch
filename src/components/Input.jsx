import React, { useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import clsx from 'clsx';

const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  success,
  helperText,
  icon: Icon,
  iconRight: IconRight,
  disabled = false,
  required = false,
  className,
  inputClassName,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const id = useId();
  
  const hasValue = value && value.length > 0;
  const showFloatingLabel = isFocused || hasValue;
  
  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className={clsx('relative', className)}>
      {/* Container with hover gradient border */}
      <div className={clsx(
        'relative rounded-md transition-all duration-220',
        isFocused && 'gradient-border',
      )}>
        <div className="relative">
          {/* Icon Left */}
          {Icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none">
              <Icon className="w-5 h-5" />
            </div>
          )}
          
          {/* Input */}
          <input
            id={id}
            type={inputType}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled}
            required={required}
            className={clsx(
              'input peer',
              Icon && 'pl-12',
              (IconRight || type === 'password') && 'pr-12',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
              success && 'border-green-500 focus:border-green-500 focus:ring-green-500/20',
              disabled && 'opacity-50 cursor-not-allowed',
              inputClassName
            )}
            placeholder={showFloatingLabel ? '' : placeholder}
            {...props}
          />
          
          {/* Floating Label */}
          {label && (
            <motion.label
              htmlFor={id}
              className={clsx(
                'absolute left-4 pointer-events-none transition-all duration-220',
                Icon && 'left-12',
                showFloatingLabel 
                  ? 'top-0 -translate-y-1/2 text-xs px-1 bg-surface'
                  : 'top-1/2 -translate-y-1/2 text-base',
                isFocused 
                  ? 'text-accent-500' 
                  : error 
                    ? 'text-red-500'
                    : 'text-text-tertiary',
                required && "after:content-['*'] after:ml-0.5 after:text-red-500"
              )}
              initial={false}
              animate={{
                fontSize: showFloatingLabel ? '0.75rem' : '1rem',
                y: showFloatingLabel ? '-50%' : '-50%',
              }}
              transition={{ duration: 0.22 }}
            >
              {label}
            </motion.label>
          )}
          
          {/* Icon Right or Password Toggle */}
          {type === 'password' ? (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          ) : IconRight ? (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none">
              <IconRight className="w-5 h-5" />
            </div>
          ) : null}
          
          {/* Status Icons */}
          {error && !type.includes('password') && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500">
              <AlertCircle className="w-5 h-5" />
            </div>
          )}
          {success && !type.includes('password') && (
            <motion.div
              className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            >
              <CheckCircle className="w-5 h-5" />
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Helper/Error Text with 3:1 contrast */}
      <AnimatePresence mode="wait">
        {(helperText || error) && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22 }}
            className={clsx(
              'mt-1.5 text-sm',
              error ? 'text-red-600 dark:text-red-400' : 'text-text-tertiary'
            )}
          >
            {error || helperText}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

// Textarea component with similar styling
export const Textarea = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  helperText,
  rows = 4,
  disabled = false,
  required = false,
  className,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const id = useId();
  
  const hasValue = value && value.length > 0;
  const showFloatingLabel = isFocused || hasValue;

  return (
    <div className={clsx('relative', className)}>
      <div className={clsx(
        'relative rounded-md transition-all duration-220',
        isFocused && 'gradient-border',
      )}>
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          required={required}
          rows={rows}
          className={clsx(
            'input resize-none',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          placeholder={showFloatingLabel ? '' : placeholder}
          {...props}
        />
        
        {label && (
          <motion.label
            htmlFor={id}
            className={clsx(
              'absolute left-4 top-4 pointer-events-none transition-all duration-220',
              showFloatingLabel 
                ? 'top-0 -translate-y-1/2 text-xs px-1 bg-surface'
                : 'text-base',
              isFocused 
                ? 'text-accent-500' 
                : error 
                  ? 'text-red-500'
                  : 'text-text-tertiary',
              required && "after:content-['*'] after:ml-0.5 after:text-red-500"
            )}
          >
            {label}
          </motion.label>
        )}
      </div>
      
      <AnimatePresence mode="wait">
        {(helperText || error) && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22 }}
            className={clsx(
              'mt-1.5 text-sm',
              error ? 'text-red-600 dark:text-red-400' : 'text-text-tertiary'
            )}
          >
            {error || helperText}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

// Select component
export const Select = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  error,
  helperText,
  disabled = false,
  required = false,
  className,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const id = useId();
  
  const hasValue = value !== undefined && value !== '';
  const showFloatingLabel = isFocused || hasValue;

  return (
    <div className={clsx('relative', className)}>
      <div className={clsx(
        'relative rounded-md transition-all duration-220',
        isFocused && 'gradient-border',
      )}>
        <select
          id={id}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          required={required}
          className={clsx(
            'input appearance-none cursor-pointer',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {label && (
          <motion.label
            htmlFor={id}
            className={clsx(
              'absolute left-4 pointer-events-none transition-all duration-220',
              showFloatingLabel 
                ? 'top-0 -translate-y-1/2 text-xs px-1 bg-surface'
                : 'top-1/2 -translate-y-1/2 text-base',
              isFocused 
                ? 'text-accent-500' 
                : error 
                  ? 'text-red-500'
                  : 'text-text-tertiary',
              required && "after:content-['*'] after:ml-0.5 after:text-red-500"
            )}
          >
            {label}
          </motion.label>
        )}
        
        {/* Dropdown arrow */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-5 h-5 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        {(helperText || error) && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22 }}
            className={clsx(
              'mt-1.5 text-sm',
              error ? 'text-red-600 dark:text-red-400' : 'text-text-tertiary'
            )}
          >
            {error || helperText}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Input;