// Types for the comprehensive verification system

export interface VerificationStep {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  isCompleted: boolean;
  isRequired: boolean;
  order: number;
}

export interface FreelancerVerification {
  id: string;
  userId: string;
  status: 'pending' | 'in_progress' | 'under_review' | 'approved' | 'rejected';
  currentStep: number;
  steps: {
    accountData: AccountDataStep;
    profile: ProfileStep;
    businessGallery: BusinessGalleryStep;
    admissionTest: AdmissionTestStep;
  };
  submittedAt?: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AccountDataStep {
  isCompleted: boolean;
  data: {
    fullName: string;
    username: string;
    accountType: 'freelancer' | 'client';
    termsAccepted: boolean;
    privacyAccepted: boolean;
  };
}

export interface ProfileStep {
  isCompleted: boolean;
  data: {
    jobTitle: string;
    specialization: string;
    introduction: string;
    skills: string[];
    hourlyRate?: number;
    availability: 'full_time' | 'part_time' | 'weekends';
    languages: {
      language: string;
      proficiency: 'basic' | 'intermediate' | 'advanced' | 'native';
    }[];
  };
}

export interface BusinessGalleryStep {
  isCompleted: boolean;
  data: {
    portfolioItems: PortfolioItem[];
    certificates: CertificateFile[];
    testimonials: Testimonial[];
  };
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  images: string[];
  projectUrl?: string;
  skills: string[];
  completedAt: Date;
}

export interface CertificateFile {
  id: string;
  name: string;
  url: string;
  type: 'certificate' | 'diploma' | 'license';
  issuedBy: string;
  issuedAt: Date;
  expiresAt?: Date;
}

export interface Testimonial {
  id: string;
  clientName: string;
  clientCompany?: string;
  rating: number;
  comment: string;
  projectTitle: string;
  date: Date;
}

export interface AdmissionTestStep {
  isCompleted: boolean;
  data: {
    testType: string;
    score?: number;
    maxScore: number;
    passedAt?: Date;
    attempts: TestAttempt[];
  };
}

export interface TestAttempt {
  id: string;
  startedAt: Date;
  completedAt?: Date;
  score?: number;
  answers: TestAnswer[];
}

export interface TestAnswer {
  questionId: string;
  answer: string | string[];
  isCorrect?: boolean;
}

export interface VerificationNotification {
  id: string;
  userId: string;
  type: 'step_completed' | 'verification_approved' | 'verification_rejected' | 'reminder';
  title: string;
  message: string;
  stepId?: string;
  isRead: boolean;
  createdAt: Date;
}

export interface AdminVerificationReview {
  id: string;
  verificationId: string;
  reviewerId: string;
  status: 'approved' | 'rejected' | 'needs_revision';
  comments: string;
  checklist: {
    profileComplete: boolean;
    portfolioQuality: boolean;
    skillsVerified: boolean;
    documentsValid: boolean;
  };
  createdAt: Date;
}