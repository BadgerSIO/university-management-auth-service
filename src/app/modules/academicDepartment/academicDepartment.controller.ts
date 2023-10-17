import { Request, RequestHandler, Response } from 'express'
import httpStatus from 'http-status'
import { paginationFields } from '../../../constants/pagination'
import catchAsync from '../../../shared/catchAsync'
import pick from '../../../shared/pick'
import sendResponse from '../../../shared/sendResponse'
import { IAcademicDepartment } from './academicDepartment.interface'
import { AcademicDepartmentServices } from './academicDepartment.service'

const createAcademicDepartment: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...academicDepartmentInfo } = await req.body
    const result = await AcademicDepartmentServices.createAcademicDepartment(
      academicDepartmentInfo,
    )

    sendResponse<IAcademicDepartment>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Department created Successfully',
      data: result,
    })
  },
)
const getAllDepartment: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, ['searchTerms', 'title', 'academicFaculty'])
    const paginationOptions = pick(req.query, paginationFields)
    const result = await AcademicDepartmentServices.getAllDepartment(
      filters,
      paginationOptions,
    )
    sendResponse<IAcademicDepartment[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Department retrieved successfully',
      meta: result.meta,
      data: result.data,
    })
  },
)
const getDepartmentById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id
    const result = await AcademicDepartmentServices.getDepartmentById(id)
    sendResponse<IAcademicDepartment>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Department retrieved successfully',
      data: result.data,
    })
  },
)
const updateFacutly: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id
    const updatedDepartmentInfo = req.body
    const result = await AcademicDepartmentServices.updateFacutly(
      id,
      updatedDepartmentInfo,
    )
    sendResponse<IAcademicDepartment>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Department updated Successfully',
      data: result.data,
    })
  },
)
const deleteDepartment: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id
    const result = await AcademicDepartmentServices.deleteDepartment(id)
    sendResponse<IAcademicDepartment>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Department deleted successfully',
      data: result.data,
    })
  },
)

export const AcademicDepartmentController = {
  createAcademicDepartment,
  getAllDepartment,
  getDepartmentById,
  updateFacutly,
  deleteDepartment,
}
