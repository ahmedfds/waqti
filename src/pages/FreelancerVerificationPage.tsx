import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle, Upload, Camera, Phone, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

interface FreelancerVerificationPageProps {
  setActivePage: (page: string) => void;
}

const FreelancerVerificationPage: React.FC<FreelancerVerificationPageProps> = ({ setActivePage }) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [verificationData, setVerificationData] = useState({
    identityDocument: null as File | null,
    selfieWithId: null as File | null,
    phoneNumber: '',
    phoneVerified: false,
    paymentMethod: '',
    bankAccount: ''
  });

  const steps = [
    {
      id: 1,
      title: 'Identity Verification',
      titleAr: 'التحقق من الهوية',
      icon: Upload,
      description: 'Upload your government ID'
    },
    {
      id: 2,
      title: 'Photo Verification',
      titleAr: 'التحقق من الصورة',
      icon: Camera,
      description: 'Take a selfie with your ID'
    },
    {
      id: 3,
      title: 'Phone Verification',
      titleAr: 'التحقق من الهاتف',
      icon: Phone,
      description: 'Verify your phone number'
    },
    {
      id: 4,
      title: 'Payment Setup',
      titleAr: 'إعداد الدفع',
      icon: CreditCard,
      description: 'Connect your payment method'
    }
  ];

  const handleFileUpload = (field: string, file: File) => {
    setVerificationData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const handlePhoneVerification = async () => {
    // Simulate phone verification
    await new Promise(resolve => setTimeout(resolve, 2000));
    setVerificationData(prev => ({
      ...prev,
      phoneVerified: true
    }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeVerification = async () => {
    try {
      // Submit verification data to Supabase
      console.log('Submitting verification:', verificationData);
      
      // Simulate submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to dashboard
      setActivePage('dashboard');
    } catch (error) {
      console.error('Verification failed:', error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Upload className="w-16 h-16 text-[#2E86AB] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Government ID</h3>
              <p className="text-gray-600">Please upload a clear photo of your government-issued ID</p>
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files && handleFileUpload('identityDocument', e.target.files[0])}
                className="hidden"
                id="id-upload"
              />
              <label htmlFor="id-upload" className="cursor-pointer">
                {verificationData.identityDocument ? (
                  <div className="space-y-2">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                    <p className="text-green-600">ID uploaded successfully</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                    <p className="text-gray-600">Click to upload your ID</p>
                  </div>
                )}
              </label>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Camera className="w-16 h-16 text-[#2E86AB] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Take a Selfie with ID</h3>
              <p className="text-gray-600">Hold your ID next to your face and take a clear photo</p>
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept="image/*"
                capture="user"
                onChange={(e) => e.target.files && handleFileUpload('selfieWithId', e.target.files[0])}
                className="hidden"
                id="selfie-upload"
              />
              <label htmlFor="selfie-upload" className="cursor-pointer">
                {verificationData.selfieWithId ? (
                  <div className="space-y-2">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                    <p className="text-green-600">Selfie uploaded successfully</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto" />
                    <p className="text-gray-600">Click to take a selfie</p>
                  </div>
                )}
              </label>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Phone className="w-16 h-16 text-[#2E86AB] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Verify Phone Number</h3>
              <p className="text-gray-600">We'll send you an SMS to verify your phone number</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={verificationData.phoneNumber}
                  onChange={(e) => setVerificationData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
                  placeholder="+971 50 123 4567"
                />
              </div>
              
              {!verificationData.phoneVerified ? (
                <Button
                  onClick={handlePhoneVerification}
                  variant="primary"
                  className="w-full"
                  disabled={!verificationData.phoneNumber}
                >
                  Send Verification SMS
                </Button>
              ) : (
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span>Phone number verified</span>
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CreditCard className="w-16 h-16 text-[#2E86AB] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Method</h3>
              <p className="text-gray-600">Connect your bank account or payment method</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <select
                  value={verificationData.paymentMethod}
                  onChange={(e) => setVerificationData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
                >
                  <option value="">Select payment method</option>
                  <option value="bank_account">Bank Account</option>
                  <option value="paypal">PayPal</option>
                  <option value="stripe">Stripe</option>
                </select>
              </div>
              
              {verificationData.paymentMethod === 'bank_account' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bank Account Number</label>
                  <input
                    type="text"
                    value={verificationData.bankAccount}
                    onChange={(e) => setVerificationData(prev => ({ ...prev, bankAccount: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
                    placeholder="Enter your bank account number"
                  />
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return verificationData.identityDocument !== null;
      case 2:
        return verificationData.selfieWithId !== null;
      case 3:
        return verificationData.phoneVerified;
      case 4:
        return verificationData.paymentMethod !== '';
      default:
        return false;
    }
  };

  if (!user) {
    setActivePage('login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => setActivePage('role-selection')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="bg-white rounded-xl shadow-md p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                      currentStep > step.id ? 'bg-green-500 text-white' :
                      currentStep === step.id ? 'bg-[#2E86AB] text-white' :
                      'bg-gray-300 text-gray-600'
                    }`}>
                      {currentStep > step.id ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        React.createElement(step.icon, { className: 'h-6 w-6' })
                      )}
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">{step.title}</p>
                      <p className="text-xs text-gray-600">{step.titleAr}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 ${
                      currentStep > step.id ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-[#2E86AB] h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Current Step Content */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {renderStep()}
          </motion.div>

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
                disabled={!canProceed()}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={completeVerification}
                variant="primary"
                disabled={!canProceed()}
                rightIcon={<CheckCircle className="h-4 w-4" />}
              >
                Complete Verification
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerVerificationPage;