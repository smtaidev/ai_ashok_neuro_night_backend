import mongoose from "mongoose";
import { IPlan } from "./plan.interface";

import { stripe } from "../../utils/stripe";
import { PlanModel } from "./plan.model";
import AppError from "../../errors/AppError";
import status from "http-status";



interface Plan {
  planName: string;
  description?: string;
  amount: number;
  interval: "day" | "week" | "month" | "year";
  intervalCount: number;
  active: boolean;
  features?: string[];
}

export const createPlan = async (payload: Plan) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Step 1: Create Product in Stripe
    const product = await stripe.products.create({
      name: payload.planName,
      description: payload.description || "",
      active: true,
    });

    // Step 2: Create Price in Stripe
    const recurringData: any = {
      interval: payload.interval,
      interval_count: payload.intervalCount,
    };

    const price = await stripe.prices.create({
      currency: "usd",
      unit_amount: Math.round(payload.amount * 100),
      active: true,
      recurring: recurringData,
      product: product.id,
    });
  const query = {
    companyName: { $regex: new RegExp(`^${payload.planName}$`, "i") },
  };

    const isEexist=await PlanModel.findOne(query)
    if(isEexist){
      throw new AppError(status.BAD_REQUEST,"This plan already exist in database ")
    }
    // Step 3: Create Plan Record in MongoDB
    const dbPlan = await PlanModel.create(
      [
        {
          amount: payload.amount || 0,
          planName: payload.planName,
          currency: "usd",
          interval: payload.interval,
          intervalCount: payload.intervalCount,
          productId: product.id,
          priceId: price.id,
          active: payload.active,
          description: payload.description,
          features: payload.features || [],
        },
      ],
      { session } // transaction handle
    );

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return dbPlan[0]; // because create([]) returns array
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(error.message || "Plan creation failed");
  }
};
// Get all plans
 const getAllPlans = async () => {
  const plans = await PlanModel.find().sort({ createdAt: -1 });
  return plans;
};

// Get single plan by ID
 const getSinglePlan = async (planId: string) => {
  const plan = await PlanModel.findById(planId);
  if (!plan) {
    throw new Error("Plan not found");
  }
  return plan;
};

// Update a plan by ID
const updatePlan = async (planId: string, payload: Partial<IPlan>) => {
  if (!payload) {
    throw new Error("Update data is required");
  }

  const plan = await PlanModel.findByIdAndUpdate(planId, payload, { new: true });
  if (!plan) {
    throw new Error("Plan not found");
  }

  return plan;
};

// Delete a plan by ID
 const deletePlan = async (planId: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Step 1: Find the plan in MongoDB
    const plan = await PlanModel.findById(planId).session(session);

    if (!plan) {
      throw new Error(`Plan with ID ${planId} not found`);
    }

    // Step 2: Deactivate price in Stripe
    if ((plan as any).stripePriceId) {
      await stripe.prices.update((plan as any).stripePriceId, { active: false });
    }

    // Step 3: Deactivate product in Stripe
    if ((plan as any).stripeProductId) {
      await stripe.products.update((plan as any).stripeProductId, { active: false });
    }

    // Step 4: Delete the plan from MongoDB
    await PlanModel.deleteOne({ _id: planId }).session(session);

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return {
      message: `Plan with ID ${planId} archived and deleted successfully`,
    };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(error.message || "Failed to delete plan");
  }
};

export  const planServices={
    createPlan,
    getAllPlans,
    updatePlan,
    getSinglePlan,
    deletePlan
}
