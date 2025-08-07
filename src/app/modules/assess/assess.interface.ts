
export interface TAssess {
  companyName: string; // Foreign Key (Company ID or Name)
  trends: Trend[];
  swot: SWOT;
  challenges: Challenge[];
  competitorAnalysis: CompetitorAnalysis;
  clarhetRecommendation: ClarhetRecommendation;
  alignmentCheckId: string;
}
interface Trend {
  trendName: string;
  question: string;
  answer: string;
  impactLevel?: "Low" | "Medium" | "High"; // Optional: use enum if needed
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
