import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import ProgressBar from '../components/verification/ProgressBar';
import AccountDataStep from '../components/verification/AccountDataStep';
import ProfileStep from '../components/verification/ProfileStep';
import BusinessGalleryStep from '../components/verification/BusinessGalleryStep';
import AdmissionTestStep from '../components/verification/AdmissionTestStep';

interface ProviderRegistrationPageProps {
  setActivePage: (page: string) => void;
}

const ProviderRegistrationPage: React.FC<ProviderRegistrationPageProps> = ({ setActivePage }) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    accountData: {
      fullName: user?.name || '',
      username: '',
      accountType: 'freelancer' as 'freelancer' | 'client',
      termsAccepted: false,
      privacyAccepted: false
    },
    profile: {
      jobTitle: '',
      specialization: '',
      introduction: '',
      skills: [] as string[],
      hourlyRate: 0,
      availability: 'full_time' as 'full_time' | 'part_time' | 'weekends',
      languages: [] as Array<{
        language: string;
        proficiency: 'basic' | 'intermediate' | 'advanced' | 'native';
      }>
    },
    businessGallery: {
      portfolioItems: [
        { id: '1', title: '', description: '', thumbnail: null, images: [], skills: [] },
        { id: '2', title: '', description: '', thumbnail: null, images: [], skills: [] },
        { id: '3', title: '', description: '', thumbnail: null, images: [], skills: [] }
      ],
      certificates: [] as File[],
      testimonials: [] as Array<{
        clientName: string;
        clientCompany?: string;
        rating: number;
        comment: string;
        projectTitle: string;
      }>
    },
    admissionTest: {
      completed: false,
      score: 0,
      answers: {}
    }
  });

  const steps = [
    { number: 1, title: 'Account data', titleAr: 'بيانات الحساب' },
    { number: 2, title: 'Profile', titleAr: 'الملف الشخصي' },
    { number: 3, title: 'Business Gallery', titleAr: 'معرض الأعمال' },
    { number: 4, title: 'Admission test', titleAr: 'اختبار القبول' }
  ];

  const updateStepData = (step: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      [step]: data
    }));
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return formData.accountData.username && 
               formData.accountData.accountType && 
               formData.accountData.termsAccepted;
      case 2:
        return formData.profile.jobTitle && 
               formData.profile.specialization && 
               formData.profile.introduction && 
               formData.profile.skills.length > 0;
      case 3:
        return formData.businessGallery.portfolioItems.some(item => 
          item.title && item.description && item.thumbnail
        );
      case 4:
        return formData.admissionTest.completed;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateCurrentStep() && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // Here you would submit to Supabase
      console.log('Submitting verification data:', formData);
      
      // Simulate submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to dashboard
      setActivePage('dashboard');
    } catch (error) {
      console.error('Submission failed:', error);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <AccountDataStep
            formData={formData.accountData}
            onUpdate={(data) => updateStepData('accountData', data)}
            setActivePage={setActivePage}
          />
        );
      case 2:
        return (
          <ProfileStep
            formData={formData.profile}
            onUpdate={(data) => updateStepData('profile', data)}
          />
        );
      case 3:
        return (
          <BusinessGalleryStep
            formData={formData.businessGallery}
            onUpdate={(data) => updateStepData('businessGallery', data)}
          />
        );
      case 4:
        return (
          <AdmissionTestStep
            formData={formData.admissionTest}
            onUpdate={(data) => updateStepData('admissionTest', data)}
          />
        );
      default:
        return null;
    }
  };

  if (!user) {
    setActivePage('login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => setActivePage('role-selection')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="bg-white rounded-xl shadow-md p-8">
          <ProgressBar
            currentStep={currentStep}
            totalSteps={4}
            steps={steps}
          />

          <div className="mt-8">
            {renderCurrentStep()}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <Button
              onClick={prevStep}
              variant="secondary"
              disabled={currentStep === 1}
              leftIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Previous
            </Button>

            <div className="text-sm text-gray-500">
              Step {currentStep} of 4
            </div>

            {currentStep < 4 ? (
              <Button
                onClick={nextStep}
                variant="primary"
                disabled={!validateCurrentStep()}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                variant="primary"
                disabled={!validateCurrentStep()}
                rightIcon={<CheckCircle className="h-4 w-4" />}
              >
                Submit Application
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderRegistrationPage;