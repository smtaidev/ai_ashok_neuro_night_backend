type ImpactLevel = "Low" | "Medium" | "High";

export interface Trend {
  trendName: string;
  trendDetails: {
    question: string;
    answer: string;
    impactLevel?: ImpactLevel; // Optional
  }[];
}

export interface SWOT {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface Challenge {
  title: string;
  category: string;
  impactOnBusiness: string;
  abilityToAddress: string;
  description: string;
}

export interface CompetitorAnalysis {
  name: string;
  companyUrl: string;
  stockSymbol: string;
  twitterLink: string;
  linkedinLink: string;
  instagramLink: string;
  glassdoorLink: string;
}

export interface ClarhetRecommendation {
  onChallenges: string;
  onTrends: string;
  onSwot: string;
  onCA: string; // CA = Competitor Analysis
}

export interface TAssess {
  companyName: string; // Foreign Key (Company ID or Name)
  trends: Trend[];
  swot: SWOT[];       // <-- এখানে অ্যারে হিসাবে রাখা হয়েছে
  challenges: Challenge[];
  competitorAnalysis: CompetitorAnalysis;
  clarhetRecommendation: ClarhetRecommendation;
  alignmentCheckId: string;
}
