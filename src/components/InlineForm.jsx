import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Send, Plus, X } from 'lucide-react';
import clsx from 'clsx';
import Button from './Button';

// Inline search form
export const InlineSearch = ({
  placeholder = 'Search...',
  onSearch,
  onClear,
  value,
  onChange,
  autoFocus = false,
  className,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(value);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={clsx(
        'relative flex items-center gap-2 rounded-md overflow-hidden transition-all duration-220',
        isFocused ? 'gradient-border shadow-md' : 'shadow-sm',
        className
      )}
      animate={{ 
        boxShadow: isFocused 
          ? '0 4px 14px -2px rgba(255, 159, 61, 0.25)' 
          : '0 2px 4px -1px rgba(31, 41, 55, 0.06)' 
      }}
    >
      <div className="absolute left-4 text-text-tertiary pointer-events-none">
        <Search className="w-5 h-5" />
      </div>
      
      <input
        type="text"
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="flex-1 pl-12 pr-4 py-3 bg-surface border-0 focus:outline-none text-text-primary placeholder:text-text-tertiary"
      />
      
      <AnimatePresence>
        {value && (
          <motion.button
            type="button"
            onClick={onClear}
            className="mr-2 p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-ground-800 text-text-tertiary hover:text-text-primary transition-colors"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>
      
      <Button
        type="submit"
        variant="ghost"
        className="mr-2"
        disabled={!value}
      >
        Search
      </Button>
    </motion.form>
  );
};

// Inline message form (for chat)
export const InlineMessage = ({
  value,
  onChange,
  onSubmit,
  placeholder = 'Type a message...',
  disabled = false,
  className,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit?.(value);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={clsx(
        'flex items-end gap-2 p-3 rounded-lg bg-surface-elevated transition-all duration-220',
        isFocused && 'gradient-border shadow-md',
        className
      )}
    >
      <textarea
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className="flex-1 px-3 py-2 bg-transparent border-0 resize-none focus:outline-none text-text-primary placeholder:text-text-tertiary max-h-32 overflow-y-auto"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
      />
      
      <motion.button
        type="submit"
        disabled={disabled || !value.trim()}
        className={clsx(
          'flex-shrink-0 p-2.5 rounded-lg transition-all duration-220',
          value.trim()
            ? 'bg-gradient-accent text-white shadow-accent hover:shadow-accent-lg'
            : 'bg-neutral-200 dark:bg-ground-700 text-text-tertiary cursor-not-allowed'
        )}
        whileHover={value.trim() ? { scale: 1.05 } : {}}
        whileTap={value.trim() ? { scale: 0.95 } : {}}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
      >
        <Send className="w-5 h-5" />
      </motion.button>
    </motion.form>
  );
};

// Inline quick add form
export const InlineQuickAdd = ({
  value,
  onChange,
  onAdd,
  placeholder = 'Add item...',
  buttonLabel = 'Add',
  icon: Icon = Plus,
  className,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onAdd?.(value);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={clsx(
        'flex items-center gap-2 p-2 rounded-lg bg-surface-elevated transition-all duration-220',
        isFocused && 'gradient-border',
        className
      )}
    >
      <input
        type="text"
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="flex-1 px-3 py-2 bg-transparent border-0 focus:outline-none text-text-primary placeholder:text-text-tertiary"
      />
      
      <motion.button
        type="submit"
        disabled={!value.trim()}
        className={clsx(
          'flex items-center gap-2 px-3 py-2 rounded-md font-medium text-sm transition-all duration-220',
          value.trim()
            ? 'bg-accent-500 text-white hover:bg-accent-600'
            : 'bg-neutral-200 dark:bg-ground-700 text-text-tertiary cursor-not-allowed'
        )}
        whileHover={value.trim() ? { scale: 1.02 } : {}}
        whileTap={value.trim() ? { scale: 0.98 } : {}}
      >
        <Icon className="w-4 h-4" />
        {buttonLabel}
      </motion.button>
    </motion.form>
  );
};

// Inline filter form
export const InlineFilter = ({
  filters = [],
  activeFilters = [],
  onFilterChange,
  className,
}) => {
  return (
    <motion.div
      className={clsx('flex items-center gap-2 flex-wrap', className)}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
    >
      {filters.map((filter) => {
        const isActive = activeFilters.includes(filter.value);
        
        return (
          <motion.button
            key={filter.value}
            onClick={() => onFilterChange?.(filter.value)}
            className={clsx(
              'px-4 py-2 rounded-md text-sm font-medium transition-all duration-220',
              isActive
                ? 'bg-gradient-accent text-white shadow-accent'
                : 'bg-surface-elevated text-text-secondary hover:bg-neutral-100 dark:hover:bg-ground-800'
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          >
            {filter.icon && <filter.icon className="w-4 h-4 inline-block mr-2" />}
            {filter.label}
          </motion.button>
        );
      })}
    </motion.div>
  );
};

// Inline email subscribe form
export const InlineSubscribe = ({
  value,
  onChange,
  onSubmit,
  placeholder = 'Enter your email',
  buttonLabel = 'Subscribe',
  loading = false,
  success = false,
  error,
  className,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(value);
  };

  return (
    <div className={className}>
      <motion.form
        onSubmit={handleSubmit}
        className={clsx(
          'flex items-center gap-2 p-2 rounded-lg transition-all duration-220',
          'bg-surface shadow-md',
          isFocused && 'gradient-border shadow-accent',
          success && 'border-green-500',
          error && 'border-red-500'
        )}
      >
        <input
          type="email"
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          required
          disabled={loading || success}
          className="flex-1 px-4 py-2 bg-transparent border-0 focus:outline-none text-text-primary placeholder:text-text-tertiary"
        />
        
        <Button
          type="submit"
          variant="accent"
          loading={loading}
          disabled={!value || loading || success}
        >
          {success ? 'Subscribed!' : buttonLabel}
        </Button>
      </motion.form>
      
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-2 text-sm text-red-600 dark:text-red-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default {
  InlineSearch,
  InlineMessage,
  InlineQuickAdd,
  InlineFilter,
  InlineSubscribe,
};