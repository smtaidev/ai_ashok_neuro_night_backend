export interface BusinessGoal {
  title: string;
  priorityLevel: "Low" | "Medium" | "High";   // assuming priority levels as enums
  department: string;
  isActive: boolean;
  completeness: number;  // assuming percentage 0-100
  challengesAndRisk: string;
  changeManagement: string;
  culturalRealignment: string;
  Ld: string;  // assuming "L&d" means Learning & Development, renamed to Ld for TS
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
