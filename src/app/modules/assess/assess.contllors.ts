import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AssessServices } from "./assess.services";

const createAssessIntDb = catchAsync(async (req, res) => {
  console.log(req.body);
  const result = await AssessServices.createAssess(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Assess created successfully",
    data: result,
  });
});

const getAssessIntDb = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await AssessServices.getAllAssess();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Assess retrieved successfully",
    data: result,
  });
});
const getSingleAssessIntDb = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await AssessServices.getSingleAssess(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Assess retrieved successfully",
    data: result,
  });
});
const updatedAssessIntDb = catchAsync(async (req, res) => {
  const { id } = req.params;
  console.log("id", id);
  const result = await AssessServices.updateAssess(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Assess updated successfully",
    data: result,
  });
});

const deletedAssessIntDb = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AssessServices.deleteAssess(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Assess deleted successfully",
    data: result,
  });
});

//----------------trends contllors section  -----------------------------------------------------------
const createTrendIntDb = catchAsync(async (req, res) => {
  const company = req.user;

  const result = await AssessServices.createtrendIntoDb(
    company.companyName,
    req.body
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "trend  successfully updated !",
    data: result,
  });
});


const updateTrendIntDb = catchAsync(async (req, res) => {
  const company = req.user;
  const { id } = req.params;
  const result = await AssessServices.updateTrendInDb(
    company.companyName,
    id,
    req.body
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "trend  successfully updated !",
    data: result,
  });
});

// Get All Trends
const getAllTrendsIntDb = catchAsync(async (req, res) => {
  const company = req.user;
  const result = await AssessServices.getAllTrendsFromDb(company.companyName);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All trends fetched successfully!",
    data: result,
  });
});

// Get Single Trend
const getSingleTrendIntDb = catchAsync(async (req, res) => {
  const company = req.user;
  const { id } = req.params;
  const result = await AssessServices.getSingleTrendFromDb(
    company.companyName,
    id
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Trend fetched successfully!",
    data: result,
  });
});

// Delete Trend
const deleteTrendIntDb = catchAsync(async (req, res) => {
  const company = req.user;
  const { id } = req.params;
  const result = await AssessServices.deleteTrendFromDb(
    company.companyName,
    id
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Trend deleted successfully!",
    data: result,
  });
});

//----------------swot contllors section  -----------------------------------------------------------
const createSwotIntDb = catchAsync(async (req, res) => {
  const company = req.user;
  console.log("company data", company);

  const result = await AssessServices.createSwotIntoDb(
    company.companyName,
    req.body
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "swot  successfully updated !",
    data: result,
  });
});

const updateSwotIntDb = catchAsync(async (req, res) => {
  const company = req.user;
  const { id } = req.params;
  const result = await AssessServices.updateSwotInDb(
    company.companyName,
    id,
    req.body
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "update successfully updated !",
    data: result,
  });
});

const createsingleSwotIntDb = catchAsync(async (req, res) => {
  const company = req.user;

  console.log(company)
  const result = await AssessServices.createSwotSingleIntoDb(
    company.companyName,
    req.body
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "create swot successfully !",
    data: result,
  });
});
const getsingleSwotIntDb = catchAsync(async (req, res) => {
  const company = req.user;

  console.log(company)
  const result = await AssessServices.getAllSwotByCompany(
    company.companyName
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "get all swot successfully !",
    data: result,
  });
});
const deletesingleSwotIntDb = catchAsync(async (req, res) => {
  const company = req.user;
const {id}=req.params
  console.log(company)
  const result = await AssessServices.deleteSwotFromDb(
    company.companyName,id,req.body
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "delelted swot successfully !",
    data: result,
  });
});

//----------------Challenge contllors section  -----------------------------------------------------------
const createChallengeIntDb = catchAsync(async (req, res) => {
  const company = req.user;
  const result = await AssessServices.createChallengeIntoDb(
    company.companyName,
    req.body
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "challenge   successfully updated !",
    data: result,
  });
});

const updatChallengeIntDb = catchAsync(async (req, res) => {
  const company = req.user;
  const { id } = req.params;
  const result = await AssessServices.updateChallengeInDb(
    company.companyName,
    id,
    req.body
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "challenge successfully updated !",
    data: result,
  });
});

const getAllChallengesFromDb = catchAsync(async (req, res) => {
  const company = req.user;

  const result = await AssessServices.getAllChallengesFromDb(
    company.companyName
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All challenges retrieved successfully!",
    data: result,
  });
});

// ---------- Get Single Challenge ----------
const getSingleChallengeFromDb = catchAsync(async (req, res) => {
  const company = req.user;
  const { id } = req.params;

  const result = await AssessServices.getSingleChallengeFromDb(
    company.companyName,
    id
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Single challenge retrieved successfully!",
    data: result,
  });
});

const deleteSingleChallengeFromDb = catchAsync(async (req, res) => {
  const company = req.user;
  const { id } = req.params;

  console.log(id)
  const result = await AssessServices.deleteSingleChallengeFromDb(
    company.companyName,
    id
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Challenge deleted successfully!",
    data: result,
  });
});
//----------------CompetitorAnalysis contllors section  -----------------------------------------------------------
const createCompetitorAnalysisIntDb = catchAsync(async (req, res) => {
  const company = req.user;

  const result = await AssessServices.createCompetitorAnalysisIntoDb(
    company.companyName,
    req.body
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "competior  successfully updated !",
    data: result,
  });
});

const updatCompetitorAnalysisIntDb = catchAsync(async (req, res) => {
  const company = req.user;
  const { id } = req.params;
  const result = await AssessServices.updateCompetitorAnalysisInDb(
    company.companyName,
    id,
    req.body
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Competitor Analysis successfully updated !",
    data: result,
  });
});
//----------------ClarhetRecommendation contllors section  -----------------------------------------------------------
const createClarhetRecommendationIntDb = catchAsync(async (req, res) => {
  const company = req.user;

  const result = await AssessServices.createClarhetRecommendationIntoDb(
    company.companyName,
    req.body
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "clarhet  successfully updated !",
    data: result,
  });
});

const updateClarhetRecommendationIntDb = catchAsync(async (req, res) => {
  const company = req.user;
  const { id } = req.params;
  const result = await AssessServices.updateClarhetRecommendationInDb(
    company.companyName,
    id,
    req.body
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Clarhet RecommendationAnalysis successfully updated !",
    data: result,
  });
});

export const AssessContllors = {
  createAssessIntDb,
  getAssessIntDb,
  updatedAssessIntDb,
  deletedAssessIntDb,
  getSingleAssessIntDb,
  createTrendIntDb,
  createSwotIntDb,
  createChallengeIntDb,
  createCompetitorAnalysisIntDb,
  createClarhetRecommendationIntDb,
  updateTrendIntDb,
  updatChallengeIntDb,
  updateSwotIntDb,
  updatCompetitorAnalysisIntDb,
  updateClarhetRecommendationIntDb,
  getAllTrendsIntDb,
  getSingleTrendIntDb,
  createsingleSwotIntDb,
  getsingleSwotIntDb,
  getAllChallengesFromDb,
  getSingleChallengeFromDb,
  deletesingleSwotIntDb,
  deleteSingleChallengeFromDb
};
