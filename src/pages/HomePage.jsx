import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  TrendingUp,
  Clock,
  Star,
  ArrowRight,
  Book,
  Laptop,
  FileText,
} from 'lucide-react';
import { listingAPI } from '../services/api';
import useAuthStore from '../store/authStore';
import { ImageCard } from '../components/Cards';
import { StatusChip } from '../components/Chip';
import Button from '../components/Button';
import { InlineSearch } from '../components/InlineForm';
import Avatar from '../components/Avatar';
import { formatDistanceToNow } from 'date-fns';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [featuredListings, setFeaturedListings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedListings();
  }, []);

  const fetchFeaturedListings = async () => {
    try {
      const response = await listingAPI.getFeatured({ limit: 8 });
      setFeaturedListings(response.data.data.listings);
    } catch (error) {
      console.error('Failed to fetch featured listings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/listings?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const categories = [
    {
      name: 'Textbooks',
      icon: Book,
      color: 'from-blue-500 to-cyan-500',
      count: '2.3k',
    },
    {
      name: 'Electronics',
      icon: Laptop,
      color: 'from-purple-500 to-pink-500',
      count: '1.8k',
    },
    {
      name: 'Notes',
      icon: FileText,
      color: 'from-amber-500 to-orange-500',
      count: '3.1k',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 280,
        damping: 24,
      },
    },
  };

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-8 py-12"
      >
        <div className="space-y-4">
          <motion.h1
            className="text-5xl md:text-6xl font-display font-extrabold tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Your Campus{' '}
            <span className="text-gradient">Marketplace</span>
          </motion.h1>
          <motion.p
            className="text-xl text-text-secondary max-w-2xl mx-auto font-serif"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Buy and sell textbooks, notes, and gadgets with fellow students.
            Fast, secure, and hassle-free.
          </motion.p>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="max-w-2xl mx-auto"
        >
          <InlineSearch
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onSearch={handleSearch}
            onClear={() => setSearchQuery('')}
            placeholder="Search for textbooks, notes, gadgets..."
            autoFocus
          />
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-4"
        >
          {isAuthenticated ? (
            <Button
              variant="accent"
              size="lg"
              onClick={() => navigate('/listings/new')}
            >
              Create Listing
            </Button>
          ) : (
            <>
              <Button
                variant="accent"
                size="lg"
                onClick={() => navigate('/register')}
              >
                Get Started
              </Button>
              <Button
                variant="elevated"
                size="lg"
                onClick={() => navigate('/listings')}
              >
                Browse Listings
              </Button>
            </>
          )}
        </motion.div>
      </motion.section>

      {/* Categories */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-display font-bold">
            Browse by Category
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.button
              key={category.name}
              variants={itemVariants}
              onClick={() => navigate(`/listings?category=${category.name.toLowerCase()}`)}
              className="group relative p-6 rounded-lg glass-strong border border-neutral-200 dark:border-ground-700 hover:border-accent-500/50 transition-all duration-220 text-left overflow-hidden"
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Gradient Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-220`}
              />

              <div className="relative flex items-start justify-between">
                <div className="space-y-3">
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${category.color}`}>
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-semibold mb-1">
                      {category.name}
                    </h3>
                    <p className="text-sm text-text-secondary">
                      {category.count} active listings
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-text-tertiary group-hover:text-accent-600 group-hover:translate-x-1 transition-all" />
              </div>
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* Featured Listings */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-display font-bold">
            Featured Listings
          </h2>
          <Link
            to="/listings"
            className="text-accent-600 hover:text-accent-700 font-medium flex items-center gap-2 group"
          >
            View all
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="card p-0 animate-pulse"
              >
                <div className="aspect-[4/3] bg-neutral-200 dark:bg-ground-700 rounded-t-lg" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-neutral-200 dark:bg-ground-700 rounded w-3/4" />
                  <div className="h-3 bg-neutral-200 dark:bg-ground-700 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredListings.map((listing, index) => (
              <motion.div key={listing._id} variants={itemVariants}>
                <ImageCard
                  image={listing.images[0]?.url}
                  title={listing.title}
                  subtitle={`${listing.category} • ${listing.condition}`}
                  price={`$${listing.price}`}
                  badge={<StatusChip status={listing.status} />}
                  footer={
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar
                          src={listing.seller?.avatar}
                          name={listing.seller?.name}
                          size="xs"
                        />
                        <span className="text-xs text-text-secondary">
                          {listing.seller?.name}
                        </span>
                      </div>
                      <span className="text-xs text-text-tertiary">
                        {formatDistanceToNow(new Date(listing.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  }
                  onClick={() => navigate(`/listings/${listing._id}`)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="py-12 px-8 rounded-2xl bg-gradient-subtle border border-accent-200 dark:border-accent-800"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-4xl font-display font-bold text-accent-600 mb-2">
              10,000+
            </p>
            <p className="text-text-secondary">Active Listings</p>
          </div>
          <div>
            <p className="text-4xl font-display font-bold text-accent-600 mb-2">
              5,000+
            </p>
            <p className="text-text-secondary">Happy Students</p>
          </div>
          <div>
            <p className="text-4xl font-display font-bold text-accent-600 mb-2">
              $2M+
            </p>
            <p className="text-text-secondary">Total Transactions</p>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;