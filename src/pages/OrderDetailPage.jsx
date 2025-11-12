import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/Cards';
import Button from '../components/Button';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-display font-bold mb-6">Order Details</h1>
      <Card elevated className="p-8">
        <p className="text-text-secondary mb-4">
          Order detail page for order #{id}
        </p>
        <Button variant="ghost" onClick={() => navigate('/orders')}>
          Back to Orders
        </Button>
      </Card>
    </div>
  );
};

export default OrderDetailPage;