import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search } from 'lucide-react';
import Button from '../components/Button';

const NotFoundPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-8xl font-display font-bold mb-4 text-gradient">404</h1>
        <p className="text-2xl font-semibold mb-2">Page Not Found</p>
        <p className="text-text-secondary mb-8">
          The page you're looking for doesn't exist.
        </p>
        <div className="flex gap-4 justify-center">
          <Button variant="accent" icon={Home} onClick={() => navigate('/')}>
            Go Home
          </Button>
          <Button variant="elevated" icon={Search} onClick={() => navigate('/listings')}>
            Browse Listings
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;