import { model, Schema } from "mongoose";
import { IFinancialTracker } from "./finalcialTracker.interface";

const FinancialTrackerSchema = new Schema<IFinancialTracker>(
  {
    companyName: { type: String, required: true ,default:null},

    totalRevenue: { type: Number, required: true },
    revenueGrowth: { type: Number, required: true },

    totalExpense: { type: Number, required: true },

    cashInFlow: { type: Number, required: true },
    cashOutFlow: { type: Number, required: true },
    netCashPosition: { type: Number, required: true },

    plannedRevenue: { type: Number, required: true },
    plannedExpense: { type: Number, required: true },
    actualRevenue: { type: Number, required: true },
    actualExpense: { type: Number, required: true },
    variance: { type: Number, required: true },

    forecastAdjustments: { type: String },

    debtToEquity: { type: Number, required: true },
    interestCoverage: { type: Number, required: true },
    currentRatio: { type: Number, required: true },
    cashFlowForecast: { type: Number, required: true },

    marketConditions: { type: String },
    customerReliability: { type: String },
    otherStability: { type: String },

    creditRiskRating: { type: String },
    riskMitigation: { type: String },

    actionItems: { type: String },
    goingForward: { type: String }
  },
  { timestamps: true }
);

export const FinancialTracker = model<IFinancialTracker>(
  "FinancialTracker",
  FinancialTrackerSchema
);