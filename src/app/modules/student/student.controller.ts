import { Request, RequestHandler, Response } from 'express'
import httpStatus from 'http-status'
import { paginationFields } from '../../../constants/pagination'
import catchAsync from '../../../shared/catchAsync'
import pick from '../../../shared/pick'
import sendResponse from '../../../shared/sendResponse'
import { studentFilterableFields } from './student.constants'
import { IStudent } from './student.interface'
import { StudentService } from './student.service'

const getAllStudent: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, studentFilterableFields)
    const paginationOptions = pick(req.query, paginationFields)
    const result = await StudentService.getAllStudent(
      filters,
      paginationOptions,
    )
    sendResponse<IStudent[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Students retrieved successfully',
      meta: result.meta,
      data: result.data,
    })
  },
)
const getSingleStudent = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id

  const result = await StudentService.getSingleStudent(id)

  sendResponse<IStudent>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student fetched successfully !',
    data: result,
  })
})
const deleteStudent = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id

  const result = await StudentService.deleteStudent(id)

  sendResponse<IStudent>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student deleted successfully !',
    data: result,
  })
})

export const StudentController = {
  getAllStudent,
  getSingleStudent,
  deleteStudent,
}
