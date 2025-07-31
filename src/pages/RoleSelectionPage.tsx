import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Building, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

interface RoleSelectionPageProps {
  setActivePage: (page: string) => void;
}

const RoleSelectionPage: React.FC<RoleSelectionPageProps> = ({ setActivePage }) => {
  const { user } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'freelancer' | 'client' | null>(null);

  const handleContinue = () => {
    if (selectedRole === 'freelancer') {
      setActivePage('freelancer-verification');
    } else {
      setActivePage('dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#2E86AB] mb-2">Welcome to Waqti</h1>
            <p className="text-gray-600">Choose your account type to get started</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedRole('freelancer')}
              className={`relative cursor-pointer p-6 border-2 rounded-xl transition-all ${
                selectedRole === 'freelancer'
                  ? 'border-[#2E86AB] bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-[#2E86AB] rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Independent</h3>
                <p className="text-gray-600">I am looking for projects to implement</p>
              </div>
              {selectedRole === 'freelancer' && (
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 bg-[#2E86AB] rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedRole('client')}
              className={`relative cursor-pointer p-6 border-2 rounded-xl transition-all ${
                selectedRole === 'client'
                  ? 'border-[#2E86AB] bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Entrepreneur</h3>
                <p className="text-gray-600">I am looking for freelancers to implement my projects</p>
              </div>
              {selectedRole === 'client' && (
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 bg-[#2E86AB] rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          <div className="text-center">
            <Button
              variant="primary"
              onClick={handleContinue}
              disabled={!selectedRole}
              rightIcon={<ArrowRight className="h-4 w-4" />}
              className="px-8 py-3"
            >
              Continue
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RoleSelectionPage;