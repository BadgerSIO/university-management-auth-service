import httpStatus from 'http-status'
import mongoose, { SortOrder } from 'mongoose'
import ApiError from '../../../error/ApiError'
import { paginationHelper } from '../../../helpers/paginationHelper'
import { IGenericResponse } from '../../../interfaces/common'
import { IPaginationOptions } from '../../../interfaces/paginationOptions'
import { User } from '../user/user.model'
import { studentSearchableFields } from './student.constants'
import { IStudent, IStudentFilters } from './student.interface'
import { Student } from './student.model'

const getAllStudent = async (
  filters: IStudentFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<IStudent[]>> => {
  const { searchTerm, ...filterableData } = filters
  const andConditons = []
  if (searchTerm) {
    andConditons.push({
      $or: studentSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    })
  }
  if (Object.keys(filterableData).length) {
    andConditons.push({
      $and: Object.entries(filterableData).map(([fields, value]) => ({
        [fields]: value,
      })),
    })
  }

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions)
  const sortCondition: { [key: string]: SortOrder } = {}
  if (sortBy && sortOrder) {
    sortCondition[sortBy] = sortOrder
  }
  const whereCondition = andConditons?.length > 0 ? { $and: andConditons } : {}
  const result = await Student.find(whereCondition)
    .populate('academicSemester')
    .populate('academicDepartment')
    .populate('academicFaculty')
    .sort(sortCondition)
    .skip(skip)
    .limit(limit)
  const total = await Student.countDocuments(whereCondition)
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  }
}
const getSingleStudent = async (id: string): Promise<IStudent | null> => {
  const result = await Student.findOne({ id })
    .populate('academicSemester')
    .populate('academicDepartment')
    .populate('academicFaculty')
  return result
}
const deleteStudent = async (id: string): Promise<IStudent | null> => {
  // check if the student is exist
  const isExist = await Student.findOne({ id })

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student not found !')
  }

  const session = await mongoose.startSession()

  try {
    session.startTransaction()

    const student = await Student.findOneAndDelete({ id }, { session })
    if (!student) {
      throw new ApiError(404, 'Failed to delete student')
    }

    await User.findOneAndDelete({ id }, { session })

    await session.commitTransaction()
    await session.endSession()

    return student
  } catch (error) {
    await session.abortTransaction()
    throw error
  }
}
export const StudentService = {
  getAllStudent,
  getSingleStudent,
  deleteStudent,
}
