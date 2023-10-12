import { NextFunction, Request, RequestHandler, Response } from 'express'
import httpStatus from 'http-status'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { AcademicSemesterService } from './academicSemester.service'
const createSemester: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { ...academicSemesterInfo } = await req.body
    const result =
      await AcademicSemesterService.createSemester(academicSemesterInfo)
    next()
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semester created Successfully',
      data: result,
    })
  },
)
export const AcademicSemesterController = {
  createSemester,
}
