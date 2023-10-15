import { Request, RequestHandler, Response } from 'express'
import httpStatus from 'http-status'
import { paginationFields } from '../../../constants/pagination'
import catchAsync from '../../../shared/catchAsync'
import pick from '../../../shared/pick'
import sendResponse from '../../../shared/sendResponse'
import { IAcademicFaculty } from './academicFaculty.interface'
import { AcademicFacultyServices } from './academicFaculty.service'

const createAcademicFaculty: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...academicFacultyInfo } = await req.body
    const result =
      await AcademicFacultyServices.createAcademicFaculty(academicFacultyInfo)

    sendResponse<IAcademicFaculty>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Faculty created Successfully',
      data: result,
    })
  },
)
const getAllFaculty: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, ['searchTerms', 'title'])
    const paginationOptions = pick(req.query, paginationFields)
    const result = await AcademicFacultyServices.getAllFaculty(
      filters,
      paginationOptions,
    )
    sendResponse<IAcademicFaculty[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Faculty retrieved successfully',
      meta: result.meta,
      data: result.data,
    })
  },
)
const getFacultyById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id
    const result = await AcademicFacultyServices.getFacultyById(id)
    sendResponse<IAcademicFaculty>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Faculty retrieved successfully',
      data: result.data,
    })
  },
)
const updateFacutly: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id
    const updatedFacultyInfo = req.body
    const result = await AcademicFacultyServices.updateFacutly(
      id,
      updatedFacultyInfo,
    )
    sendResponse<IAcademicFaculty>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Faculty updated Successfully',
      data: result.data,
    })
  },
)

export const AcademicFacultyController = {
  createAcademicFaculty,
  getAllFaculty,
  getFacultyById,
  updateFacutly,
}
