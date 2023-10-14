import { Request, RequestHandler, Response } from 'express'
import httpStatus from 'http-status'
import { paginationFields } from '../../../constants/pagination'
import catchAsync from '../../../shared/catchAsync'
import pick from '../../../shared/pick'
import sendResponse from '../../../shared/sendResponse'
import { IAcademicSemester } from './academicSemester.interface'
import { AcademicSemesterService } from './academicSemester.service'
const createSemester: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...academicSemesterInfo } = await req.body
    const result =
      await AcademicSemesterService.createSemester(academicSemesterInfo)

    sendResponse<IAcademicSemester>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semester created Successfully',
      data: result,
    })
  },
)
const getAllSemester: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, ['searchTerms', 'title', 'code', 'year'])
    const paginationOptions = pick(req.query, paginationFields)
    const result = await AcademicSemesterService.getAllSemester(
      filters,
      paginationOptions,
    )
    sendResponse<IAcademicSemester[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semester retrieved successfully',
      meta: result.meta,
      data: result.data,
    })
  },
)
const getSemesterById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id
    const result = await AcademicSemesterService.getSemesterById(id)
    sendResponse<IAcademicSemester>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semester retrieved successfully',
      data: result.data,
    })
  },
)
const deleteSemester: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id
    const result = await AcademicSemesterService.deleteSemester(id)
    sendResponse<IAcademicSemester>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semester deleted successfully',
      data: result.data,
    })
  },
)
const updateSemester: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id
    const updatedData = req.body
    const result = await AcademicSemesterService.updateSemester(id, updatedData)
    sendResponse<IAcademicSemester>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semester updated successfully',
      data: result.data,
    })
  },
)

export const AcademicSemesterController = {
  createSemester,
  getAllSemester,
  getSemesterById,
  updateSemester,
  deleteSemester,
}
