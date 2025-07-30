import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Import pages (you'll need to create these)
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import EmailVerificationPage from './pages/EmailVerificationPage';
import WelcomeWalkthroughPage from './pages/WelcomeWalkthroughPage';
import EscrowManagementPage from './pages/EscrowManagementPage';
import SavedSearchesPage from './pages/SavedSearchesPage';
import ProviderRegistrationPage from './pages/ProviderRegistrationPage';
import { RoleSelectionPage } from './pages/RoleSelectionPage';
import FreelancerVerificationPage from './pages/FreelancerVerificationPage';
import AboutPage from './pages/AboutPage';
import SupportPage from './pages/SupportPage';
import FAQPage from './pages/FAQPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import CreateServicePage from './pages/CreateServicePage';
import MessagesPage from './pages/MessagesPage';
import NotificationsPage from './pages/NotificationsPage';
import UserProfilePage from './pages/UserProfilePage';
import BookingManagementPage from './pages/BookingManagementPage';

// AppContent component to use auth context
const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [activePage, setActivePage] = useState('landing');
  const [showWalkthrough, setShowWalkthrough] = useState(false);

  useEffect(() => {
    // Check if user needs to see walkthrough
    const hasSeenWalkthrough = localStorage.getItem('waqti_walkthrough_seen');
    if (user && !hasSeenWalkthrough) {
      setShowWalkthrough(true);
    }
  }, [user]);

  const handleWalkthroughComplete = () => {
    localStorage.setItem('waqti_walkthrough_seen', 'true');
    setShowWalkthrough(false);
    setActivePage('dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#2E86AB]"></div>
      </div>
    );
  }

  const renderPage = () => {
    switch (activePage) {
      case 'landing':
        return <LandingPage setActivePage={setActivePage} />;
      case 'login':
        return <LoginPage setActivePage={setActivePage} />;
      case 'register':
        return <RegisterPage setActivePage={setActivePage} />;
      case 'email-verification':
        return <EmailVerificationPage setActivePage={setActivePage} />;
      case 'role-selection':
        return <RoleSelectionPage setActivePage={setActivePage} />;
      case 'provider-registration':
        return <ProviderRegistrationPage setActivePage={setActivePage} />;
      case 'freelancer-verification':
        return <FreelancerVerificationPage setActivePage={setActivePage} />;
      case 'about':
        return <AboutPage setActivePage={setActivePage} />;
      case 'support':
        return <SupportPage setActivePage={setActivePage} />;
      case 'faq':
        return <FAQPage setActivePage={setActivePage} />;
      case 'terms':
        return <TermsPage setActivePage={setActivePage} />;
      case 'privacy':
        return <PrivacyPage setActivePage={setActivePage} />;
      case 'dashboard':
        return <DashboardPage setActivePage={setActivePage} />;
      case 'admin-dashboard':
        return <AdminDashboardPage setActivePage={setActivePage} />;
      case 'service-detail':
        return <ServiceDetailPage setActivePage={setActivePage} />;
      case 'create-service':
        return <CreateServicePage setActivePage={setActivePage} />;
      case 'messages':
        return <MessagesPage setActivePage={setActivePage