// ---------- Member ----------
export interface Member {
  _id?: string;
  name: string;
  role: string;
  skills: string[];
  allocation: string;
  createdAt?: string;
  updatedAt?: string;
}

// ---------- Team ----------
export interface Team {
  _id?: string;
  teamName: string;
  headcount: number;
  teamAllocation: string;
  teamAvailability: "available" | "busy" | "partial";
  talentNeed: string;
  skillNeed: string[];
  members: Member[]; // Embedded Member objects
  createdAt?: string;
  updatedAt?: string;
}

// ---------- Objective ----------
export interface Objective {
  _id?: string;
  title: string;
  priorityLevel: "low" | "medium" | "high";
  department: string;
  isActive: boolean;
  completeness: number; // percentage
  talent: string;
  challengesAndRollbacks: string;
  risk: string;
  envAndSocial: string;
  createdAt?: string;
  updatedAt?: string;
}

// ---------- Choreograph ----------
export interface Choreograph {
  _id?: string;
  companyName: string; // FK to Company (_id string)
  objectives: Objective[];
  teams: Team[];
  alignmentCheckId?: string | null; // FK to AlignmentCheck
  createdAt?: string;
  updatedAt?: string;
}
