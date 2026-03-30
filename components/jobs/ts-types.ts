export interface Company {
  id: string;
  industry: string;
  location: Record<string, unknown>;
  logo: string;
  name: string;
  pageType: string;
  size: string;
  tagline: string;
  type: string;
  website: string;
}

export interface Job {
  id: string;
  title: string;
  location: string;
  workplaceType: string;
  jobType: string;
  status: string;
  createdAt: string;
  numberOfApplicant: number;
  company: Company;
  verification?: {
    isVerified: boolean;
  };
}
