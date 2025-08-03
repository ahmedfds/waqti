/**
 * Create Service Page
 *
 * This component renders a form to create a new service.
 */

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDropzone } from 'react-dropzone';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { motion } from 'framer-motion';

interface CreateServicePageProps {
  setActivePage: (page: string) => void;
}

const serviceCategories = [
  'Design',
  'Teaching',
  'Programming',
  'Translation',
  'Writing',
  'Music',
  'Cooking',
  'Photography',
  'Consulting',
  'Marketing',
  'Video Editing',
  'Data Entry'
];

const exchangeTypes = [
  { value: 'time', label: 'Time Exchange Only' },
  { value: 'money', label: 'Money Payment Only' },
  { value: 'hybrid', label: 'Both Time & Money' }
];

const CreateServicePage: React.FC<CreateServicePageProps> = ({ setActivePage }) => {
  const { t, isRTL } = useLanguage();
  const { user } = useAuth();
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  /**
   * Form validation schema
   */
  const validationSchema = Yup.object({
    title: Yup.string()
      .min(10, 'Title must be at least 10 characters')
      .max(100, 'Title must be less than 100 characters')
      .required('Title is required'),
    description: Yup.string()
      .min(50, 'Description must be at least 50 characters')
      .max(1000, 'Description must be less than 1000 characters')
      .required('Description is required'),
    category: Yup.string().required('Category is required'),
    exchangeType: Yup.string().required('Exchange type is required'),
    hourlyRate: Yup.number()
      .min(1, 'Hourly rate must be at least 1 hour')
      .max(10, 'Hourly rate cannot exceed 10 hours')
      .required('Hourly rate is required'),
    location: Yup.string().required('Location is required'),
    duration: Yup.number()
      .min(1, 'Duration must be at least 1 hour')
      .required('Duration is required'),
    keywords: Yup.string()
      .min(5, 'Keywords must be at least 5 characters')
      .required('Keywords are required'),
    moneyPrice: Yup.number().when('exchangeType', {
      is: (val: string) => val === 'money' || val === 'hybrid',
      then: (schema) => schema.min(1, 'Price must be greater than 0').required('Price is required'),
      otherwise: (schema) => schema.notRequired()
    }),
    suggestedExchange: Yup.string().when('exchangeType', {
      is: (val: string) => val === 'time' || val === 'hybrid',
      then: (schema) => schema.min(10, 'Suggested exchange must be at least 10 characters').required('Suggested exchange is required'),
      otherwise: (schema) => schema.notRequired()
    })
  });

  /**
   * Formik form instance
   */
  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      category: '',
      exchangeType: 'time',
      hourlyRate: 1,
      location: '',
      duration: 1,
      keywords: '',
      moneyPrice: 0,
      suggestedExchange: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!user) {
        setActivePage('login');
        return;
      }

      setIsSubmitting(true);
      setError('');

      try {
        const formData = new FormData();
        Object.keys(values).forEach(key => {
          formData.append(key, values[key as keyof typeof values].toString());
        });

        images.forEach(file => formData.append('images', file));
        videos.forEach(file => formData.append('videos', file));

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setActivePage('dashboard');
      } catch (err) {
        setError('Failed to create service. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  /**
   * Image upload handler
   * @param {File[]} acceptedFiles - List of accepted files
   */
  const onImageDrop = (acceptedFiles: File[]) => {
    setImages(prev => [...prev, ...acceptedFiles.slice(0, 5 - prev.length)]);
  };

  /**
   * Video upload handler
   * @param {File[]} acceptedFiles - List of accepted files
   */
  const onVideoDrop = (acceptedFiles: File[]) => {
    setVideos(prev => [...prev, ...acceptedFiles.slice(0, 2 - prev.length)]);
  };

  /**
   * Remove an image from the list
   * @param {number} index - Index of the image to remove
   */
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  /**
   * Remove a video from the list
   * @param {number} index - Index of the video to remove
   */
  const removeVideo = (index: number) => {
    setVideos(prev => prev.filter((_, i) => i !== index));
  };

  if (!user) {
    setActivePage('login');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#2E86AB] mb-2">Create New Service</h1>
          <p className="text-gray-600">Share your skills and start earning time credits</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-[#2E86AB]">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-2">Service Title</label>
                <input
                  type="text"
                  {...formik.getFieldProps('title')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E86AB]"
                  placeholder="e.g., Professional Web Development Services"
                />
                {formik.touched.title && formik.errors.title && (
                  <div className="text-red-600 text-sm mt-1">{formik.errors.title}</div>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Category</label>
                <select
                  {...formik.getFieldProps('category')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E86AB]"
                >
                  <option value="">Select a category</option>
                  {serviceCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {formik.touched.category && formik.errors.category && (
                  <div className="text-red-600 text-sm mt-1">{formik.errors.category}</div>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Location</label>
                <input
                  type="text"
                  {...formik.getFieldProps('location')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E86AB]"
                  placeholder="e.g., Dubai, UAE"
                />
                {formik.touched.location && formik.errors.location && (
                  <div className="text-red-600 text-sm mt-1">{formik.errors.location}</div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-2">Description</label>
                <textarea
                  {...formik.getFieldProps('description')}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E86AB]"
                  placeholder="Describe your service in detail..."
                />
                {formik.touched.description && formik.errors.description && (
