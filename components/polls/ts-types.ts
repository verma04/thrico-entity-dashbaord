// Enum for result visibility
export enum ResultVisibility {
  ALWAYS = "ALWAYS",
  AFTER_VOTE = "AFTER_VOTE",
  AFTER_END = "AFTER_END",
  ADMIN = "ADMIN",
}

export enum Status {
  APPROVED = "APPROVED",
  DISABLED = "DISABLED",
}

// Define the Option interface (customize as needed)
export interface Option {
  id: string;
  text: string;
  votes: number;
  order: number; // Optional example field
}

// Main Poll interface
export interface poll {
  id: string;
  title: string;
  question: string;
  resultVisibility: ResultVisibility;
  options?: Option[];
  updatedAt?: Date;
  createdAt?: Date;
  endDate?: Date;
  status: Status;
  totalVotes: number;
  isVoted: boolean;
  votedOptionId: string;
  addedBy?: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}
export interface userVoted {
  firstName: string;
  avatar: string;
  lastName: string;
  id: string;
}
export interface individualVotes {
  pollOptions: Option;
  votedBy: "ENTITY" | "USER";
  createdAt: string;
  user: userVoted;
}
export interface result {
  options: Option[];
  individualVotes: individualVotes[];
}

export enum By {
  ENTITY = "ENTITY",
  ALL = "ALL",
  USER = "USER",
}

export interface PollProps {
  by: By;
}
