import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';

interface ProfileStepProps {
  formData: {
    jobTitle: string;
    specialization: string;
    introduction: string;
    skills: string[];
    hourlyRate: number;
    availability: 'full_time' | 'part_time' | 'weekends';
    languages: Array<{
      language: string;
      proficiency: 'basic' | 'intermediate' | 'advanced' | 'native';
    }>;
  };
  onUpdate: (data: any) => void;
}

const ProfileStep: React.FC<ProfileStepProps> = ({ formData, onUpdate }) => {
  const [currentSkill, setCurrentSkill] = useState('');

  const specializations = [
    'Programming, website and application development',
    'Graphic Design and Visual Identity',
    'Digital Marketing and Social Media',
    'Content Writing and Translation',
    'Video and Audio Editing',
    'Business Consulting',
    'Data Analysis and Research',
    'Photography and Videography',
    'UI/UX Design',
    'Mobile App Development'
  ];

  const suggestedSkills = [
    'Python', 'User Interface Design', 'psychology', 'Product label design',
    'Interior design', 'jQuery', 'e-marketing', 'Troubleshooting',
    'Create a landing page', 'Startup Consulting', 'Facebook marketing',
    'video editing', 'Flyer design', 'Proofreading', 'Content rewriting'
  ];

  const handleInputChange = (field: string, value: any) => {
    onUpdate({ ...formData, [field]: value });
  };

  const handleAddSkill = () => {
    if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
      handleInputChange('skills', [...formData.skills, currentSkill.trim()]);
      setCurrentSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    handleInputChange('skills', formData.skills.filter(skill => skill !== skillToRemove));
  };

  const handleAddSuggestedSkill = (skill: string) => {
    if (!formData.skills.includes(skill)) {
      handleInputChange('skills', [...formData.skills, skill]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Complete account information</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <span className="text-red-500">*</span> Job title
          </label>
          <input
            type="text"
            value={formData.jobTitle}
            onChange={(e) => handleInputChange('jobTitle', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#2E86AB] focus:border-[#2E86AB]"
            placeholder="مسوق رقمي"
          />
          <p className="text-xs text-gray-500 mt-1">Enter a job title such as: Architect</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <span className="text-red-500">*</span> Specialization
          </label>
          <select
            value={formData.specialization}
            onChange={(e) => handleInputChange('specialization', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#2E86AB] focus:border-[#2E86AB]"
          >
            <option value="">Choose your field of work</option>
            {specializations.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <span className="text-red-500">*</span> Introduction
        </label>
        <textarea
          value={formData.introduction}
          onChange={(e) => handleInputChange('introduction', e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#2E86AB] focus:border-[#2E86AB]"
          placeholder="مرحباً"
        />
        <p className="text-xs text-gray-500 mt-1">
          Add a resume that tells about yourself, your education, experience, and skills
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <span className="text-red-500">*</span> Skills
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={currentSkill}
            onChange={(e) => setCurrentSkill(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#2E86AB] focus:border-[#2E86AB]"
            placeholder="Add your skills, experiences and specializations"
          />
          <button
            type="button"
            onClick={handleAddSkill}
            className="px-4 py-2 bg-[#2E86AB] text-white rounded-lg hover:bg-[#1e5f7a]"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {formData.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {formData.skills.map(skill => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-3 py-1 bg-[#2E86AB] text-white text-sm rounded-full"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-white hover:text-gray-200"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Suggested skills</p>
          <div className="flex flex-wrap gap-2">
            {suggestedSkills.map(skill => (
              <button
                key={skill}
                type="button"
                onClick={() => handleAddSuggestedSkill(skill)}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  formData.skills.includes(skill)
                    ? 'bg-[#2E86AB] text-white border-[#2E86AB]'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-[#2E86AB]'
                }`}
                disabled={formData.skills.includes(skill)}
              >
                {skill} {formData.skills.includes(skill) ? '✓' : '+'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileStep;