export interface TAssess {
  companyName: string; // Foreign Key (Company ID or Name)
  trends: Trend[];
  swot: SWOT;
  challenges: Challenge[];
  competitorAnalysis: CompetitorAnalysis;
  clarhetRecommendation: ClarhetRecommendation;
  alignmentCheckId: string;
}

type ImpactLevel = "Low" | "Medium" | "High";

interface Trend {
  trendName: string;
  trendDetails: {
    question: string;
    answer: string;
    impactLevel?: ImpactLevel; // Optional
  }[];
}

interface SWOT {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

interface Challenge {
  title: string;
  category: string;
  impactOnBusiness: string;
  abilityToAddress: string;
  description: string;
}

interface CompetitorAnalysis {
  name: string;
  companyUrl: string;
  stockSymbol: string;
  twitterLink: string;
  linkedinLink: string;
  instagramLink: string;
  glassdoorLink: string;
}

interface ClarhetRecommendation {
  onChallenges: string;
  onTrends: string;
  onSwot: string;
  onCA: string; // CA = Competitor Analysis
}
