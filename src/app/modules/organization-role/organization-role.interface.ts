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
  choreographObjectives: "edit" | "view" | "hidden";
  teams: "edit" | "view" | "hidden";
  generateReport: "edit" | "view" | "hidden";
  reportArchives: "edit" | "view" | "hidden";
  agendaBuilder: "edit" | "view" | "hidden";
  archives: "edit" | "view" | "hidden";
}

export interface IOrganizationUser {
    userId:Types.ObjectId,
  name: string;
  email: string;
  organizationRole: string;
  clarhetRole: string;
  businessFunction: string;
  notes: string;
  permissions: Permissions;
}
