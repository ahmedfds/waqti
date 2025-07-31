import React from 'react';
import { motion } from 'framer-motion';
import { User, Building } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AccountDataStepProps {
  formData: {
    username: string;
    accountType: 'freelancer' | 'client';
    termsAccepted: boolean;
    privacyAccepted: boolean;
  };
  onUpdate: (data: any) => void;
  setActivePage: (page: string) => void;
}

const AccountDataStep: React.FC<AccountDataStepProps> = ({ formData, onUpdate, setActivePage }) => {
  const { user } = useAuth();

  const handleInputChange = (field: string, value: any) => {
    onUpdate({ ...formData, [field]: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-[#2E86AB] rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl text-white font-bold">
            {user?.name?.charAt(0).toUpperCase() || 'A'}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{user?.name || 'Ahmed Alhabash'}</h2>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <span className="text-red-500">*</span> اسم المستخدم
        </label>
        <div className="flex">
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
            https://waqti.com/u/
          </span>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-[#2E86AB] focus:border-[#2E86AB]"
            placeholder="Ahmad_1_1"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          يجب أن يكون فريداً ويحتوي على أحرف وأرقام وشرطات سفلية (_) فقط. لا يمكن تغييره لاحقاً
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          <span className="text-red-500">*</span> نوع الحساب
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className={`relative flex flex-col items-center p-6 border-2 rounded-lg cursor-pointer transition-all ${
            formData.accountType === 'freelancer' 
              ? 'border-[#2E86AB] bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}>
            <input
              type="radio"
              name="accountType"
              value="freelancer"
              checked={formData.accountType === 'freelancer'}
              onChange={(e) => handleInputChange('accountType', e.target.value)}
              className="sr-only"
            />
            <div className="w-16 h-16 bg-[#2E86AB] rounded-full flex items-center justify-center mb-4">
              <User className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Independent</h3>
            <p className="text-sm text-gray-600 text-center">I am looking for projects to implement</p>
          </label>

          <label className={`relative flex flex-col items-center p-6 border-2 rounded-lg cursor-pointer transition-all ${
            formData.accountType === 'client' 
              ? 'border-[#2E86AB] bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}>
            <input
              type="radio"
              name="accountType"
              value="client"
              checked={formData.accountType === 'client'}
              onChange={(e) => handleInputChange('accountType', e.target.value)}
              className="sr-only"
            />
            <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mb-4">
              <Building className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Entrepreneur</h3>
            <p className="text-sm text-gray-600 text-center">I am looking for freelancers to implement my projects</p>
          </label>
        </div>
      </div>

      <div className="space-y-3">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={formData.termsAccepted}
            onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
            className="mt-1 rounded border-gray-300 text-[#2E86AB] focus:ring-[#2E86AB]"
          />
          <span className="text-sm text-gray-700">
            <span className="text-red-500">*</span> I have read and agree to{' '}
            <button
              type="button"
              onClick={() => setActivePage('terms')}
              className="text-[#2E86AB] hover:underline"
            >
              the Terms of Use
            </button>
            {' '}and{' '}
            <button
              type="button"
              onClick={() => setActivePage('privacy')}
              className="text-[#2E86AB] hover:underline"
            >
              Privacy Statement
            </button>
          </span>
        </label>
      </div>
    </motion.div>
  );
};

export default AccountDataStep;