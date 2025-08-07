
export interface IFinancialTracker {
  companyName: string; // direct name
  totalRevenue: number;
  totalExpense: number;
  revenueGrowth: number;
  grossProfit: number;
  netProfitMargin: number;
  cashInFlow: number;
  cashOutFlow: number;
  netCashPosition: number;
  operatingCashFlow: number;
  investingCashFlow: number;
  financingCashFlow: number;
  totalAsset: number;
  totalLiability: number;
  equity: number;
  debtToEquity: number;
  workingCapital: number;
  currentRatio: number;
  returnOnInvestment: number;
  returnOnEquity: number;
  capitalExpenditure: number;
  returnOnAsset: number;
  plannedRevenue: number;
  plannedExpense: number;
  actualRevenue: number;
  variance: number;
  budgetUtilization: number;
  forecastAdjReason?: string;
  prevForecast?: number;
  adjForecast?: number;
}

