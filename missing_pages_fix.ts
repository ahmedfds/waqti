// pages/RegisterPage.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

interface RegisterPageProps {
  setActivePage: (page: string) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ setActivePage }) => {
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      await signUp(formData.email, formData.password, formData.name, 'freelancer');
      setActivePage('email-verification');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-600">Join Waqti and start exchanging services</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => setActivePage('login')}
                className="text-[#2E86AB] hover:text-[#1e5f7a] font-medium"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// pages/RoleSelectionPage.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Users, Briefcase, ArrowRight } from 'lucide-react';
import Button from '../components/Button';

interface RoleSelectionPageProps {
  setActivePage: (page: string) => void;
}

const RoleSelectionPage: React.FC<RoleSelectionPageProps> = ({ setActivePage }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Path</h1>
          <p className="text-xl text-gray-600">How would you like to use Waqti?</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg p-8 cursor-pointer border-2 border-transparent hover:border-[#2E86AB] transition-all"
            onClick={() => setActivePage('provider-registration')}
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="h-10 w-10 text-[#2E86AB]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Freelancer</h3>
              <p className="text-gray-600 mb-6">
                Offer your skills and services to clients. Earn time credits by completing projects.
              </p>
              <ul className="text-left space-y-2 mb-8">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#2E86AB] rounded-full"></div>
                  <span className="text-gray-700">Create service listings</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#2E86AB] rounded-full"></div>
                  <span className="text-gray-700">Bid on projects</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#2E86AB] rounded-full"></div>
                  <span className="text-gray-700">Build your reputation</span>
                </li>
              </ul>
              <Button variant="primary" className="w-full" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Become a Freelancer
              </Button>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg p-8 cursor-pointer border-2 border-transparent hover:border-[#2E86AB] transition-all"
            onClick={() => setActivePage('dashboard')}
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Client</h3>
              <p className="text-gray-600 mb-6">
                Find talented freelancers for your projects. Use time credits to get work done.
              </p>
              <ul className="text-left space-y-2 mb-8">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-gray-700">Browse services</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-gray-700">Post projects</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-gray-700">Manage contracts</span>
                </li>
              </ul>
              <Button variant="primary" className="w-full" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Start as Client
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600">
            You can always switch roles later in your account settings
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export { RegisterPage, RoleSelectionPage };