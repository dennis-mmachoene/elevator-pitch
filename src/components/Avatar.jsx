import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
  '2xl': 'w-20 h-20 text-2xl',
  hero: 'w-32 h-32 text-4xl', // Hero state
};

const statusClasses = {
  online: 'bg-green-500',
  offline: 'bg-neutral-400',
  busy: 'bg-red-500',
  away: 'bg-amber-500',
};

const Avatar = ({ 
  src, 
  alt, 
  name, 
  size = 'md', 
  status,
  showRing = true,
  className,
  onClick,
  hero = false, // Hero state for key screens
}) => {
  const sizeClass = sizeClasses[hero ? 'hero' : size];
  
  // Get initials from name
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const containerClasses = clsx(
    'avatar relative inline-flex',
    sizeClass,
    showRing && 'ring-2 ring-surface ring-offset-2 dark:ring-ground-900',
    onClick && 'cursor-pointer',
    hero && 'ring-4 ring-offset-4 shadow-accent-lg',
    className
  );

  return (
    <motion.div
      className={containerClasses}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.05 } : {}}
      whileTap={onClick ? { scale: 0.95 } : {}}
      transition={{ 
        type: 'spring', 
        stiffness: 280, 
        damping: 24 
      }}
    >
      {src ? (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <div className="w-full h-full rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center font-display font-bold text-white">
          {getInitials(name)}
        </div>
      )}
      
      {/* Status indicator */}
      {status && (
        <motion.span
          className={clsx(
            'absolute bottom-0 right-0 block rounded-full ring-2 ring-surface',
            statusClasses[status],
            hero ? 'w-5 h-5' : size === 'xs' || size === 'sm' ? 'w-2 h-2' : 'w-3 h-3'
          )}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: 'spring', 
            stiffness: 280, 
            damping: 24,
            delay: 0.1 
          }}
        />
      )}
      
      {/* Hero glow effect */}
      {hero && (
        <div className="absolute inset-0 rounded-full bg-gradient-accent opacity-0 hover:opacity-20 transition-opacity duration-220 pointer-events-none" />
      )}
    </motion.div>
  );
};

// Avatar Group component for multiple avatars
export const AvatarGroup = ({ 
  avatars = [], 
  max = 3, 
  size = 'md',
  className 
}) => {
  const displayAvatars = avatars.slice(0, max);
  const remaining = Math.max(0, avatars.length - max);
  
  const sizePixels = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
  };
  
  const offset = -(sizePixels[size] * 0.25);

  return (
    <div className={clsx('flex items-center', className)}>
      {displayAvatars.map((avatar, index) => (
        <div
          key={avatar.id || index}
          style={{ marginLeft: index > 0 ? `${offset}px` : 0 }}
          className="relative"
        >
          <Avatar
            src={avatar.src}
            name={avatar.name}
            size={size}
            showRing
          />
        </div>
      ))}
      
      {remaining > 0 && (
        <motion.div
          style={{ marginLeft: `${offset}px` }}
          className={clsx(
            'relative inline-flex items-center justify-center rounded-full',
            'bg-neutral-200 dark:bg-ground-700 text-text-secondary',
            'ring-2 ring-surface font-medium',
            sizeClasses[size]
          )}
          whileHover={{ scale: 1.05 }}
        >
          +{remaining}
        </motion.div>
      )}
    </div>
  );
};

export default Avatar;