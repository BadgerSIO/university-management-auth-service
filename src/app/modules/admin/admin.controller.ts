import { Request, RequestHandler, Response } from 'express'
import httpStatus from 'http-status'
import { paginationFields } from '../../../constants/pagination'
import catchAsync from '../../../shared/catchAsync'
import pick from '../../../shared/pick'
import sendResponse from '../../../shared/sendResponse'
import { adminFilterableFields } from './admin.constants'
import { IAdmin } from './admin.interface'
import { AdminService } from './admin.services'
const getAllAdmins: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, adminFilterableFields)
    const paginationOptions = pick(req.query, paginationFields)
    const result = await AdminService.getAllAdmins(filters, paginationOptions)
    sendResponse<IAdmin[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admins retrieved successfully',
      meta: result.meta,
      data: result.data,
    })
  },
)
const getSingleAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id
    const result = await AdminService.getSingleAdmin(id)
    sendResponse<IAdmin>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: result ? 'Admin retrieved' : 'No admin matched this id',
      data: result,
    })
  },
)
const deleteAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id
    const result = await AdminService.deleteAdmin(id)
    sendResponse<IAdmin>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin deleted',
      data: result,
    })
  },
)
const updateAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id
    const updateData = req.body
    const result = await AdminService.updateAdmin(id, updateData)
    sendResponse<IAdmin>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin updated successfully !',
      data: result,
    })
  },
)
export const AdminController = {
  deleteAdmin,
  getAllAdmins,
  getSingleAdmin,
  updateAdmin,
}
