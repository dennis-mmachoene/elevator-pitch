import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  Heart,
  Share2,
  MessageCircle,
  MapPin,
  Calendar,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Package,
} from 'lucide-react';
import { listingAPI, userAPI, chatAPI } from '../services/api';
import useAuthStore from '../store/authStore';
import { Card, ImageCard, ProfileCard } from '../components/Cards';
import { StatusChip, Chip } from '../components/Chip';
import Button, { IconButton } from '../components/Button';
import Avatar from '../components/Avatar';
import toast from 'react-hot-toast';
import { formatDistanceToNow, format } from 'date-fns';

const ListingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [listing, setListing] = useState(null);
  const [similarListings, setSimilarListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchListing();
    fetchSimilarListings();
  }, [id]);

  const fetchListing = async () => {
    try {
      const response = await listingAPI.getById(id);
      setListing(response.data.data.listing);
      
      // Check if saved
      if (isAuthenticated && user?.savedListings) {
        setIsSaved(user.savedListings.includes(id));
      }
    } catch (error) {
      toast.error('Failed to load listing');
      navigate('/listings');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSimilarListings = async () => {
    try {
      const response = await listingAPI.getSimilar(id);
      setSimilarListings(response.data.data.listings);
    } catch (error) {
      console.error('Failed to fetch similar listings:', error);
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to save listings');
      navigate('/login');
      return;
    }

    try {
      await userAPI.toggleSaveListing(id);
      setIsSaved(!isSaved);
      toast.success(isSaved ? 'Removed from saved' : 'Saved successfully');
    } catch (error) {
      toast.error('Failed to save listing');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing.title,
          text: listing.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share failed:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const handleContactSeller = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to contact seller');
      navigate('/login');
      return;
    }

    if (listing.seller._id === user?.id) {
      toast.error('You cannot message yourself');
      return;
    }

    try {
      const response = await chatAPI.getOrCreate({
        listingId: listing._id,
        sellerId: listing.seller._id,
      });
      const chatId = response.data.data.chat._id;
      navigate(`/chat/${chatId}`);
    } catch (error) {
      toast.error('Failed to start chat');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await listingAPI.delete(id);
      toast.success('Listing deleted successfully');
      navigate('/profile');
    } catch (error) {
      toast.error('Failed to delete listing');
      setIsDeleting(false);
    }
  };

  const handleMarkAsSold = async () => {
    try {
      await listingAPI.markAsSold(id);
      setListing({ ...listing, status: 'sold' });
      toast.success('Marked as sold');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-96 bg-neutral-200 dark:bg-ground-700 rounded-lg" />
          <div className="space-y-4">
            <div className="h-8 bg-neutral-200 dark:bg-ground-700 rounded w-3/4" />
            <div className="h-4 bg-neutral-200 dark:bg-ground-700 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!listing) return null;

  const isOwner = user?.id === listing.seller._id;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        icon={ChevronLeft}
        onClick={() => navigate(-1)}
      >
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Images & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <Card elevated className="p-0 overflow-hidden">
            <div className="relative aspect-[4/3] bg-neutral-100 dark:bg-ground-800">
              <motion.img
                key={currentImageIndex}
                src={listing.images[currentImageIndex]?.url}
                alt={listing.title}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />

              {/* Image Navigation */}
              {listing.images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setCurrentImageIndex((prev) =>
                        prev === 0 ? listing.images.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full glass-strong hover:bg-white/20 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentImageIndex((prev) =>
                        prev === listing.images.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full glass-strong hover:bg-white/20 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6 rotate-180" />
                  </button>
                </>
              )}

              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <StatusChip status={listing.status} />
              </div>
            </div>

            {/* Thumbnail Strip */}
            {listing.images.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto">
                {listing.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? 'border-accent-500'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${listing.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </Card>

          {/* Details */}
          <Card elevated>
            <div className="space-y-6">
              {/* Title & Price */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-3xl font-display font-bold mb-2">
                      {listing.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-2">
                      <Chip variant="default">{listing.category}</Chip>
                      <Chip variant="default">{listing.condition}</Chip>
                      {listing.isNegotiable && (
                        <Chip variant="accent">Negotiable</Chip>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-display font-bold text-accent-600">
                      ${listing.price}
                    </p>
                    {listing.originalPrice && (
                      <p className="text-sm text-text-tertiary line-through">
                        ${listing.originalPrice}
                      </p>
                    )}
                  </div>
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {listing.views} views
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {listing.saves} saves
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDistanceToNow(new Date(listing.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="prose prose-sm max-w-none">
                <h3 className="text-lg font-display font-semibold mb-2">
                  Description
                </h3>
                <p className="text-text-secondary whitespace-pre-wrap font-serif">
                  {listing.description}
                </p>
              </div>

              {/* Location */}
              <div className="pt-4 border-t border-neutral-200 dark:border-ground-700">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-accent-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">
                      {listing.location.university}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {listing.location.campus}
                      {listing.location.building &&
                        ` • ${listing.location.building}`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {listing.tags && listing.tags.length > 0 && (
                <div className="pt-4 border-t border-neutral-200 dark:border-ground-700">
                  <div className="flex flex-wrap gap-2">
                    {listing.tags.map((tag, index) => (
                      <Chip key={index} size="sm">
                        #{tag}
                      </Chip>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column - Seller & Actions */}
        <div className="space-y-6">
          {/* Seller Card */}
          <ProfileCard
            avatar={
              <Avatar
                src={listing.seller.avatar}
                name={listing.seller.name}
                size="xl"
                status="online"
              />
            }
            name={listing.seller.name}
            subtitle={`${listing.seller.university || 'University'} • ${listing.seller.campus || 'Campus'}`}
            stats={[
              { label: 'Listings', value: listing.seller.listingCount || 0 },
              {
                label: 'Rating',
                value: listing.seller.rating?.average?.toFixed(1) || 'N/A',
              },
            ]}
            actions={
              !isOwner && (
                <Button
                  variant="accent"
                  fullWidth
                  icon={MessageCircle}
                  onClick={handleContactSeller}
                >
                  Contact Seller
                </Button>
              )
            }
          />

          {/* Actions */}
          <Card elevated>
            <div className="space-y-3">
              {isOwner ? (
                <>
                  <Button
                    variant="elevated"
                    fullWidth
                    icon={Edit}
                    onClick={() => navigate(`/listings/${id}/edit`)}
                  >
                    Edit Listing
                  </Button>
                  {listing.status === 'active' && (
                    <Button
                      variant="elevated"
                      fullWidth
                      icon={CheckCircle}
                      onClick={handleMarkAsSold}
                    >
                      Mark as Sold
                    </Button>
                  )}
                  <Button
                    variant="danger"
                    fullWidth
                    icon={Trash2}
                    onClick={handleDelete}
                    loading={isDeleting}
                  >
                    Delete Listing
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant={isSaved ? 'elevated' : 'ghost'}
                    fullWidth
                    icon={Heart}
                    onClick={handleSave}
                  >
                    {isSaved ? 'Saved' : 'Save Listing'}
                  </Button>
                  <Button
                    variant="ghost"
                    fullWidth
                    icon={Share2}
                    onClick={handleShare}
                  >
                    Share
                  </Button>
                </>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Similar Listings */}
      {similarListings.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-display font-bold">Similar Listings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarListings.map((item) => (
              <ImageCard
                key={item._id}
                image={item.images[0]?.url}
                title={item.title}
                subtitle={`${item.category} • ${item.condition}`}
                price={`$${item.price}`}
                badge={<StatusChip status={item.status} />}
                onClick={() => navigate(`/listings/${item._id}`)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingDetailPage;