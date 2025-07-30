@@ .. @@
 import EmailVerificationPage from './pages/EmailVerificationPage';
 import WelcomeWalkthroughPage from './pages/WelcomeWalkthroughPage';
 import EscrowManagementPage from './pages/EscrowManagementPage';
 import SavedSearchesPage from './pages/SavedSearchesPage';
 import ProviderRegistrationPage from './pages/ProviderRegistrationPage';
 import RoleSelectionPage from './pages/RoleSelectionPage';
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
 import { LanguageProvider } from './context/LanguageContext';
 import { AuthProvider, useAuth } from './context/AuthContext';

@@ .. @@
       case 'register':
         return <RegisterPage setActivePage={setActivePage} />;
+      case 'email-verification':
+        return <EmailVerificationPage setActivePage={setActivePage} />;
       case 'role-selection':
         return <RoleSelectionPage setActivePage={setActivePage} />;
+      case 'provider-registration':
+        return <ProviderRegistrationPage setActivePage={setActivePage} />;
       case 'freelancer-verification':
         return <FreelancerVerificationPage setActivePage={setActivePage} />;
       case 'about':