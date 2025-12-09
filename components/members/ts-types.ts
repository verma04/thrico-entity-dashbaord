// Root Object
export interface userStatus {
  id: string;
  userId: string;
  entityId: string;
  isApproved: boolean;
  isRequested: boolean;
  createdAt: string;
  updatedAt: string;
  tag: string | null;
  status: Status;
  interests: any | null;
  categories: any | null;
  lastActive: string | null;
  isOnline: boolean;
  user: User;
  userKyc: UserKyc;
  verification: verification;
}

// User Object
export interface verification {
  id: string;
  isVerifiedAt: Date;
  isVerified: boolean;
  verificationReason: string;
}
interface User {
  id: string;
  firstName: string;
  cover: string;
  avatar: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  entityId: string;
  location: Location;
  isBlocked: boolean;
  isActive: boolean;
  profile: Profile;
  about: About;
}

// Location
interface Location {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

// Profile
interface Profile {
  id: string;
  country: string;
  language: string;

  userId: string;
  experience: Experience[];
  education: Education[];
  phone: Phone;
  gender: string;

  categories: any[];
  skills: any[];
}

// Experience
interface Experience {
  id: string;
  company: Company;
  duration: string[];
  employmentType: string;
  locationType: string;
  title: string;
  startDate: string;
  currentlyWorking: boolean;
  location: Location;
}

// Education
interface Education {
  id: string;
  school: Company;
  degree: string;
  grade: string;
  activities: string;
  description: string;
  duration: string[];
}

// Company (used in experience and education)
interface Company {
  id: string;
  name: string;
  logo: string;
}

// Phone
interface Phone {
  areaCode: string;
  countryCode: number;
  isoCode: string;
  phoneNumber: string;
}

// About
interface About {
  id: string;
  currentPosition: string;
  userId: string;
  pronouns: string;
  social: Social[];
  headline: string;
  about: string;
}

// Social
interface Social {
  url: string;
  platform: string;
}

// UserKYC
interface UserKyc {
  id: string;
  affliction: string[];
  referralSource: string[];
  comment: string;
  agreement: boolean;
  entityId: string;
  userId: string;
}

export enum Status {
  APPROVED = "APPROVED",
  BLOCKED = "BLOCKED",
  PENDING = "PENDING",
  REJECTED = "REJECTED",
  FLAGGED = "FLAGGED",
  DISABLED = "DISABLED",
  ENABLED = "ENABLED",
}

interface approvalSettings {
  autoApproveUser?: Boolean;
  allowNewUser?: Boolean;
}

export interface formType {
  data: approvalSettings;
  update: any;
  loading: boolean;
}
