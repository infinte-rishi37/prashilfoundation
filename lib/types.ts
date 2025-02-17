export type Course = {
  id: string;
  name: string;
  fees: number;
  type: 'Domestic' | 'Abroad';
  mode: 'Online' | 'Offline';
  start_date: string;
  created_at: string;
  updated_at: string;
};

export type EduGuideService = {
  id: string;
  name: string;
  description: string;
  category: 'career_counselling' | 'college_admission';
  location?: string;
  fee: number;
  min_students?: number;
  created_at: string;
  updated_at: string;
};

export type FinanceCategory = {
  id: string;
  name: string;
  type: 'loan' | 'document';
  description: string;
  created_at: string;
};

export type FinanceService = {
  type: any;
  id: string;
  category_id: string;
  name: string;
  description: string;
  min_amount?: number;
  max_amount?: number;
  interest_rate?: number;
  processing_fee?: number;
  duration?: string;
  requirements: string[];
  documents_required: string[];
  created_at: string;
  updated_at: string;
};

export type UserProfile = {
  id: string;
  full_name: string;
  address: string;
  employment_type: 'salaried' | 'business' | 'self_employed';
  created_at: string;
  updated_at: string;
};

export type ServiceType = 'educare' | 'eduguide' | 'finance';

export type Application = {
  id: string;
  user_id: string;
  service_type: ServiceType;
  service_id: string;
  status: "pending" | "approved" | "rejected";
  admin_response: string | null;
  created_at: string;
  responded_at: string | null;
  user: {
    email: string;
    username: string;
  };
  service: Course | EduGuideService | FinanceService;
};