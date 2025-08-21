// export interface BusinessGoal {
//   title: string;
//   priorityLevel: "Low" | "Medium" | "High";   // assuming priority levels as enums
//   department: string;
//   isActive: boolean;
//   completeness: number;  // assuming percentage 0-100
//   challengesAndRisk: string;
//   changeManagement: string;
//   culturalRealignment: string;
//   Ld: string;  // assuming "L&d" means Learning & Development, renamed to Ld for TS
// }

import { Types } from "mongoose";


export interface BusinessGoal {
  strategicID:Types.ObjectId;
  title: string;
  description: string;
  related_strategic_theme: string;
  priority: "High" | "Medium" | "Low";
  resource_readiness: "Yes" | "No";
  assigned_functions: string[];
  duration: "Short-term" | "Medium-term" | "Long-term";
  impact_ratings: {
    risks: "High" | "Medium" | "Low";
    compliance: "High" | "Medium" | "Low";
    culture: "High" | "Medium" | "Low";
    change_management: "High" | "Medium" | "Low";
    l_and_d: "High" | "Medium" | "Low";
    capabilities: "High" | "Medium" | "Low";
  };
  esg_issues: "Yes" | "No";
  new_capabilities_needed: "Yes" | "No";
  existing_capabilities_to_enhance: "Yes" | "No";
}


export interface StrategicTheme {
  name: string;
  description: string;
}

export interface Blueprint {
  _id?: string;
  companyName: string;
  vision: string;
  strategicThemes: StrategicTheme[];
  businessGoals: BusinessGoal[];
}
