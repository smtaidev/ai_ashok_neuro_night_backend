import { IPlan } from "./plan.interface";
import { Plan } from "./plan.model";

const createPlan=async( payload:IPlan)=>{

 if (!payload) {
    throw new Error("Plan data is required to create a new plan");
  }

  const { name} = payload;

  // Check if plan already exists
  const existingPlan = await Plan.findOne({ name });
  if (existingPlan) {
    throw new Error("Plan with this name already exists!");
  }


  const totalPlans = await Plan.countDocuments();
  if (totalPlans >= 3) {
    throw new Error("Cannot create more than 3 plans");
  }
  const result=await Plan.create(payload)


return result

}



// Get all plans
 const getAllPlans = async () => {
  const plans = await Plan.find().sort({ createdAt: -1 });
  return plans;
};

// Get single plan by ID
 const getSinglePlan = async (planId: string) => {
  const plan = await Plan.findById(planId);
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

  const plan = await Plan.findByIdAndUpdate(planId, payload, { new: true });
  if (!plan) {
    throw new Error("Plan not found");
  }

  return plan;
};

// Delete a plan by ID
 const deletePlan = async (planId: string) => {
  const plan = await Plan.findByIdAndDelete(planId);
  if (!plan) {
    throw new Error("Plan not found");
  }
  return plan;
};

export  const planServices={
    createPlan,
    getAllPlans,
    updatePlan,
    getSinglePlan,
    deletePlan
}
