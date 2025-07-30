import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Clock, Users, Star, MessageSquare } from 'lucide-react';
import Button from '../components/Button';

interface WelcomeWalkthroughPageProps {
  setActivePage: (page: string) => void;
  onComplete: () => void;
}

const WelcomeWalkthroughPage: React.FC<WelcomeWalkthroughPageProps> = ({ setActivePage, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to Waqti',
      titleAr: 'مرحباً بك في وقتي',
      description: 'Exchange services using time as currency',
      descriptionAr: 'تبادل الخدمات باستخدام الوقت كعملة',
      icon: Clock,
      color: 'bg-blue-500'
    },
    {
      title: 'Connect with Professionals',
      titleAr: 'تواصل مع المحترفين',
      description: 'Find skilled freelancers and offer your own services',
      descriptionAr: 'اعثر على مستقلين مهرة وقدم خدماتك الخاصة',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'Build Your Reputation',
      titleAr: 'ابن سمعتك',
      description: 'Earn ratings and reviews from satisfied clients',
      descriptionAr: 'احصل على تقييمات ومراجعات من العملاء الراضين',
      icon: Star,
      color: 'bg-yellow-500'
    },
    {
      title: 'Communicate Seamlessly',
      titleAr: 'تواصل بسلاسة',
      description: 'Chat with clients and freelancers in real-time',
      descriptionAr: 'تحدث مع العملاء والمستقلين في الوقت الفعلي',
      icon: MessageSquare,
      color: 'bg-purple-500'
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipWalkthrough = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl max-w-md w-full p-8 relative"
      >
        <button
          onClick={skipWalkthrough}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center"
          >
            <div className={`w-20 h-20 ${steps[currentStep].color} rounded-full flex items-center justify-center mx-auto mb-6`}>
              {React.createElement(steps[currentStep].icon, { className: 'h-10 w-10 text-white' })}
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {steps[currentStep].title}
            </h2>
            <h3 className="text-lg text-gray-700 mb-4">
              {steps[currentStep].titleAr}
            </h3>
            <p className="text-gray-600 mb-2">
              {steps[currentStep].description}
            </p>
            <p className="text-gray-600 mb-8">
              {steps[currentStep].descriptionAr}
            </p>

            {/* Progress Dots */}
            <div className="flex justify-center space-x-2 mb-8">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index === currentStep ? 'bg-[#2E86AB]' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentStep === 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </button>

              <span className="text-sm text-gray-500">
                {currentStep + 1} of {steps.length}
              </span>

              <Button
                onClick={nextStep}
                variant="primary"
                rightIcon={currentStep === steps.length - 1 ? undefined : <ArrowRight className="h-4 w-4" />}
              >
                {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 text-center">
          <button
            onClick={skipWalkthrough}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Skip walkthrough
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default WelcomeWalkthroughPage;