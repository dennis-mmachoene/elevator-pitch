import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, SlidersHorizontal, Grid, List, X } from 'lucide-react';
import useListingStore from '../store/listingStore';
import { ImageCard } from '../components/Cards';
import { StatusChip, Chip } from '../components/Chip';
import Button, { IconButton } from '../components/Button';
import { InlineSearch } from '../components/InlineForm';
import { Select } from '../components/Input';
import Avatar from '../components/Avatar';
import { formatDistanceToNow } from 'date-fns';

const ListingsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    listings,
    pagination,
    isLoading,
    filters,
    setFilters,
    fetchListings,
    searchListings,
  } = useListingStore();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const query = searchParams.get('q');
    const category = searchParams.get('category');
    
    if (category) {
      setFilters({ category });
    }

    if (query) {
      searchListings(query);
    } else {
      fetchListings();
    }
  }, [searchParams]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery });
    } else {
      setSearchParams({});
      fetchListings();
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    if (searchQuery) {
      searchListings(searchQuery, newFilters);
    } else {
      fetchListings(newFilters);
    }
  };

  const handleClearFilters = () => {
    setFilters({
      category: '',
      condition: '',
      minPrice: '',
      maxPrice: '',
      sort: '-createdAt',
    });
    setSearchQuery('');
    setSearchParams({});
    fetchListings();
  };

  const handlePageChange = (page) => {
    fetchListings({ ...filters, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'textbooks', label: 'Textbooks' },
    { value: 'notes', label: 'Notes' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'gadgets', label: 'Gadgets' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'other', label: 'Other' },
  ];

  const conditions = [
    { value: '', label: 'Any Condition' },
    { value: 'new', label: 'New' },
    { value: 'like-new', label: 'Like New' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' },
  ];

  const sortOptions = [
    { value: '-createdAt', label: 'Newest First' },
    { value: 'createdAt', label: 'Oldest First' },
    { value: 'price', label: 'Price: Low to High' },
    { value: '-price', label: 'Price: High to Low' },
  ];

  const activeFiltersCount = Object.values(filters).filter(
    (v) => v && v !== '-createdAt'
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">
            {searchQuery ? 'Search Results' : 'Browse Listings'}
          </h1>
          <p className="text-text-secondary">
            {pagination.total} {pagination.total === 1 ? 'listing' : 'listings'} found
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-surface-elevated">
            <IconButton
              icon={Grid}
              variant={viewMode === 'grid' ? 'accent' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              label="Grid view"
            />
            <IconButton
              icon={List}
              variant={viewMode === 'list' ? 'accent' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              label="List view"
            />
          </div>

          {/* Filter Toggle */}
          <Button
            variant={showFilters ? 'accent' : 'elevated'}
            onClick={() => setShowFilters(!showFilters)}
            icon={SlidersHorizontal}
          >
            Filters
            {activeFiltersCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <InlineSearch
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onSearch={handleSearch}
        onClear={() => {
          setSearchQuery('');
          setSearchParams({});
          fetchListings();
        }}
        placeholder="Search for textbooks, notes, gadgets..."
      />

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="card p-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold">Filters</h3>
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearFilters}
                    icon={X}
                  >
                    Clear All
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select
                  label="Category"
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  options={categories}
                />

                <Select
                  label="Condition"
                  value={filters.condition}
                  onChange={(e) => handleFilterChange('condition', e.target.value)}
                  options={conditions}
                />

                <Select
                  label="Sort By"
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  options={sortOptions}
                />

                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min Price"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="input w-full"
                    min="0"
                  />
                  <input
                    type="number"
                    placeholder="Max Price"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="input w-full"
                    min="0"
                  />
                </div>
              </div>

              {/* Active Filters */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2 pt-4 border-t border-neutral-200 dark:border-ground-700">
                  {filters.category && (
                    <Chip
                      variant="accent"
                      onRemove={() => handleFilterChange('category', '')}
                    >
                      {filters.category}
                    </Chip>
                  )}
                  {filters.condition && (
                    <Chip
                      variant="accent"
                      onRemove={() => handleFilterChange('condition', '')}
                    >
                      {filters.condition}
                    </Chip>
                  )}
                  {filters.minPrice && (
                    <Chip
                      variant="accent"
                      onRemove={() => handleFilterChange('minPrice', '')}
                    >
                      Min: ${filters.minPrice}
                    </Chip>
                  )}
                  {filters.maxPrice && (
                    <Chip
                      variant="accent"
                      onRemove={() => handleFilterChange('maxPrice', '')}
                    >
                      Max: ${filters.maxPrice}
                    </Chip>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      {isLoading && (
        <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1'} gap-6`}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card p-0 animate-pulse">
              <div className="aspect-[4/3] bg-neutral-200 dark:bg-ground-700 rounded-t-lg" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-neutral-200 dark:bg-ground-700 rounded w-3/4" />
                <div className="h-3 bg-neutral-200 dark:bg-ground-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Listings Grid/List */}
      {!isLoading && listings.length > 0 && (
        <motion.div
          className={`grid ${
            viewMode === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
              : 'grid-cols-1'
          } gap-6`}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.05 },
            },
          }}
        >
          {listings.map((listing) => (
            <motion.div
              key={listing._id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
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
                      <span className="text-xs text-text-secondary truncate">
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
        </motion.div>
      )}

      {/* Empty State */}
      {!isLoading && listings.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-neutral-100 dark:bg-ground-800 mb-4">
            <Filter className="w-10 h-10 text-text-tertiary" />
          </div>
          <h3 className="text-xl font-display font-semibold mb-2">
            No listings found
          </h3>
          <p className="text-text-secondary mb-6">
            Try adjusting your filters or search query
          </p>
          <Button variant="accent" onClick={handleClearFilters}>
            Clear Filters
          </Button>
        </motion.div>
      )}

      {/* Pagination */}
      {!isLoading && pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8">
          <Button
            variant="elevated"
            disabled={pagination.page === 1}
            onClick={() => handlePageChange(pagination.page - 1)}
          >
            Previous
          </Button>
          
          <div className="flex items-center gap-1">
            {[...Array(pagination.pages)].map((_, i) => {
              const page = i + 1;
              const isCurrentPage = page === pagination.page;
              const showPage =
                page === 1 ||
                page === pagination.pages ||
                Math.abs(page - pagination.page) <= 1;

              if (!showPage && page === 2) {
                return <span key={page} className="px-2">...</span>;
              }
              if (!showPage && page === pagination.pages - 1) {
                return <span key={page} className="px-2">...</span>;
              }
              if (!showPage) return null;

              return (
                <Button
                  key={page}
                  variant={isCurrentPage ? 'accent' : 'ghost'}
                  onClick={() => handlePageChange(page)}
                  className="min-w-[40px]"
                >
                  {page}
                </Button>
              );
            })}
          </div>

          <Button
            variant="elevated"
            disabled={pagination.page === pagination.pages}
            onClick={() => handlePageChange(pagination.page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default ListingsPage;