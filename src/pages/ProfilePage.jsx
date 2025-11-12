import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ShoppingBag, Star, Edit, Settings } from 'lucide-react';
import { userAPI } from '../services/api';
import useAuthStore from '../store/authStore';
import { Card, StatCard, ImageCard, ProfileCard } from '../components/Cards';
import { StatusChip } from '../components/Chip';
import Button from '../components/Button';
import Avatar from '../components/Avatar';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');

  const isOwnProfile = !id || id === currentUser?.id;
  const profileUserId = id || currentUser?.id;

  useEffect(() => {
    if (profileUserId) {
      fetchProfile();
      fetchListings();
      fetchStats();
    }
  }, [profileUserId, activeTab]);

  const fetchProfile = async () => {
    try {
      const response = await userAPI.getById(profileUserId);
      setUser(response.data.data.user);
    } catch (error) {
      toast.error('Failed to load profile');
      navigate('/');
    }
  };

  const fetchListings = async () => {
    try {
      const response = await userAPI.getUserListings(profileUserId, {
        status: activeTab === 'all' ? '' : activeTab,
      });
      setListings(response.data.data.listings);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await userAPI.getUserStats(profileUserId);
      setStats(response.data.data.stats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="w-12 h-12 border-4 border-accent-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const tabs = [
    { id: 'active', label: 'Active', count: stats?.listings?.active || 0 },
    { id: 'sold', label: 'Sold', count: stats?.listings?.sold || 0 },
    { id: 'all', label: 'All', count: stats?.listings?.active + stats?.listings?.sold || 0 },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <ProfileCard
            hero
            avatar={
              <Avatar
                src={user.avatar}
                name={user.name}
                hero
                status="online"
              />
            }
            name={user.name}
            subtitle={`${user.university || 'University'} • ${user.campus || 'Campus'}`}
            stats={[
              { label: 'Listings', value: stats?.listings?.active || 0 },
              { label: 'Sold', value: stats?.totalSales || 0 },
              { label: 'Rating', value: user.rating?.average?.toFixed(1) || 'N/A' },
            ]}
            actions={
              isOwnProfile ? (
                <div className="space-y-2">
                  <Button
                    variant="elevated"
                    fullWidth
                    icon={Edit}
                    onClick={() => navigate('/settings')}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    variant="accent"
                    fullWidth
                    icon={Package}
                    onClick={() => navigate('/listings/new')}
                  >
                    Create Listing
                  </Button>
                </div>
              ) : (
                <Button
                  variant="accent"
                  fullWidth
                  onClick={() => navigate(`/chat`)}
                >
                  Send Message
                </Button>
              )
            }
          />

          {/* Bio */}
          {user.bio && (
            <Card elevated className="mt-6">
              <h3 className="font-display font-semibold mb-2">About</h3>
              <p className="text-sm text-text-secondary font-serif">
                {user.bio}
              </p>
            </Card>
          )}
        </div>

        {/* Stats Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Active Listings"
            value={stats?.listings?.active || 0}
            icon={Package}
            changeType="neutral"
          />
          <StatCard
            label="Total Sales"
            value={stats?.totalSales || 0}
            icon={ShoppingBag}
            changeType="up"
          />
          <StatCard
            label="Rating"
            value={
              user.rating?.average
                ? `${user.rating.average.toFixed(1)} / 5`
                : 'N/A'
            }
            icon={Star}
            changeType={user.rating?.average >= 4 ? 'up' : 'neutral'}
          />
        </div>
      </div>

      {/* Listings Section */}
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-accent text-white shadow-accent'
                    : 'bg-surface-elevated text-text-secondary hover:text-text-primary'
                }`}
              >
                {tab.label}
                <span className="ml-2 px-2 py-0.5 rounded-full bg-white/20 text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Listings Grid */}
        {listings.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
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
                      <span className="text-xs text-text-tertiary">
                        {listing.views} views
                      </span>
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
        ) : (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-text-tertiary mx-auto mb-4" />
            <h3 className="text-xl font-display font-semibold mb-2">
              No listings yet
            </h3>
            <p className="text-text-secondary mb-6">
              {isOwnProfile
                ? 'Create your first listing to get started'
                : 'This user has no listings yet'}
            </p>
            {isOwnProfile && (
              <Button
                variant="accent"
                onClick={() => navigate('/listings/new')}
              >
                Create Listing
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;