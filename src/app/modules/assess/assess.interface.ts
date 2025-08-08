export interface TrendItem {
  question: string;
  answer: string;
  impactLevel?: "Low" | "Medium" | "High";
}

export interface Trend {
  trendName: TrendItem[];
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
  trends: Trend[]; // Now an array of Trend objects with trendName arrays inside
  swot: SWOT;
  challenges: Challenge[];
  competitorAnalysis: CompetitorAnalysis;
  clarhetRecommendation: ClarhetRecommendation;
  alignmentCheckId: string;
}
