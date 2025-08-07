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
  const { id } = req.params;
  await FoundationService.deleteFoundation(id);
  res.status(status.OK).json({
    success: true,
    message: "Foundation deleted successfully",
  });
});

export const FoundationController = {
  createFoundation,
  getSpecificFoundationByCompanyName,
  updateFoundation,
  deleteFoundation,
};