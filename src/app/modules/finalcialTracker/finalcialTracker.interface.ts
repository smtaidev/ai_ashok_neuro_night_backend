export interface IFinancialTracker {
  // Basic
  companyName: string;

  // Revenue Overview
  totalRevenue: number;
  revenueGrowth: number;

  // Expense Tracking
  totalExpense: number;

  // Cash Flow Insight
  cashInFlow: number;
  cashOutFlow: number;
  netCashPosition: number;

  // Cash Flow (Planned vs Actual)
  plannedRevenue: number;
  plannedExpense: number;
  actualRevenue: number;
  actualExpense: number;
  variance: number;

  // Forecast Adjustments
  forecastAdjustments?: string;

  // Credit Risk Assessment — Financial Ratios
  debtToEquity: number;
  interestCoverage: number;
  currentRatio: number;
  cashFlowForecast: number;

  // Qualitative Indicators
  marketConditions?: string;
  customerReliability?: string;
  otherStability?: string;

  // Credit Risk Rating & Mitigation
  creditRiskRating?: string;
  riskMitigation?: string;

  // Action Items & Going Forward
  actionItems?: string;
  goingForward?: string;

  // Mongoose timestamps
  createdAt?: Date;
  updatedAt?: Date;

  // Optional Mongo ID
  _id?: string;
}
