import httpStatus from 'http-status'
import { Secret } from 'jsonwebtoken'
import config from '../../../config'
import ApiError from '../../../error/ApiError'
import { jwtHelpers } from '../../../helpers/jwtHelper'
import { User } from '../user/user.model'
import { ILogin, ILoginUserResponse } from './auth.interface'
const loginUser = async (payload: ILogin): Promise<ILoginUserResponse> => {
  const { id, password } = payload
  //creating isntance of user
  const user = new User()
  const isUserExist = await user.isUserExist(id)
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist')
  }
  if (
    isUserExist?.password &&
    !user.isPasswordMatched(password, isUserExist.password)
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Access denied')
  }
  const { id: userId, role, needsPasswordChange } = isUserExist
  const accessToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.jwt_secret as Secret,
    config.jwt.jwt_expires_in as string,
  )

  const refreshToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.jwt_refresh_secret as Secret,
    config.jwt.jwt_refresh_expires_in as string,
  )

  return { accessToken, refreshToken, needsPasswordChange }
}

export const AuthService = {
  loginUser,
}
