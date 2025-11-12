import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ShoppingBag, Clock, CheckCircle } from 'lucide-react';
import { orderAPI } from '../services/api';
import { Card } from '../components/Cards';
import { StatusChip } from '../components/Chip';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import toast from 'react-hot-toast';
import { formatDistanceToNow, format } from 'date-fns';

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [roleFilter, setRoleFilter] = useState('buyer');

  useEffect(() => {
    fetchOrders();
  }, [activeTab, roleFilter]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await orderAPI.getAll({
        role: roleFilter,
        status: activeTab === 'all' ? '' : activeTab,
      });
      setOrders(response.data.data.orders);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      confirmed: 'accent',
      'meetup-scheduled': 'accent',
      'in-progress': 'accent',
      completed: 'success',
      cancelled: 'error',
      disputed: 'error',
    };
    return colors[status] || 'default';
  };

  const tabs = [
    { id: 'all', label: 'All Orders' },
    { id: 'pending', label: 'Pending' },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="w-12 h-12 border-4 border-accent-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Orders</h1>
          <p className="text-text-secondary">
            Manage your purchases and sales
          </p>
        </div>

        {/* Role Toggle */}
        <div className="flex gap-2 p-1 rounded-lg bg-surface-elevated">
          <button
            onClick={() => setRoleFilter('buyer')}
            className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${
              roleFilter === 'buyer'
                ? 'bg-gradient-accent text-white shadow-accent'
                : 'text-text-secondary'
            }`}
          >
            <ShoppingBag className="w-4 h-4 inline-block mr-2" />
            Purchases
          </button>
          <button
            onClick={() => setRoleFilter('seller')}
            className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${
              roleFilter === 'seller'
                ? 'bg-gradient-accent text-white shadow-accent'
                : 'text-text-secondary'
            }`}
          >
            <Package className="w-4 h-4 inline-block mr-2" />
            Sales
          </button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-subtle border-accent-200 dark:border-accent-800 text-accent-700 dark:text-accent-400'
                : 'bg-surface-elevated text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => {
            const otherParty = roleFilter === 'buyer' ? order.seller : order.buyer;
            
            return (
              <Card
                key={order._id}
                elevated
                hover
                onClick={() => navigate(`/orders/${order._id}`)}
              >
                <div className="flex items-start gap-4">
                  {/* Listing Image */}
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-neutral-100 dark:bg-ground-800 flex-shrink-0">
                    <img
                      src={order.listing?.images?.[0]}
                      alt={order.listingSnapshot?.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Order Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-display font-semibold mb-1">
                          {order.listingSnapshot?.title || 'Untitled'}
                        </h3>
                        <p className="text-sm text-text-secondary">
                          Order #{order.orderNumber}
                        </p>
                      </div>
                      <StatusChip
                        status={order.status}
                        variant={getStatusColor(order.status)}
                      />
                    </div>

                    <div className="flex items-center gap-4 text-sm text-text-secondary mb-3">
                      <div className="flex items-center gap-2">
                        <Avatar
                          src={otherParty?.avatar}
                          name={otherParty?.name}
                          size="xs"
                        />
                        <span>{otherParty?.name}</span>
                      </div>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDistanceToNow(new Date(order.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xl font-display font-bold text-accent-600">
                        ${order.finalPrice}
                      </span>
                      <Button variant="ghost" size="sm">
                        View Details →
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <Package className="w-16 h-16 text-text-tertiary mx-auto mb-4" />
          <h3 className="text-xl font-display font-semibold mb-2">
            No orders yet
          </h3>
          <p className="text-text-secondary mb-6">
            {roleFilter === 'buyer'
              ? 'Start shopping to create your first order'
              : 'Your sales will appear here'}
          </p>
          <Button variant="accent" onClick={() => navigate('/listings')}>
            Browse Listings
          </Button>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;