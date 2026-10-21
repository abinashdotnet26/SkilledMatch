export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  companyStage: 'Seed' | 'Series A' | 'Series B' | 'Series C+' | 'Public' | 'Bootstrapped';
  location: string;
  region?: 'US' | 'India' | 'Europe' | 'Global';
  workMode: 'Remote' | 'Hybrid' | 'Onsite';
  salaryRange: string;
  minSalaryUsd: number;
  salaryCurrency?: 'USD' | 'INR';
  employmentType?: 'Full-Time' | 'Contract' | 'Part-Time' | 'Internship';
  category:
    | 'Frontend'
    | 'Backend'
    | 'Fullstack'
    | 'Java / Spring Boot'
    | '.NET / C#'
    | 'QA & Automation'
    | 'AI / Machine Learning'
    | 'DevOps / Cloud'
    | 'Product Management'
    | 'Data'
    | 'Mobile (iOS & Android)'
    | 'UI/UX & Product Design'
    | 'Cybersecurity'
    | 'Sales & Growth';
  atsSource: 'Ashby' | 'Greenhouse' | 'Lever' | 'Workday' | 'BambooHR';
  atsJobUrl: string;
  postedAt: string; // e.g. "45m ago", "2h ago"
  postedTimestamp: number;
  applicantCount: number; // Low competition metric! e.g. 4, 7, 12
  isLowCompetition: boolean;
  matchScore: number; // Candidate's CV match percentage e.g. 92
  experienceLevel: 'Junior' | 'Mid' | 'Senior' | 'Lead' | 'Staff';
  tags: string[];
  description: string;
  requirements: string[];
  benefits: string[];
  recruiter: {
    name: string;
    role: string;
    avatar: string;
    linkedinUrl: string;
    email: string;
    isVerified: boolean;
  };
}

export interface CandidateProfile {
  name: string;
  email: string;
  phone: string;
  title: string;
  experienceYears: number;
  location: string;
  workAuthorization: 'US Citizen / Green Card' | 'Visa Required' | 'EU Citizen' | 'Global Remote Contractor';
  currentCompany: string;
  noticePeriod: 'Immediate' | '2 Weeks' | '1 Month' | '3 Months';
  expectedSalary: string;
  linkedin: string;
  github: string;
  portfolio: string;
  bio: string;
  skills: string[];
  resumeText: string;
}

export type ApplicationStage = 'saved' | 'queued' | 'applied' | 'screening' | 'technical' | 'offer' | 'archived';

export interface ApplicationTrackerItem {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  salaryRange: string;
  location: string;
  atsSource: string;
  stage: ApplicationStage;
  appliedDate: string;
  appliedVia: 'Apply Concierge' | '1-Click Autofill' | 'Manual ATS' | 'Recruiter Cold Ping';
  matchScore: number;
  notes?: string;
  interviewDate?: string;
}

export interface ConciergeConfig {
  isActive: boolean;
  dailyApplicationLimit: number;
  applicationsUsedToday: number;
  minSalaryUsd: number;
  preferredWorkModes: ('Remote' | 'Hybrid' | 'Onsite')[];
  preferredCategories: string[];
  autoTailorResume: boolean;
  sendRecruiterPing: boolean;
  targetLocations: string[];
}

export interface ConciergeLog {
  id: string;
  timestamp: string;
  jobTitle: string;
  company: string;
  action: 'QUEUED' | 'TAILORED_RESUME' | 'AUTOFILL_COMPLETED' | 'SUBMITTED' | 'RECRUITER_CONTACTED';
  status: 'success' | 'in_progress' | 'pending';
  details: string;
}

export type UserPlanTier = 'free' | 'pro' | 'autopilot';

export interface UserSubscription {
  plan: UserPlanTier;
  currency: 'USD' | 'INR';
  credits: number;
  applicationsUsedThisMonth: number;
  monthlyLimit: number;
  dailyLimit: number;
  renewsAt: string;
  isAdmin?: boolean;
}
