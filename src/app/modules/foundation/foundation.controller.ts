import { Request, Response, NextFunction } from "express";
import { FoundationService } from "./foundation.service";
import catchAsync from "../../utils/catchAsync";
import status from "http-status";


const createFoundation = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const foundation = await FoundationService.createFoundation(req.body);
  res.status(status.CREATED).json({
    success: true,
    message: "Foundation created successfully",
    data: foundation,
  });
});

const getSpecificFoundationByCompanyName = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { companyName } = req.params;
  const foundation = await FoundationService.getSpecificFoundationByCompanyName(companyName);
  res.status(status.OK).json({
    success: true,
    message: "Foundation fetched successfully",
    data: foundation,
  });
});

const updateFoundation = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const foundation = await FoundationService.updateFoundation(id, req.body);
  res.status(status.OK).json({
    success: true,
    message: "Foundation updated successfully",
    data: foundation,
  });
});

const deleteFoundation = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.user;
  await FoundationService.deleteFoundation(id);
  res.status(status.OK).json({
    success: true,
    message: "Foundation deleted successfully",
  });
});
const createIdentity = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const company = req.user;
  console.log(company)
const result=  await FoundationService.createIdentityIntoDb(company.companyName,req.body)
  res.status(status.OK).json({
    success: true,
    message: " Identity  successfully created",
    data:result
  });

});
const getAllcapabilitysFoundation = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
   const { companyName} = req.user;
   console.log(companyName)
const result=  await FoundationService.getAllCapabilitys(companyName);
  res.status(status.OK).json({
    success: true,
    message: "capabilitys foundation successfully get",
    data:result
  });
});
const createcapabilitysFoundation = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
   const { companyName} = req.user;
   console.log(companyName)
const result=  await FoundationService.createcapabilitys(companyName,req.body);
  res.status(status.OK).json({
    success: true,
    message: "capabilitys foundation successfully created",
    data:result
  });
});
const updatecapabilitysFoundation = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
   const { companyName} = req.user;
   const{id}=req.params
   console.log(companyName)
const result=  await FoundationService.updateCapabilityById(companyName,id,req.body);
  res.status(status.OK).json({
    success: true,
    message: "capabilitys foundation successfully updated",
    data:result
  });

});

const createDifrentCapabilitysFoundation = catchAsync(async (req, res) => {
   const { companyName} = req.user;
   console.log(companyName)
const result=  await FoundationService.createDifrentCapabilitys(companyName,req.body);
  res.status(status.OK).json({
    success: true,
    message: "difrent capabilitys  foundation successfully created",
    data:result
  });
});

const createZeroFoundation = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
   const { companyName} = req.user;
   console.log(companyName)
const result=  await FoundationService.createZeroInIntoDb(companyName,req.body);
  res.status(status.OK).json({
    success: true,
    message: "zero foundation successfully created",
    data:result
  });
});




export const FoundationController = {
  createFoundation,
  getSpecificFoundationByCompanyName,
  updateFoundation,
  deleteFoundation,
  createIdentity,
  createZeroFoundation,
  createcapabilitysFoundation,
  getAllcapabilitysFoundation,
  updatecapabilitysFoundation,
  createDifrentCapabilitysFoundation
};