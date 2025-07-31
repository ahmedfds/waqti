import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, CheckCircle, ChevronDown } from 'lucide-react';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  thumbnail: File | null;
  images: File[];
  projectUrl?: string;
  skills: string[];
}

interface BusinessGalleryStepProps {
  formData: {
    portfolioItems: PortfolioItem[];
    certificates: File[];
    testimonials: Array<{
      clientName: string;
      clientCompany?: string;
      rating: number;
      comment: string;
      projectTitle: string;
    }>;
  };
  onUpdate: (data: any) => void;
}

const BusinessGalleryStep: React.FC<BusinessGalleryStepProps> = ({ formData, onUpdate }) => {
  const [currentPortfolioItem, setCurrentPortfolioItem] = React.useState(0);

  const onThumbnailDrop = useCallback((acceptedFiles: File[], portfolioIndex: number) => {
    const file = acceptedFiles[0];
    if (file) {
      const newItems = [...formData.portfolioItems];
      newItems[portfolioIndex] = { ...newItems[portfolioIndex], thumbnail: file };
      onUpdate({ ...formData, portfolioItems: newItems });
    }
  }, [formData, onUpdate]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (files) => onThumbnailDrop(files, currentPortfolioItem),
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif'] },
    maxFiles: 1
  });

  const updatePortfolioItem = (index: number, field: string, value: any) => {
    const newItems = [...formData.portfolioItems];
    newItems[index] = { ...newItems[index], [field]: value };
    onUpdate({ ...formData, portfolioItems: newItems });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Add portfolio</h2>
        <p className="text-gray-600 mt-2">Add your portfolio</p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <p className="text-gray-700 mb-4">
          Add your top 3 recent works that demonstrate your expertise in your field. The Waqti team will review the works before accepting your application.
        </p>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• Add work that you have done yourself and that is not copied or transferred.</li>
          <li>• Ensure that the work is distinctive and of high quality.</li>
          <li>• Write a clear title and an accurate description that explains the features of the business.</li>
          <li>• Do not send blank or duplicate work.</li>
        </ul>
      </div>

      <div className="space-y-6">
        {formData.portfolioItems.map((item, index) => (
          <div key={item.id} className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPortfolioItem(index)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                >
                  <ChevronDown className="h-4 w-4" />
                  <h3 className="text-lg font-semibold">Work {index + 1} of 3</h3>
                </button>
              </div>
              <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                {item.title && item.description && item.thumbnail ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <span className="text-xs text-gray-400">{index + 1}</span>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="text-red-500">*</span> Work title
                </label>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updatePortfolioItem(index, 'title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#2E86AB] focus:border-[#2E86AB]"
                  placeholder="Include a brief title that accurately describes the work"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="text-red-500">*</span> Thumbnail
                </label>
                <div
                  {...getRootProps()}
                  onClick={() => setCurrentPortfolioItem(index)}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-[#2E86AB] transition-colors"
                >
                  <input {...getInputProps()} />
                  {item.thumbnail ? (
                    <div className="space-y-2">
                      <img
                        src={URL.createObjectURL(item.thumbnail)}
                        alt="Thumbnail"
                        className="w-24 h-24 object-cover rounded-lg mx-auto"
                      />
                      <p className="text-sm text-green-600">✓ Image uploaded</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto" />
                      <p className="text-gray-600">Drag image here</p>
                      <p className="text-sm text-gray-500">Or click to select manually</p>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Add an attractive image that expresses the work
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="text-red-500">*</span> Job description
                </label>
                <textarea
                  value={item.description}
                  onChange={(e) => updatePortfolioItem(index, 'description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#2E86AB] focus:border-[#2E86AB]"
                  placeholder="Add a detailed description that explains the features of the job"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default BusinessGalleryStep;