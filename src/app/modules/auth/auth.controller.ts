import { Request, RequestHandler, Response } from 'express'
import httpStatus from 'http-status'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { AuthService } from './auth.services'

const loginUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...loginUserData } = await req.body
    const result = await AuthService.loginUser(loginUserData)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'login success',
      data: result,
    })
  },
)

export const AuthController = {
  loginUser,
}
