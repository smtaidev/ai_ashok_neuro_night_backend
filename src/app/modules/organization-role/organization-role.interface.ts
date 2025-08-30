import { Types } from "mongoose";

export interface Permissions {
  foundations: "edit" | "view" | "hidden";
  trends: "edit" | "view" | "hidden";
  swot: "edit" | "view" | "hidden";
  challenges: "edit" | "view" | "hidden";
  competitorsAnalysis: "edit" | "view" | "hidden";
  clarhetAIRec: "edit" | "view" | "hidden";
  alignment: "edit" | "view" | "hidden";
  vision: "edit" | "view" | "hidden";
  themes: "edit" | "view" | "hidden";
  blueprintAlignment: "edit" | "view" | "hidden";
  businessGoal: "edit" | "view" | "hidden";
  choreographObjectives: "edit" | "view" | "hidden";
  teams: "edit" | "view" | "hidden";
  generateReport: "edit" | "view" | "hidden";
  reportArchives: "edit" | "view" | "hidden";
  agendaBuilder: "edit" | "view" | "hidden";
  archives: "edit" | "view" | "hidden";
}

export interface IOrganizationUser {
  userId?: Types.ObjectId;
  name: string;
  role: "companyEmployee";
  email: string;
  organizationRole: string;
  companyRole: string;
  businessFunction: string;
  notes: string;
  permissions: Permissions;
  skills?: string[];
  location?: string;
  teamRole?: string;
  type?: string;
  availability?: number;
}
