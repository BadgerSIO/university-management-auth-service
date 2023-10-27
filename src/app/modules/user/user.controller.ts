import { Request, RequestHandler, Response } from 'express'
import httpStatus from 'http-status'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { UserService } from './user.service'
const createStudent: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { student, ...userData } = await req.body
    const result = await UserService.createStudent(student, userData)

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User created Successfully',
      data: result,
    })
  },
)
const createFaculty: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { faculty, ...userData } = await req.body
    const result = await UserService.createFaculty(faculty, userData)

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Faculty created successfully!',
      data: result,
    })
  },
)
export const UserController = {
  createStudent,
  createFaculty,
}
