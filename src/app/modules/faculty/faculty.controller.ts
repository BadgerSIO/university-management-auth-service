import { Request, RequestHandler, Response } from 'express'
import httpStatus from 'http-status'
import { paginationFields } from '../../../constants/pagination'
import catchAsync from '../../../shared/catchAsync'
import pick from '../../../shared/pick'
import sendResponse from '../../../shared/sendResponse'
import { facultyFilterableFields } from './faculty.constants'
import { IFaculty } from './faculty.interface'
import { FacultyService } from './faculty.service'

const getAllFaculties: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, facultyFilterableFields)
    const paginationOptions = pick(req.query, paginationFields)
    const result = await FacultyService.getAllFaculties(
      filters,
      paginationOptions,
    )
    sendResponse<IFaculty[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Facultys retrieved successfully',
      meta: result.meta,
      data: result.data,
    })
  },
)
const getSingleFaculty: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id
    const result = await FacultyService.getSingleFaculty(id)
    sendResponse<IFaculty>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Faculty retrieved successfully',
      data: result,
    })
  },
)
const deleteFaculty: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id
    const result = await FacultyService.deleteFaculty(id)
    sendResponse<IFaculty>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Faculty deleted',
      data: result,
    })
  },
)
const updateFaculty = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  const updatedData = req.body

  const result = await FacultyService.updateFaculty(id, updatedData)

  sendResponse<IFaculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty updated successfully !',
    data: result,
  })
})
export const FacultyController = {
  getAllFaculties,
  getSingleFaculty,
  deleteFaculty,
  updateFaculty,
}
