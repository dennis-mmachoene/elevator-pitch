import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

const variantClasses = {
  ghost: 'btn-ghost',
  elevated: 'btn-elevated',
  accent: 'btn-accent',
  outline: 'btn border-2 border-neutral-300 dark:border-ground-600 text-text-primary hover:bg-neutral-50 dark:hover:bg-ground-800',
  danger: 'btn bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg active:scale-[0.985]',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-lg',
};

const Button = ({
  children,
  variant = 'elevated',
  size = 'md',
  icon: Icon,
  iconRight: IconRight,
  loading = false,
  disabled = false,
  fullWidth = false,
  className,
  onClick,
  type = 'button',
  ...props
}) => {
  const buttonClasses = clsx(
    'btn relative overflow-hidden',
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && 'w-full',
    (disabled || loading) && 'opacity-50 cursor-not-allowed pointer-events-none',
    className
  );

  return (
    <motion.button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.985 }}
      transition={{
        type: 'spring',
        stiffness: 280,
        damping: 24,
      }}
      {...props}
    >
      {/* Gradient streak on hover (subtle eccentricity) */}
      {variant === 'accent' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
      )}
      
      {/* Content */}
      <span className="relative flex items-center justify-center gap-2">
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : Icon ? (
          <Icon className="w-4 h-4" />
        ) : null}
        {children}
        {IconRight && !loading && <IconRight className="w-4 h-4" />}
      </span>
    </motion.button>
  );
};

// Icon-only button
export const IconButton = ({
  icon: Icon,
  variant = 'ghost',
  size = 'md',
  className,
  label,
  ...props
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  return (
    <motion.button
      className={clsx(
        'inline-flex items-center justify-center rounded-md transition-all duration-220',
        variantClasses[variant],
        iconSizes[size],
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 280, damping: 24 }}
      aria-label={label}
      {...props}
    >
      <Icon className="w-5 h-5" />
    </motion.button>
  );
};

// Button group
export const ButtonGroup = ({ 
  children, 
  className,
  fullWidth = false 
}) => {
  return (
    <div className={clsx(
      'inline-flex rounded-lg shadow-sm',
      fullWidth && 'w-full',
      className
    )}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return null;
        
        const isFirst = index === 0;
        const isLast = index === React.Children.count(children) - 1;
        
        return React.cloneElement(child, {
          className: clsx(
            child.props.className,
            !isFirst && 'rounded-l-none -ml-px',
            !isLast && 'rounded-r-none',
            fullWidth && 'flex-1'
          ),
        });
      })}
    </div>
  );
};

// Floating Action Button (FAB)
export const FAB = ({
  icon: Icon,
  onClick,
  label,
  variant = 'accent',
  className,
  ...props
}) => {
  return (
    <motion.button
      className={clsx(
        'fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-accent-lg',
        'flex items-center justify-center',
        'bg-gradient-accent text-white z-50',
        'focus-visible:ring-2 focus-visible:ring-accent-500/30',
        className
      )}
      onClick={onClick}
      whileHover={{ scale: 1.1, boxShadow: '0 20px 40px -10px rgba(255, 159, 61, 0.35)' }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 280, damping: 24 }}
      aria-label={label}
      {...props}
    >
      <Icon className="w-6 h-6" />
      
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-full bg-accent-400 opacity-0 group-hover:opacity-30 blur-xl transition-opacity" />
    </motion.button>
  );
};

export default Button;