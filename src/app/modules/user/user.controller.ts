import { Request, RequestHandler, Response } from 'express'
import httpStatus from 'http-status'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { UserService } from './user.service'
const createUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const user = await req.body
    const result = await UserService.createUser(user)

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User created Successfully',
      data: result,
    })
  },
)
export const UserController = {
  createUser,
}
