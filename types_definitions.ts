// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'freelancer' | 'client' | 'admin';
  verified: boolean;
  avatar?: string;
  createdAt: Date;
  updatedAt?: Date;
}

// Escrow Types
export interface EscrowTransaction {
  id: string;
  type: 'deposit' | 'release' | 'refund' | 'dispute_hold';
  amount: number;
  currency: string;
  description: string;
  milestoneId?: string;
  createdAt: Date;
}

export interface EscrowAccount {
  id: string;
  contractId: string;
  totalAmount: number;
  currency: string;
  heldAmount: number;
  releasedAmount: number;
  status: 'active' | 'completed' | 'disputed' | 'cancelled';
  transactions: EscrowTransaction[];
  createdAt: Date;
  updatedAt: Date;
}

// Contract Types
export interface Contract {
  id: string;
  clientId: string;
  freelancerId: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled' | 'disputed';
  totalAmount: number;
  currency: string;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Search Types
export interface SearchQuery {
  text: string;
  filters: Record<string, any>;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface SavedSearch {
  id: string;
  userId: string;
  name: string;
  description?: string;
  query: SearchQuery;
  category: 'services' | 'projects' | 'freelancers' | 'messages';
  isPublic: boolean;
  notifications: boolean;
  lastRun?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Service Types
export interface Service {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  price: number;
  currency: string;
  deliveryTime: number;
  isActive: boolean;
  tags: string[];
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Project Types
export interface Project {
  id: string;
  clientId: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  currency: string;
  deadline: Date;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  proposals: ProjectProposal[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectProposal {
  id: string;
  projectId: string;
  freelancerId: string;
  message: string;
  proposedPrice: number;
  deliveryTime: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

// Message Types
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  messageType: 'text' | 'image' | 'file' | 'system';
  isRead: boolean;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  actionUrl?: string;
  createdAt: Date;
}

// Verification Types
export interface VerificationStep {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  data?: any;
  submittedAt?: Date;
  reviewedAt?: Date;
}

export interface FreelancerVerification {
  userId: string;
  steps: VerificationStep[];
  overallStatus: 'pending' | 'in_progress' | 'approved' | 'rejected';
  reviewNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Portfolio Types
export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  thumbnail: File | null;
  images: File[];
  skills: string[];
  projectUrl?: string;
  completedAt?: Date;
}

// Review Types
export interface Review {
  id: string;
  reviewerId: string;
  revieweeId: string;
  contractId: string;
  rating: number;
  comment: string;
  isPublic: boolean;
  createdAt: Date;
}

// Skills and Categories
export interface Skill {
  id: string;
  name: string;
  category: string;
  isVerified: boolean;
}

export interface Category {
  id: string;
  name: string;
  nameAr: string;
  description?: string;
  parentId?: string;
  isActive: boolean;
}

// Language Types
export interface Language {
  language: string;
  proficiency: 'basic' | 'intermediate' | 'advanced' | 'native';
}

// Form Data Types
export interface AccountData {
  fullName: string;
  username: string;
  accountType: 'freelancer' | 'client';
  termsAccepted: boolean;
  privacyAccepted: boolean;
}

export interface ProfileData {
  jobTitle: string;
  specialization: string;
  introduction: string;
  skills: string[];
  hourlyRate: number;
  availability: 'full_time' | 'part_time' | 'weekends';
  languages: Language[];
}

export interface BusinessGalleryData {
  portfolioItems: PortfolioItem[];
  certificates: File[];
  testimonials: Testimonial[];
}

export interface AdmissionTestData {
  completed: boolean;
  score: number;
  answers: Record<number, number>;
}

export interface Testimonial {
  clientName: string;
  clientCompany?: string;
  rating: number;
  comment: string;
  projectTitle: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Filter Types
export interface ServiceFilters {
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  deliveryTime?: number;
  rating?: number;
  isOnline?: boolean;
}

export interface ProjectFilters {
  category?: string;
  minBudget?: number;
  maxBudget?: number;
  deadline?: string;
  status?: string;
}

export interface FreelancerFilters {
  skills?: string[];
  category?: string;
  minRating?: number;
  availability?: string;
  hourlyRate?: { min: number; max: number };
}

// Dashboard Stats
export interface DashboardStats {
  totalProjects?: number;
  activeContracts?: number;
  totalEarnings?: number;
  completedProjects?: number;
  averageRating?: number;
  totalReviews?: number;
}

// Admin Types
export interface AdminStats {
  totalUsers: number;
  totalFreelancers: number;
  totalClients: number;
  pendingVerifications: number;
  activeContracts: number;
  totalRevenue: number;
  monthlyGrowth: number;
}

export interface AdminUser extends User {
  lastLogin?: Date;
  isBlocked: boolean;
  verificationStatus?: 'pending' | 'approved' | 'rejected';
  totalEarnings?: number;
  completedProjects?: number;
}

// Booking and Time Management
export interface TimeSlot {
  id: string;
  startTime: Date;
  endTime: Date;
  isAvailable: boolean;
  isBooked: boolean;
}

export interface Booking {
  id: string;
  serviceId: string;
  clientId: string;
  freelancerId: string;
  startTime: Date;
  endTime: Date;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

// Context Types
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, role: 'freelancer' | 'client') => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

export interface LanguageContextType {
  language: 'en' | 'ar';
  setLanguage: (lang: 'en' | 'ar') => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}
  