import { Request, RequestHandler, Response } from 'express'
import httpStatus from 'http-status'
import { paginationFields } from '../../../constants/pagination'
import catchAsync from '../../../shared/catchAsync'
import pick from '../../../shared/pick'
import sendResponse from '../../../shared/sendResponse'
import { managementDepartmentsFilterableFields } from './managementDepartment.constants'
import { IManagementDepartment } from './managementDepartment.interface'
import { ManagementDepartmentServices } from './managementDepartment.service'

const createManagementDepartment: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...managementDepartmentInfo } = await req.body
    const result =
      await ManagementDepartmentServices.createManagementDepartment(
        managementDepartmentInfo,
      )

    sendResponse<IManagementDepartment>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Faculty created Successfully',
      data: result,
    })
  },
)
const getAllManagementDepartments: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, managementDepartmentsFilterableFields)
    const paginationOptions = pick(req.query, paginationFields)
    const result =
      await ManagementDepartmentServices.getAllManagementDepartments(
        filters,
        paginationOptions,
      )
    sendResponse<IManagementDepartment[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'ManagementDepartment retrieved successfully',
      meta: result.meta,
      data: result.data,
    })
  },
)
export const ManagementDepartmentController = {
  createManagementDepartment,
  getAllManagementDepartments,
}
