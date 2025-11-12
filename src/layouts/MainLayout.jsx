import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Package,
  MessageCircle,
  ShoppingBag,
  User,
  Menu,
  X,
  Search,
  Plus,
  Moon,
  Sun,
  Bell,
  Settings,
  LogOut,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import useAuthStore from '../store/authStore';
import { chatAPI } from '../services/api';
import Avatar from '../components/Avatar';
import { IconButton } from '../components/Button';
import clsx from 'clsx';

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread message count
  useEffect(() => {
    if (isAuthenticated) {
      const fetchUnreadCount = async () => {
        try {
          const response = await chatAPI.getUnreadCount();
          setUnreadCount(response.data.data.unreadCount);
        } catch (error) {
          console.error('Failed to fetch unread count:', error);
        }
      };
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000); // Every 30s
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const mainNavItems = [
    { label: 'Home', icon: Home, path: '/' },
    { label: 'Listings', icon: Package, path: '/listings' },
    { label: 'Messages', icon: MessageCircle, path: '/chat', badge: unreadCount },
    { label: 'Orders', icon: ShoppingBag, path: '/orders' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-strong border-b border-neutral-200 dark:border-ground-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <motion.div
                className="w-10 h-10 rounded-lg bg-gradient-accent flex items-center justify-center"
                whileHover={{ rotate: 5, scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 280, damping: 24 }}
              >
                <Package className="w-6 h-6 text-white" />
              </motion.div>
              <span className="text-xl font-display font-bold text-gradient">
                Elevator Pitch
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {mainNavItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={clsx(
                      'relative px-4 py-2 rounded-md text-sm font-medium transition-colors',
                      isActive
                        ? 'text-accent-600'
                        : 'text-text-secondary hover:text-text-primary hover:bg-neutral-100 dark:hover:bg-ground-800'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                      {item.badge > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-accent-500 text-white text-xs rounded-full flex items-center justify-center"
                        >
                          {item.badge > 99 ? '99+' : item.badge}
                        </motion.span>
                      )}
                    </div>
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-accent"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <IconButton
                icon={Search}
                variant="ghost"
                label="Search"
                onClick={() => navigate('/listings')}
              />

              {/* Theme Toggle */}
              <IconButton
                icon={theme === 'dark' ? Sun : Moon}
                variant="ghost"
                label="Toggle theme"
                onClick={toggleTheme}
              />

              {isAuthenticated ? (
                <>
                  {/* Create Listing */}
                  <motion.button
                    onClick={() => navigate('/listings/new')}
                    className="hidden md:flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-accent text-white font-medium text-sm shadow-accent hover:shadow-accent-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Plus className="w-5 h-5" />
                    <span>Create Listing</span>
                  </motion.button>

                  {/* Profile Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                      className="ml-2"
                    >
                      <Avatar
                        src={user?.avatar}
                        name={user?.name}
                        size="md"
                        status="online"
                      />
                    </button>

                    <AnimatePresence>
                      {isProfileMenuOpen && (
                        <>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40"
                            onClick={() => setIsProfileMenuOpen(false)}
                          />
                          <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
                            className="absolute right-0 mt-2 w-56 glass-strong rounded-lg shadow-lg border border-neutral-200 dark:border-ground-700 overflow-hidden z-50"
                          >
                            <div className="p-3 border-b border-neutral-200 dark:border-ground-700">
                              <p className="font-medium text-sm">{user?.name}</p>
                              <p className="text-xs text-text-secondary truncate">
                                {user?.email}
                              </p>
                            </div>
                            <div className="py-1">
                              <Link
                                to="/profile"
                                className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-ground-800 transition-colors"
                                onClick={() => setIsProfileMenuOpen(false)}
                              >
                                <User className="w-4 h-4" />
                                Profile
                              </Link>
                              <Link
                                to="/settings"
                                className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-ground-800 transition-colors"
                                onClick={() => setIsProfileMenuOpen(false)}
                              >
                                <Settings className="w-4 h-4" />
                                Settings
                              </Link>
                              <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-neutral-100 dark:hover:bg-ground-800 transition-colors w-full"
                              >
                                <LogOut className="w-4 h-4" />
                                Logout
                              </button>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-md bg-gradient-accent text-white font-medium text-sm shadow-accent hover:shadow-accent-lg"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <IconButton
                icon={isMobileMenuOpen ? X : Menu}
                variant="ghost"
                label="Menu"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden"
              />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-neutral-200 dark:border-ground-700"
            >
              <nav className="px-4 py-4 space-y-2">
                {mainNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={clsx(
                      'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      location.pathname === item.path
                        ? 'bg-gradient-subtle text-accent-600'
                        : 'text-text-secondary hover:bg-neutral-100 dark:hover:bg-ground-800'
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge > 0 && (
                      <span className="px-2 py-0.5 bg-accent-500 text-white text-xs rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
                {isAuthenticated && (
                  <Link
                    to="/listings/new"
                    className="flex items-center justify-center gap-2 px-3 py-2 mt-4 rounded-md bg-gradient-accent text-white font-medium text-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Plus className="w-5 h-5" />
                    Create Listing
                  </Link>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-neutral-200 dark:border-ground-700 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-text-secondary">
            <p>&copy; 2024 Elevator Pitch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;