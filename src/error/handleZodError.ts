import { ZodError, ZodIssue } from 'zod'
import { IGenericErrorMessages } from '../interfaces/error'

const handleZodError = (error: ZodError) => {
  const errors: IGenericErrorMessages[] = error.issues.map(
    (issue: ZodIssue) => {
      return {
        path: issue.path[-1],
        message: issue.message,
      }
    },
  )
  const statusCode = 400
  return {
    statusCode,
    message: 'Validation Error',
    errorMessage: errors,
  }
}

export default handleZodError
