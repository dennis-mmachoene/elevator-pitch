import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  X,
  Image as ImageIcon,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import { uploadAPI, listingAPI } from '../services/api';
import { Card } from '../components/Cards';
import Button from '../components/Button';
import Input, { Textarea, Select } from '../components/Input';
import { Chip } from '../components/Chip';
import toast from 'react-hot-toast';

const CreateListingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    condition: '',
    price: '',
    originalPrice: '',
    images: [],
    location: {
      university: user?.university || '',
      campus: user?.campus || '',
      building: '',
    },
    tags: [],
    isNegotiable: true,
  });

  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});

  const categories = [
    { value: 'textbooks', label: 'Textbooks' },
    { value: 'notes', label: 'Notes' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'gadgets', label: 'Gadgets' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'other', label: 'Other' },
  ];

  const conditions = [
    { value: 'new', label: 'New' },
    { value: 'like-new', label: 'Like New' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' },
  ];

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({ ...formData, [field]: value });
    }

    // Clear error
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    if (formData.images.length + files.length > 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }

    setIsUploadingImages(true);

    try {
      const uploadedImages = [];
      
      for (const file of files) {
        const response = await uploadAPI.uploadImage(file);
        uploadedImages.push(response.data.data.image);
      }

      setFormData({
        ...formData,
        images: [...formData.images, ...uploadedImages],
      });

      toast.success(`${files.length} image(s) uploaded`);
    } catch (error) {
      toast.error('Failed to upload images');
    } finally {
      setIsUploadingImages(false);
    }
  };

  const handleRemoveImage = async (index) => {
    const image = formData.images[index];
    
    try {
      await uploadAPI.deleteImage(image.publicId);
      setFormData({
        ...formData,
        images: formData.images.filter((_, i) => i !== index),
      });
      toast.success('Image removed');
    } catch (error) {
      toast.error('Failed to remove image');
    }
  };

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    
    if (!tag) return;
    
    if (formData.tags.includes(tag)) {
      toast.error('Tag already added');
      return;
    }

    setFormData({
      ...formData,
      tags: [...formData.tags, tag],
    });
    setTagInput('');
  };

  const handleRemoveTag = (tag) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.title.trim()) {
        newErrors.title = 'Title is required';
      }
      if (!formData.description.trim()) {
        newErrors.description = 'Description is required';
      }
      if (!formData.category) {
        newErrors.category = 'Category is required';
      }
      if (!formData.condition) {
        newErrors.condition = 'Condition is required';
      }
    }

    if (step === 2) {
      if (!formData.price) {
        newErrors.price = 'Price is required';
      } else if (parseFloat(formData.price) < 0) {
        newErrors.price = 'Price must be positive';
      }
      if (!formData.location.university.trim()) {
        newErrors['location.university'] = 'University is required';
      }
      if (!formData.location.campus.trim()) {
        newErrors['location.campus'] = 'Campus is required';
      }
    }

    if (step === 3) {
      if (formData.images.length === 0) {
        newErrors.images = 'At least one image is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);

    try {
      const response = await listingAPI.create(formData);
      const listingId = response.data.data.listing._id;
      
      toast.success('Listing created successfully!');
      navigate(`/listings/${listingId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, title: 'Basic Info' },
    { number: 2, title: 'Pricing & Location' },
    { number: 3, title: 'Images & Tags' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">
          Create New Listing
        </h1>
        <p className="text-text-secondary">
          Fill in the details to list your item
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex items-center gap-3">
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep >= step.number
                    ? 'bg-gradient-accent text-white'
                    : 'bg-neutral-200 dark:bg-ground-700 text-text-tertiary'
                }`}
                animate={{
                  scale: currentStep === step.number ? 1.1 : 1,
                }}
              >
                {step.number}
              </motion.div>
              <span
                className={`text-sm font-medium ${
                  currentStep >= step.number
                    ? 'text-text-primary'
                    : 'text-text-tertiary'
                }`}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-4 bg-neutral-200 dark:bg-ground-700">
                <motion.div
                  className="h-full bg-gradient-accent"
                  initial={{ width: 0 }}
                  animate={{
                    width: currentStep > step.number ? '100%' : '0%',
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Form Card */}
      <Card elevated className="p-8">
        <AnimatePresence mode="wait">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Input
                label="Title"
                value={formData.title}
                onChange={handleChange('title')}
                error={errors.title}
                placeholder="e.g., Introduction to Algorithms - 3rd Edition"
                required
              />

              <Textarea
                label="Description"
                value={formData.description}
                onChange={handleChange('description')}
                error={errors.description}
                placeholder="Describe the item, its condition, and any other relevant details..."
                rows={6}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Category"
                  value={formData.category}
                  onChange={handleChange('category')}
                  options={categories}
                  error={errors.category}
                  placeholder="Select category"
                  required
                />

                <Select
                  label="Condition"
                  value={formData.condition}
                  onChange={handleChange('condition')}
                  options={conditions}
                  error={errors.condition}
                  placeholder="Select condition"
                  required
                />
              </div>
            </motion.div>
          )}

          {/* Step 2: Pricing & Location */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange('price')}
                  error={errors.price}
                  placeholder="45.00"
                  min="0"
                  step="0.01"
                  required
                />

                <Input
                  label="Original Price (Optional)"
                  type="number"
                  value={formData.originalPrice}
                  onChange={handleChange('originalPrice')}
                  placeholder="80.00"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="negotiable"
                  checked={formData.isNegotiable}
                  onChange={(e) =>
                    setFormData({ ...formData, isNegotiable: e.target.checked })
                  }
                  className="w-4 h-4 text-accent-600 rounded focus:ring-accent-500"
                />
                <label htmlFor="negotiable" className="text-sm font-medium">
                  Price is negotiable
                </label>
              </div>

              <div className="pt-4 border-t border-neutral-200 dark:border-ground-700">
                <h3 className="font-semibold mb-4">Location</h3>
                <div className="space-y-4">
                  <Input
                    label="University"
                    value={formData.location.university}
                    onChange={handleChange('location.university')}
                    error={errors['location.university']}
                    placeholder="University Name"
                    required
                  />

                  <Input
                    label="Campus"
                    value={formData.location.campus}
                    onChange={handleChange('location.campus')}
                    error={errors['location.campus']}
                    placeholder="Main Campus"
                    required
                  />

                  <Input
                    label="Building (Optional)"
                    value={formData.location.building}
                    onChange={handleChange('location.building')}
                    placeholder="Library, Building A, etc."
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Images & Tags */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Images <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {formData.images.map((image, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative aspect-square rounded-lg overflow-hidden group"
                    >
                      <img
                        src={image.url}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}

                  {/* Upload Button */}
                  {formData.images.length < 10 && (
                    <label className="relative aspect-square rounded-lg border-2 border-dashed border-neutral-300 dark:border-ground-600 hover:border-accent-500 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 group">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={isUploadingImages}
                      />
                      {isUploadingImages ? (
                        <div className="w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <ImageIcon className="w-8 h-8 text-text-tertiary group-hover:text-accent-600" />
                          <span className="text-xs text-text-tertiary group-hover:text-accent-600">
                            Add Image
                          </span>
                        </>
                      )}
                    </label>
                  )}
                </div>
                {errors.images && (
                  <p className="text-sm text-red-600">{errors.images}</p>
                )}
                <p className="text-xs text-text-tertiary">
                  Upload up to 10 images. First image will be the cover.
                </p>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tags (Optional)
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="Add a tag..."
                    className="input flex-1"
                  />
                  <Button onClick={handleAddTag} variant="elevated">
                    Add
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Chip
                        key={tag}
                        variant="accent"
                        onRemove={() => handleRemoveTag(tag)}
                      >
                        #{tag}
                      </Chip>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-neutral-200 dark:border-ground-700">
          <Button
            variant="ghost"
            onClick={handleBack}
            icon={ChevronLeft}
            disabled={currentStep === 1}
          >
            Back
          </Button>

          {currentStep < 3 ? (
            <Button
              variant="accent"
              onClick={handleNext}
              iconRight={ChevronRight}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="accent"
              onClick={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Create Listing
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default CreateListingPage;