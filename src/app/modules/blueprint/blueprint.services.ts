import status from "http-status";
import AppError from "../../errors/AppError";
import { Blueprint, BusinessGoal, StrategicTheme } from "./blueprint.interface";
import { BlueprintModel, StrategicModel } from "./blueprint.model";
import { FoundationModel } from "../foundation/foundation.model";
import choreographModel from "../choreograph/choreograph.model";
import mongoose from "mongoose";
import config from "../../../config";
import axios from "axios";
import { RiskModel, VisionAssessmentModel } from "../ai.response/ai.model";
import AssessModel from "../assess/assess.model";

const createVision = async (
  companyName: string,
  payload: Partial<Blueprint>
) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  }

  // if (!payload.vision) {
  //   throw new AppError(status.BAD_REQUEST, "Vision is required!");
  // }

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  };

  const result = await BlueprintModel.findOneAndUpdate(
    query,
    { $set: { vision: payload.vision } },
    { new: true, upsert: true }
  );

  const visionData = await BlueprintModel.findOne(query);

  const vision_statement = visionData?.vision;
  console.log(vision_statement);
  const apiUrls = `${config.ai_base_url}/blueprint/vision`;

  const responses = await axios.post(
    apiUrls,
    { vision_statement },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const updated = await VisionAssessmentModel.findOneAndUpdate(
    { companyName: companyName }, // match by companyName
    responses.data,
    {
      new: true, // return updated document
      upsert: true, // create if not exists
      setDefaultsOnInsert: true,
    }
  );

  return result;
};

const getVision = async (companyName: string) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  }

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  };

  const result = await BlueprintModel.findOne(query, { vision: 1 });

  return result;
};

const createstategicTheme = async (
  companyName: string,
  payload: Partial<BusinessGoal>
) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  }

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  };

  const result = await BlueprintModel.findOneAndUpdate(
    query,
    { $push: { strategicThemes: payload } },
    { new: true, upsert: true }
  );
  const themesData = await BlueprintModel.findOne(query);
  const themes = themesData?.strategicThemes?.map(({ name, description }) => ({
    name,
    description,
  }));

  const foundation = await FoundationModel.findOne(query).lean();

  const assessData = await AssessModel.findOne(query).lean();

  const competitors = assessData?.competitorAnalysis
    .map(({ name, description }) => ({ name, description })) // শুধু প্রয়োজনীয় fields
    .filter((item) => item.name && item.description) // null filter
    .filter(
      (item, index, self) =>
        index ===
        self.findIndex(
          (t) => t.name === item.name && t.description === item.description
        ) // duplicate remove
    );
  const capabilities = foundation?.capabilitys
    .map(({ capability, type }) => ({ capability, type })) // শুধু প্রয়োজনীয় fields
    .filter((item) => item.capability && item.type) // null filter
    .filter(
      (item, index, self) =>
        index ===
        self.findIndex(
          (t) => t.capability === item.capability && t.type === item.type
        ) // duplicate remove
    );

  const challengeData = (await RiskModel.find(query)) as any;
  const formattedChallenges =
    challengeData?.[0]?.challenge?.map((item: any) => ({
      title: item.title,
      category: item.category,
      impact_on_business: item.impact_on_business
        ? item.impact_on_business.charAt(0).toUpperCase() +
          item.impact_on_business.slice(1).toLowerCase()
        : "",
      ability_to_address: item.ability_to_address
        ? item.ability_to_address.charAt(0).toUpperCase() +
          item.ability_to_address.slice(1).toLowerCase()
        : "",
      description: item.description,
      risk_score: item.risk_score,
    })) || [];
  const context = {
    mission: foundation?.identity?.mission,
    value: foundation?.identity?.value,
    purpose: foundation?.identity?.value,
    customers: foundation?.zeroIn?.targetCustomer,
    value_proposition: foundation?.zeroIn?.valueProposition,
    capabilities,
    competitors,
    challenges: formattedChallenges,
  };
  const allData = {
    themes: themes,
    context,
  };

  console.log(JSON.stringify(allData, null, 2));

  const apiUrls = `${config.ai_base_url}/strategic-theme2/combined-analysis`;

  const responses = await axios.post(apiUrls, allData, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  const themesAiData = responses.data;

 const themeAiData = await StrategicModel.findOneAndUpdate(
  query,                // কোন কন্ডিশনে match করবে
  { $set: themesAiData,companyName}, // কোন data update হবে
  { new: true, upsert: true } // new: true → updated doc return করবে, upsert: true → না থাকলে create করবে
);
  console.log(themeAiData)
  return result;
};
const updatestategicTheme = async (
  id: string,
  companyName: string,
  payload: Partial<StrategicTheme>
) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  }

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
    "strategicThemes._id": id,
  };

  const update = {
    $set: {
      "strategicThemes.$.name": payload.name,
      "strategicThemes.$.description": payload.description,
    },
  };
  console.log(update)

  const result = await BlueprintModel.findOneAndUpdate(query, update, {
    new: true,
  });

  const querys = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  };

 
  const themesData = await BlueprintModel.findOne(querys);
  const themes = themesData?.strategicThemes?.map(({ name, description }) => ({
    name,
    description,
  }));
  const foundation = await FoundationModel.findOne(querys).lean();

  const assessData = await AssessModel.findOne(querys).lean();

  const competitors = assessData?.competitorAnalysis
    .map(({ name, description }) => ({ name, description })) // শুধু প্রয়োজনীয় fields
    .filter((item) => item.name && item.description) // null filter
    .filter(
      (item, index, self) =>
        index ===
        self.findIndex(
          (t) => t.name === item.name && t.description === item.description
        ) // duplicate remove
    );
  const capabilities = foundation?.capabilitys
    .map(({ capability, type }) => ({ capability, type })) // শুধু প্রয়োজনীয় fields
    .filter((item) => item.capability && item.type) // null filter
    .filter(
      (item, index, self) =>
        index ===
        self.findIndex(
          (t) => t.capability === item.capability && t.type === item.type
        ) // duplicate remove
    );

  const challengeData = (await RiskModel.find(querys)) as any;
  const formattedChallenges =
    challengeData?.[0]?.challenge?.map((item: any) => ({
      title: item.title,
      category: item.category,
      impact_on_business: item.impact_on_business
        ? item.impact_on_business.charAt(0).toUpperCase() +
          item.impact_on_business.slice(1).toLowerCase()
        : "",
      ability_to_address: item.ability_to_address
        ? item.ability_to_address.charAt(0).toUpperCase() +
          item.ability_to_address.slice(1).toLowerCase()
        : "",
      description: item.description,
      risk_score: item.risk_score,
    })) || [];
  const context = {
    mission: foundation?.identity?.mission,
    value: foundation?.identity?.value,
    purpose: foundation?.identity?.value,
    customers: foundation?.zeroIn?.targetCustomer,
    value_proposition: foundation?.zeroIn?.valueProposition,
    capabilities,
    competitors,
    challenges: formattedChallenges,
  };
  const allData = {
    themes: themes,
    context,
  };

  console.log(JSON.stringify(allData, null, 2));

  const apiUrls = `${config.ai_base_url}/strategic-theme2/combined-analysis`;

  const responses = await axios.post(apiUrls, allData, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  const themesAiData = responses.data;

 const themeAiData = await StrategicModel.findOneAndUpdate(
  querys,                // কোন কন্ডিশনে match করবে
  { $set: themesAiData,companyName}, // কোন data update হবে
  { new: true, upsert: true } // new: true → updated doc return করবে, upsert: true → না থাকলে create করবে
);
  console.log(themeAiData)

  return result;
};

const getAllStrategicThemes = async (companyName: string) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  }

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  };

  const result = await BlueprintModel.findOne(query, {
    strategicThemes: 1,
    _id: 0,
  });
  return result?.strategicThemes || [];
};

const getSingleStrategicTheme = async (id: string, companyName: string) => {
  if (!companyName)
    throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  if (!id) throw new AppError(status.BAD_REQUEST, "Theme ID is required!");

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
    "strategicThemes._id": id,
  };

  const result = await BlueprintModel.findOne(query, {
    "strategicThemes.$": 1,
    _id: 0,
  });
  return result?.strategicThemes?.[0] || null;
};

const deleteSingleStrategicTheme = async (id: string, companyName: string) => {
  if (!companyName)
    throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  if (!id) throw new AppError(status.BAD_REQUEST, "Theme ID is required!");

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  };

  const update = {
    $pull: {
      strategicThemes: { _id: id },
    },
  };

  const result = await BlueprintModel.updateOne(query, update);

  if (result.modifiedCount === 0) {
    throw new AppError(
      status.NOT_FOUND,
      "Strategic theme not found or already deleted!"
    );
  }

  return { success: true, message: "Strategic theme deleted successfully." };
};

// ------------------this is the business goal services -------------------------------------areya
const createbusinessGoal = async (
  companyName: string,
  payload: Partial<BusinessGoal>
) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  }

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  };

  try {
    const result = await BlueprintModel.findOneAndUpdate(
      query,
      { $push: { businessGoals: payload } },
      { new: true, upsert: true }
    );
    console.log("Update result:", result);
  const business = await BlueprintModel.findOne(query).lean();
  const themesData = await BlueprintModel.findOne(query);
  const aichallengeDataFind = await RiskModel.findOne(
    { companyName },
    { companyName: 0, _id: 0, __v: 0 }
  ).lean();

  const visionData = await BlueprintModel.findOne(query).lean();

  // choreograph data আনো
  const choreographData = await choreographModel.findOne(query).lean();

  // Clean strategic_themes
  const strategic_themes = themesData?.strategicThemes.map(theme => {
    const obj = (theme as any).toObject ? (theme as any).toObject() : theme;
    const { _id, createdAt, updatedAt, ...rest } = obj;
    return rest;
  });

  // Clean goals and nested impact_ratings
  const goals = business?.businessGoals.map(goal => {
    const g = goal as any;
    const { impact_ratings } = g;

    let cleanImpactRatings = undefined;
    if (impact_ratings) {
      const ir = impact_ratings as any;
      const { _id: irId, createdAt: irCreatedAt, updatedAt: irUpdatedAt, ...otherRatings } = ir;
      cleanImpactRatings = otherRatings;
    }

    // assigned_functions এ theme name যোগ করা
const assignedFunctionsWithName = (g.assigned_functions || []).map((funcId: string) => {
  const matchedTeam = choreographData?.teams?.find(team => String(team._id) === String(funcId));
  return matchedTeam ? matchedTeam.teamName : null;
});


    const businessGoalForAi = {
      title: g.title,
      description: g.description,
      related_strategic_theme: g.related_strategic_theme,
      priority: g.priority,
      resource_readiness: g.resource_readiness,
      assigned_functions: assignedFunctionsWithName,
      duration: g.duration,
      esg_issues: g.esg_issues,
      new_capabilities_needed: g.new_capabilities_needed,
      existing_capabilities_to_enhance: g.existing_capabilities_to_enhance,
      impact_ratings: cleanImpactRatings
    };

    return { ...businessGoalForAi };
  });

  // Clean challenges
  const challenges = aichallengeDataFind?.challenge.map(ch => {
    const c = ch as any;
    const { _id, createdAt, updatedAt, ...rest } = c;
    return rest;
  });
  // console.log(challenges)

  const allData = {
    vision: visionData?.vision,
    strategic_themes,
    goals,
    challenges,
  
  };

  console.log(JSON.stringify(allData, null, 2));

  const apiUrls = `${config.ai_base_url}/business-goal/analyze2`;
  const responses = await axios.post(apiUrls, allData, {
    headers: { "Content-Type": "application/json" },
  });
    return result;
  } catch (error) {
    // console.error("Error while adding businessGoal:", error);
    throw error;
  }
};
const updateBusinessGoal = async (
  id: string,
  companyName: string,
  payload: Partial<BusinessGoal>
) => {
  if (!companyName)
    throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  if (!payload || Object.keys(payload).length === 0)
    throw new AppError(status.BAD_REQUEST, "Payload is required!");

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
    "businessGoals._id": id,
  };

  const setObj: Record<string, any> = {};
  for (const key in payload) {
    const typedKey = key as keyof typeof payload;
    setObj[`businessGoals.$.${typedKey}`] = payload[typedKey];
  }

  const update = { $set: setObj };

  const result = await BlueprintModel.findOneAndUpdate(query, update, {
    new: true,
  });
  return result;
};

// const getAllBusinessGoals = async (companyName: string) => {
//   if (!companyName) {
//     throw new AppError(status.BAD_REQUEST, "Company name is not found!");
//   }

//   const query = {
//     companyName: { $regex: new RegExp(`^${companyName}$`, "i") }
//   };

// const result = await BlueprintModel.findOne(query, { businessGoals: 1 })
//   .populate({
//     path: 'businessGoals',
//     populate: [
//       // { path: 'strategicID', model: 'Blueprint' },
//       // { path: 'assigned_functions', model: 'Blueprint' },
//       // { path: 'capabilityInfluenced', model: 'Foundation' },
//       { path: 'capabilityOwners', model: 'Organization-User' },
//       { path: 'goalOwner', model: 'Organization-User' },
//     ]
//   });
//   return result?.businessGoals || [];
// };
// const getAllBusinessGoals = async (companyName: string) => {
//   if (!companyName) {
//     throw new AppError(status.BAD_REQUEST, "Company name is not found!");
//   }

//   // 1️⃣ Blueprint find
//   const blueprint = await BlueprintModel.findOne(
//     { companyName: { $regex: new RegExp(`^${companyName}$`, "i") } },
//     { businessGoals: 1, strategicThemes: 1 }
//   ).lean();

//   if (!blueprint?.businessGoals) return [];

//   let businessGoals = blueprint.businessGoals;

//   // 🔹 Filter invalid ObjectIds before populate
//   businessGoals = businessGoals.map((goal: any) => {
//     if (Array.isArray(goal.capabilityOwners)) {
//       goal.capabilityOwners = goal.capabilityOwners.filter((id: any) =>
//         mongoose.Types.ObjectId.isValid(id)
//       );
//     } else {
//       goal.capabilityOwners = [];
//     }

//     if (goal.goalOwner && !mongoose.Types.ObjectId.isValid(goal.goalOwner)) {
//       goal.goalOwner = null;
//     }

//     return goal;
//   }) as any

//   // 2️⃣ Foundation capabilities
//   const allCapabilities = await FoundationModel.find({}, { capabilitys: 1 }).lean();

//   // 3️⃣ Choreograph data
//   const choreographData = await choreographModel.find({}).lean();

//   // 4️⃣ Populate capabilityOwners & goalOwner safely
//   await BlueprintModel.populate(businessGoals, [
//     { path: "capabilityOwners", model: "Organization-User" },
//     { path: "goalOwner", model: "Organization-User" },
//   ]);

//   // 5️⃣ Map and transform data safely
//   const populatedGoals = businessGoals.map((goal: any) => {
//     const goalObj: any = { ...goal };

//     // ✅ strategicID match
//     if (goalObj.strategicID && blueprint.strategicThemes?.length) {
//       const matchTheme = blueprint.strategicThemes.find(
//         (theme: any) => String(theme._id) === String(goalObj.strategicID)
//       );
//       goalObj.strategicID = matchTheme || null;
//     }

//     // ✅ capabilityInfluenced match (safe)
//     if (Array.isArray(goalObj.capabilityInfluenced) && allCapabilities?.length) {
//       goalObj.capabilityInfluenced = goalObj.capabilityInfluenced
//         .map((capId: any) => {
//           for (const foundation of allCapabilities) {
//             if (Array.isArray(foundation.capabilitys)) {
//               const matchCap = foundation.capabilitys.find(
//                 (c: any) => String(c._id) === String(capId)
//               );
//               if (matchCap) return matchCap;
//             }
//           }
//           return null;
//         })
//         .filter(Boolean);
//     } else {
//       goalObj.capabilityInfluenced = [];
//     }

//     return goalObj;
//   });

//   return populatedGoals;
// };

const getAllBusinessGoals = async (companyName: string) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  }

  // 1️⃣ Fetch blueprint for the company
  const blueprint = await BlueprintModel.findOne(
    { companyName: { $regex: new RegExp(`^${companyName}$`, "i") } },
    { businessGoals: 1, strategicThemes: 1 }
  ).lean();

  if (!blueprint?.businessGoals) return [];

  let businessGoals = blueprint.businessGoals as any[];

  // 🔹 Filter invalid ObjectIds in capabilityOwners and goalOwner
  businessGoals = businessGoals.map((goal) => {
    if (Array.isArray(goal.capabilityOwners)) {
      goal.capabilityOwners = goal.capabilityOwners.filter((id: any) =>
        mongoose.Types.ObjectId.isValid(id)
      );
    } else {
      goal.capabilityOwners = [];
    }

    // if (goal.goalOwner && !mongoose.Types.ObjectId.isValid(goal.goalOwner)) {
    //   goal.goalOwner = null;
    // }

    return goal;
  });

  // 2️⃣ Fetch foundation capabilities
  const allCapabilities = await FoundationModel.find(
    { companyName: { $regex: new RegExp(`^${companyName}$`, "i") } },
    { capabilitys: 1 }
  ).lean();

  // 3️⃣ Fetch choreograph data for this company (only teams)
  const choreographData = await choreographModel
    .find(
      { companyName: { $regex: new RegExp(`^${companyName}$`, "i") } },
      { teams: 1 }
    )
    .lean();

  console.log(
    JSON.stringify(choreographData, null, 2),
    "✅ Filtered choreograph data"
  );
  // 4️⃣ Populate capabilityOwners & goalOwner
  await BlueprintModel.populate(businessGoals, [
    { path: "capabilityOwners", model: "Organization-User" },
    { path: "goalOwner", model: "Organization-User" },
  ]);

  // 5️⃣ Transform business goals
  const populatedGoals = businessGoals.map((goalObj: any) => {
    const goal = { ...goalObj };

    // ✅ Map strategicID to actual theme object
    if (goal.strategicID && blueprint.strategicThemes?.length) {
      const matchTheme = blueprint.strategicThemes.find(
        (theme: any) => String(theme._id) === String(goal.strategicID)
      );
      goal.strategicID = matchTheme || null;
    }

    // ✅ Map capabilityInfluenced to actual capability objects
    if (Array.isArray(goal.capabilityInfluenced) && choreographData?.length) {
      goal.capabilityInfluenced = goal.capabilityInfluenced
        .map((capId: any) => {
          for (const foundation of allCapabilities) {
            if (Array.isArray(foundation.capabilitys)) {
              const matchCap = foundation.capabilitys.find(
                (c: any) => String(c._id) === String(capId)
              );
              if (matchCap) return matchCap;
            }
          }
          return null;
        })
        .filter(Boolean);
    } else {
      goal.capabilityInfluenced = [];
    }
    if (Array.isArray(goal.assigned_functions) && allCapabilities?.length) {
      goal.assigned_functions = goal.assigned_functions
        .map((capId: any) => {
          for (const choreograph of choreographData) {
            if (Array.isArray(choreograph.teams)) {
              const matchCap = choreograph.teams.find(
                (c: any) => String(c._id) === String(capId)
              );
              if (matchCap) return matchCap;
            }
          }
          return null;
        })
        .filter(Boolean);
    } else {
      goal.assigned_functions = [];
    }

    return goal;
  });

  return populatedGoals;
};

const getSingleBusinessGoal = async (id: string, companyName: string) => {
  if (!companyName)
    throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  if (!id) throw new AppError(status.BAD_REQUEST, "Goal ID is required!");

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
    "businessGoals._id": id,
  };

  const result = await BlueprintModel.findOne(query, { businessGoals: 1 }) // remove _id:0
    .populate("businessGoals.strategicID")
    .populate("businessGoals.assigned_functions")
    .populate("businessGoals.capabilityInfluenced")
    .populate("businessGoals.capabilityOwners")
    .populate("businessGoals.goalOwner")
    .exec();
  return result?.businessGoals || [];
};

const deleteBusinessGoal = async (id: string, companyName: string) => {
  if (!companyName)
    throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  if (!id) throw new AppError(status.BAD_REQUEST, "Goal ID is required!");

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  };

  const update = { $pull: { businessGoals: { _id: id } } };

  const result = await BlueprintModel.findOneAndUpdate(query, update, {
    new: true,
  });
  return result;
};

const businessGoalOverview = async (companyName: string) => {
  if (!companyName)
    throw new AppError(status.BAD_REQUEST, "Company name is required!");

  const blueprint = await BlueprintModel.findOne(
    { companyName: { $regex: new RegExp(`^${companyName}$`, "i") } },
    { strategicThemes: 1, businessGoals: 1, _id: 0 } // sob business goals niye aso
  );

  if (!blueprint) return [];

  // Prottekta strategic theme er niche tar relevant business goals filter koro
  const strategicThemesWithGoals = blueprint.strategicThemes.map((theme) => {
    const goals = blueprint.businessGoals.filter(
      (bg) => bg?.strategicID?.toString() === theme._id.toString()
    );
    return {
      ...theme.toObject(),
      businessGoals: goals,
    };
  });

  return strategicThemesWithGoals;
};
export const blueprintServices = {
  createVision,
  createstategicTheme,
  updatestategicTheme,
  createbusinessGoal,
  updateBusinessGoal,
  getAllBusinessGoals,
  getSingleBusinessGoal,
  deleteBusinessGoal,
  getVision,
  getAllStrategicThemes,
  getSingleStrategicTheme,
  deleteSingleStrategicTheme,
  businessGoalOverview,
};




























