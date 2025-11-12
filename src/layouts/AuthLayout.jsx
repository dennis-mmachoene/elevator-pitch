import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface via-surface to-accent-50/20 dark:from-ground-900 dark:via-ground-900 dark:to-accent-900/10">
      {/* Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-accent-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Logo */}
      <div className="relative z-10 pt-8 pb-4">
        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-accent flex items-center justify-center shadow-accent-lg">
              <Package className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-display font-bold text-gradient">
              Elevator Pitch
            </span>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Outlet />
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center py-8 text-sm text-text-secondary">
        <p>&copy; 2024 Elevator Pitch. All rights reserved.</p>
      </div>
    </div>
  );
};

export default AuthLayout;