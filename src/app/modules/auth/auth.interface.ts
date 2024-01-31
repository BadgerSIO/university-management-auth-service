export type ILogin = {
  id: string
  password: string
}
export type ILoginUserResponse = {
  accessToken: string
  refreshToken?: string
  needsPasswordChange?: boolean
}
