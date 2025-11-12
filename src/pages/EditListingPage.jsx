import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/Cards';
import Button from '../components/Button';

const EditListingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-display font-bold mb-6">Edit Listing</h1>
      <Card elevated className="p-8">
        <p className="text-text-secondary mb-4">
          Edit functionality coming soon. For now, you can delete and recreate the listing.
        </p>
        <Button variant="ghost" onClick={() => navigate(`/listings/${id}`)}>
          Back to Listing
        </Button>
      </Card>
    </div>
  );
};

export default EditListingPage;