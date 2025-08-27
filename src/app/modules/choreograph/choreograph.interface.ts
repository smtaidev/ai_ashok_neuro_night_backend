import { Types } from "mongoose";

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
  headcount?: number;
 description:string,
  members: Types.ObjectId[]; // Embedded Member objects
  createdAt?: string;
  updatedAt?: string;
}

// ---------- Objective ----------
export interface Objective {
title: string;
  description: string;
  startDate: string;
  endDate: string;
  priority: "Urgent" | "High" | "Medium" | "Low";
  progress: string;
  fundingAllocated: string;
  envSocialIssues: string;
  envSocialDetails: string;
  risksAssociated: string;
  riskDetails: string;

  // ObjectId fields
  objectiveOwner: Types.ObjectId;
  assignedTeamMembers: Types.ObjectId;
  invitedTeamMembers: Types.ObjectId;

  crossTeamCollaboration: string;
  businessGoals: string;
  termType: string;
  specificStrategic: string;
  necessaryResources: string;
  additionalTalent: string;
  potentialChallenges: string;
}

// ---------- Choreograph ----------
export interface Choreograph {
  _id?: string;
  companyName: string; // FK to Company (_id string)
  objectives: Objective[];
  teams: Types.ObjectId[];
  alignmentCheckId?: string | null; // FK to AlignmentCheck
  createdAt?: string;
  updatedAt?: string;
}
