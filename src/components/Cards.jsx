import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

// Base Card with frosted glass and layered depth
export const Card = ({
  children,
  elevated = false,
  hover = false,
  className,
  onClick,
  ...props
}) => {
  const isInteractive = onClick || hover;

  return (
    <motion.div
      className={clsx(
        'card relative overflow-hidden',
        elevated && 'card-elevated',
        isInteractive && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      whileHover={isInteractive ? { y: -2, scale: 1.005 } : {}}
      whileTap={isInteractive ? { scale: 0.995 } : {}}
      transition={{ type: 'spring', stiffness: 280, damping: 24 }}
      {...props}
    >
      {/* Reflective line - one pixel highlight */}
      <div className="reflective-line" />
      
      {children}
      
      {/* Angled shadow gradient on hover */}
      {isInteractive && (
        <motion.div
          className="absolute inset-0 bg-warm-overlay opacity-0 pointer-events-none rounded-lg"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.22 }}
        />
      )}
    </motion.div>
  );
};

// StatCard - for dashboard metrics
export const StatCard = ({
  label,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  trend,
  hero = false,
  className,
}) => {
  const trendColors = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-text-tertiary',
  };

  return (
    <Card 
      elevated={hero} 
      hover
      className={clsx(
        hero && 'p-6 shadow-accent-lg ring-2 ring-accent-500/20',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-text-secondary mb-1">
            {label}
          </p>
          <motion.p
            className={clsx(
              'font-display font-bold',
              hero ? 'text-4xl' : 'text-2xl'
            )}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 280, damping: 24 }}
          >
            {value}
          </motion.p>
          
          {change !== undefined && (
            <motion.div
              className={clsx('flex items-center gap-1 mt-2 text-sm font-medium', trendColors[changeType])}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {changeType === 'up' && <TrendingUp className="w-4 h-4" />}
              {changeType === 'down' && <TrendingDown className="w-4 h-4" />}
              <span>{change}</span>
            </motion.div>
          )}
        </div>
        
        {Icon && (
          <motion.div
            className={clsx(
              'p-3 rounded-lg bg-gradient-subtle',
              hero && 'p-4'
            )}
            whileHover={{ rotate: 5, scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          >
            <Icon className={clsx('text-accent-600', hero ? 'w-8 h-8' : 'w-6 h-6')} />
          </motion.div>
        )}
      </div>
      
      {/* Dark mode glow effect */}
      {hero && (
        <div className="absolute inset-0 rounded-lg glow opacity-0 dark:opacity-100 pointer-events-none" />
      )}
    </Card>
  );
};

// SplitCard - divided content card
export const SplitCard = ({
  left,
  right,
  leftClassName,
  rightClassName,
  vertical = false,
  className,
}) => {
  return (
    <Card className={clsx('p-0 overflow-hidden', className)}>
      <div className={clsx(
        'flex',
        vertical ? 'flex-col' : 'flex-row'
      )}>
        <div className={clsx(
          'p-6 flex-1',
          !vertical && 'border-r border-neutral-200 dark:border-ground-700',
          vertical && 'border-b border-neutral-200 dark:border-ground-700',
          leftClassName
        )}>
          {left}
        </div>
        <div className={clsx('p-6 flex-1', rightClassName)}>
          {right}
        </div>
      </div>
    </Card>
  );
};

// ImageCard - for listings and products
export const ImageCard = ({
  image,
  title,
  subtitle,
  price,
  badge,
  footer,
  onClick,
  className,
}) => {
  return (
    <Card
      elevated
      hover
      onClick={onClick}
      className={clsx('p-0 group', className)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg bg-neutral-100 dark:bg-ground-800">
        {image ? (
          <motion.img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-tertiary">
            <span className="text-4xl">📷</span>
          </div>
        )}
        
        {/* Badge Overlay */}
        {badge && (
          <div className="absolute top-3 right-3">
            {badge}
          </div>
        )}
        
        {/* Gradient overlay on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.22 }}
        />
      </div>
      
      {/* Content */}
      <div className="p-4">
        {/* Title & Subtitle */}
        <div className="mb-3">
          <h3 className="font-display font-semibold text-lg mb-1 line-clamp-2 group-hover:text-accent-600 transition-colors">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-text-secondary line-clamp-1">
              {subtitle}
            </p>
          )}
        </div>
        
        {/* Price */}
        {price && (
          <div className="mb-3">
            <span className="text-2xl font-display font-bold text-accent-600">
              {price}
            </span>
          </div>
        )}
        
        {/* Footer */}
        {footer && (
          <div className="pt-3 border-t border-neutral-200 dark:border-ground-700">
            {footer}
          </div>
        )}
      </div>
    </Card>
  );
};

// ActionCard - Call to action card
export const ActionCard = ({
  icon: Icon,
  title,
  description,
  action,
  actionLabel,
  variant = 'default',
  className,
}) => {
  const variantClasses = {
    default: 'bg-surface',
    accent: 'bg-gradient-subtle border-accent-200 dark:border-accent-800',
    primary: 'bg-accent-50 dark:bg-accent-900/20 border-accent-200 dark:border-accent-800',
  };

  return (
    <Card
      elevated
      hover
      onClick={action}
      className={clsx(variantClasses[variant], className)}
    >
      <div className="flex items-start gap-4">
        {Icon && (
          <motion.div
            className="flex-shrink-0 p-3 rounded-lg bg-gradient-accent text-white"
            whileHover={{ rotate: 5 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          >
            <Icon className="w-6 h-6" />
          </motion.div>
        )}
        
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-lg mb-1">
            {title}
          </h3>
          <p className="text-sm text-text-secondary mb-4">
            {description}
          </p>
          
          {action && (
            <motion.button
              className="inline-flex items-center gap-2 text-sm font-medium text-accent-600 hover:text-accent-700"
              whileHover={{ x: 4 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            >
              {actionLabel || 'Learn more'}
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>
    </Card>
  );
};

// ProfileCard - User profile display
export const ProfileCard = ({
  avatar,
  name,
  subtitle,
  stats = [],
  actions,
  hero = false,
  className,
}) => {
  return (
    <Card
      elevated={hero}
      className={clsx(
        'text-center',
        hero && 'p-8 shadow-accent-lg',
        className
      )}
    >
      {/* Avatar */}
      <motion.div
        className="inline-block mb-4"
        whileHover={{ scale: 1.05, rotate: 2 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
      >
        {avatar}
      </motion.div>
      
      {/* Name & Subtitle */}
      <h3 className={clsx(
        'font-display font-bold mb-1',
        hero ? 'text-2xl' : 'text-xl'
      )}>
        {name}
      </h3>
      {subtitle && (
        <p className="text-sm text-text-secondary mb-4">
          {subtitle}
        </p>
      )}
      
      {/* Stats */}
      {stats.length > 0 && (
        <div className="flex justify-center gap-6 py-4 border-y border-neutral-200 dark:border-ground-700 mb-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-xl font-display font-bold">
                {stat.value}
              </p>
              <p className="text-xs text-text-secondary">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      )}
      
      {/* Actions */}
      {actions && (
        <div className="flex gap-2">
          {actions}
        </div>
      )}
    </Card>
  );
};

export default Card;