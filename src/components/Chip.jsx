import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import clsx from 'clsx';

const variantClasses = {
  default: 'bg-neutral-100 dark:bg-ground-800 text-text-secondary border-neutral-200 dark:border-ground-700',
  accent: 'bg-accent-50 dark:bg-accent-900/20 text-accent-700 dark:text-accent-400 border-accent-200 dark:border-accent-800',
  success: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
  warning: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  error: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
  ghost: 'bg-transparent text-text-secondary border-transparent hover:bg-neutral-100 dark:hover:bg-ground-800',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs gap-1',
  md: 'px-3 py-1 text-sm gap-1.5',
  lg: 'px-4 py-1.5 text-base gap-2',
};

const Chip = ({
  children,
  variant = 'default',
  size = 'md',
  icon: Icon,
  onRemove,
  onClick,
  className,
  ...props
}) => {
  const isInteractive = onClick || onRemove;
  
  const chipClasses = clsx(
    'chip inline-flex items-center rounded-full font-medium border transition-all duration-220',
    variantClasses[variant],
    sizeClasses[size],
    isInteractive && 'cursor-pointer hover:shadow-sm',
    className
  );

  const chipContent = (
    <>
      {Icon && <Icon className="w-4 h-4" />}
      <span className="truncate">{children}</span>
      {onRemove && (
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 -mr-1 p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          aria-label="Remove"
        >
          <X className="w-3 h-3" />
        </motion.button>
      )}
    </>
  );

  if (onClick) {
    return (
      <motion.button
        className={chipClasses}
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        {...props}
      >
        {chipContent}
      </motion.button>
    );
  }

  return (
    <motion.span
      className={chipClasses}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 280, damping: 24 }}
      {...props}
    >
      {chipContent}
    </motion.span>
  );
};

// Chip Group for multiple chips
export const ChipGroup = ({ 
  chips = [], 
  variant = 'default',
  size = 'md',
  onRemove,
  className 
}) => {
  return (
    <div className={clsx('flex flex-wrap gap-2', className)}>
      {chips.map((chip, index) => (
        <Chip
          key={chip.id || index}
          variant={variant}
          size={size}
          icon={chip.icon}
          onRemove={onRemove ? () => onRemove(chip) : undefined}
        >
          {chip.label}
        </Chip>
      ))}
    </div>
  );
};

// Status Chip with pulse animation
export const StatusChip = ({ 
  status = 'active',
  pulse = false,
  size = 'md',
  className 
}) => {
  const statusConfig = {
    active: { variant: 'success', label: 'Active' },
    sold: { variant: 'default', label: 'Sold' },
    reserved: { variant: 'warning', label: 'Reserved' },
    inactive: { variant: 'error', label: 'Inactive' },
  };

  const config = statusConfig[status] || statusConfig.active;

  return (
    <Chip variant={config.variant} size={size} className={className}>
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
        </span>
      )}
      {config.label}
    </Chip>
  );
};

export { Chip as default, Chip };