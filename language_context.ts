// context/LanguageContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LanguageContextType {
  language: 'en' | 'ar';
  setLanguage: (lang: 'en' | 'ar') => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionaries
const translations = {
  en: {
    'welcome': 'Welcome',
    'login': 'Login',
    'register': 'Register',
    'email': 'Email',
    'password': 'Password',
    'dashboard': 'Dashboard',
    'services': 'Services',
    'projects': 'Projects',
    'messages': 'Messages',
    'profile': 'Profile',
    'settings': 'Settings',
    'logout': 'Logout',
    'freelancer': 'Freelancer',
    'client': 'Client',
    'admin': 'Admin',
    'verification': 'Verification',
    'pending': 'Pending',
    'approved': 'Approved',
    'rejected': 'Rejected',
    'save': 'Save',
    'cancel': 'Cancel',
    'submit': 'Submit',
    'continue': 'Continue',
    'back': 'Back',
    'next': 'Next',
    'previous': 'Previous',
    'loading': 'Loading...',
    'error': 'Error',
    'success': 'Success',
    'warning': 'Warning',
    'info': 'Information'
  },
  ar: {
    'welcome': 'مرحباً',
    'login': 'تسجيل الدخول',
    'register': 'إنشاء حساب',
    'email': 'البريد الإلكتروني',
    'password': 'كلمة المرور',
    'dashboard': 'لوحة التحكم',
    'services': 'الخدمات',
    'projects': 'المشاريع',
    'messages': 'الرسائل',
    'profile': 'الملف الشخصي',
    'settings': 'الإعدادات',
    'logout': 'تسجيل الخروج',
    'freelancer': 'مستقل',
    'client': 'عميل',
    'admin': 'مدير',
    'verification': 'التحقق',
    'pending': 'قيد الانتظار',
    'approved': 'مقبول',
    'rejected': 'مرفوض',
    'save': 'حفظ',
    'cancel': 'إلغاء',
    'submit': 'إرسال',
    'continue': 'متابعة',
    'back': 'رجوع',
    'next': 'التالي',
    'previous': 'السابق',
    'loading': 'جارٍ التحميل...',
    'error': 'خطأ',
    'success': 'نجح',
    'warning': 'تحذير',
    'info': 'معلومات'
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('waqti_language') as 'en' | 'ar';
    if (savedLanguage && ['en', 'ar'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    } else {
      // Auto-detect browser language
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('ar')) {
        setLanguage('ar');
      }
    }
  }, []);

  useEffect(() => {
    // Save language to localStorage
    localStorage.setItem('waqti_language', language);
    
    // Update document direction and language
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    dir
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};