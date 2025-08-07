import { model, Schema } from "mongoose";
import { IFinancialTracker } from "./finalcialTracker.interface";



const FinancialTrackerSchema = new Schema<IFinancialTracker>(
  {
    companyName: { type: String, required: true }, 
    totalRevenue: { type: Number, required: true },
    totalExpense: { type: Number, required: true },
    revenueGrowth: { type: Number, required: true },
    grossProfit: { type: Number, required: true },
    netProfitMargin: { type: Number, required: true },
    cashInFlow: { type: Number, required: true },
    cashOutFlow: { type: Number, required: true },
    netCashPosition: { type: Number, required: true },
    operatingCashFlow: { type: Number, required: true },
    investingCashFlow: { type: Number, required: true },
    financingCashFlow: { type: Number, required: true },
    totalAsset: { type: Number, required: true },
    totalLiability: { type: Number, required: true },
    equity: { type: Number, required: true },
    debtToEquity: { type: Number, required: true },
    workingCapital: { type: Number, required: true },
    currentRatio: { type: Number, required: true },
    returnOnInvestment: { type: Number, required: true },
    returnOnEquity: { type: Number, required: true },
    capitalExpenditure: { type: Number, required: true },
    returnOnAsset: { type: Number, required: true },
    plannedRevenue: { type: Number, required: true },
    plannedExpense: { type: Number, required: true },
    actualRevenue: { type: Number, required: true },
    variance: { type: Number, required: true },
    budgetUtilization: { type: Number, required: true },
    forecastAdjReason: { type: String },
    prevForecast: { type: Number },
    adjForecast: { type: Number },
  },
  { timestamps: true }
);

export const FinancialTracker = model<IFinancialTracker>(
  'FinancialTracker',
  FinancialTrackerSchema
);