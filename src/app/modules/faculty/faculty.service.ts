import httpStatus from 'http-status'
import mongoose, { SortOrder } from 'mongoose'
import ApiError from '../../../error/ApiError'
import { paginationHelper } from '../../../helpers/paginationHelper'
import { IGenericResponse } from '../../../interfaces/common'
import { IPaginationOptions } from '../../../interfaces/paginationOptions'
import { User } from '../user/user.model'
import { facultySearchableFields } from './faculty.constants'
import { IFaculty, IFacultyFilters } from './faculty.interface'
import { Faculty } from './faculty.model'

const getAllFaculties = async (
  filters: IFacultyFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<IFaculty[]>> => {
  // Extract searchTerm to implement search query
  const { searchTerm, ...filtersData } = filters
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions)

  const andConditions = []

  // Search needs $or for searching in specified fields
  if (searchTerm) {
    andConditions.push({
      $or: facultySearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    })
  }
  // Filters needs $and to fullfill all the conditions
  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    })
  }

  // Dynamic  Sort needs  field to  do sorting
  const sortConditions: { [key: string]: SortOrder } = {}
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder
  }
  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {}

  const result = await Faculty.find(whereConditions)
    .populate('academicDepartment')
    .populate('academicFaculty')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)

  const total = await Faculty.countDocuments(whereConditions)

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  }
}
const getSingleFaculty = async (id: string): Promise<IFaculty | null> => {
  const result = await Faculty.findOne({ id })
    .populate('academicDepartment')
    .populate('academicFaculty')
  return result
}
const deleteFaculty = async (id: string): Promise<IFaculty | null> => {
  // check if the Faculty is exist
  const isExist = await Faculty.findOne({ id })

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Faculty not found !')
  }

  const session = await mongoose.startSession()

  try {
    session.startTransaction()

    const faculty = await Faculty.findOneAndDelete({ id }, { session })
    if (!faculty) {
      throw new ApiError(404, 'Failed to delete Faculty')
    }

    await User.findOneAndDelete({ id }, { session })

    await session.commitTransaction()
    await session.endSession()

    return faculty
  } catch (error) {
    await session.abortTransaction()
    throw error
  }
}
const updateFaculty = async (
  id: string,
  payload: Partial<IFaculty>,
): Promise<IFaculty | null> => {
  const isExist = await Faculty.findOne({ id })
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Faculty not found !')
  }
  // const { name, guardian, localGuardian, ...studentData } = payload
  // const updatedStudentData: Partial<IStudent> = { ...studentData }
  // if (name && Object.keys(name).length > 0) {
  //   Object.keys(name).forEach(key => {
  //     const nameKey = `name.${key}` as keyof Partial<IStudent>
  //     ;(updatedStudentData as any)[nameKey] = name[key as keyof typeof name]
  //   })
  // }
  // if (guardian && Object.keys(guardian).length > 0) {
  //   Object.keys(guardian).forEach(key => {
  //     const guardianKey = `guardian.${key}` as keyof Partial<IStudent> // `guardian.fisrtguardian`
  //     ;(updatedStudentData as any)[guardianKey] =
  //       guardian[key as keyof typeof guardian]
  //   })
  // }
  // if (localGuardian && Object.keys(localGuardian).length > 0) {
  //   Object.keys(localGuardian).forEach(key => {
  //     const localGuradianKey = `localGuardian.${key}` as keyof Partial<IStudent> // `localGuardian.fisrtName`
  //     ;(updatedStudentData as any)[localGuradianKey] =
  //       localGuardian[key as keyof typeof localGuardian]
  //   })
  // }
  const result = await Faculty.findOneAndUpdate({ id }, payload, {
    new: true,
  })
    .populate('academicFaculty')
    .populate('academicDepartment')

  return result
}
export const FacultyService = {
  getAllFaculties,
  getSingleFaculty,
  deleteFaculty,
  updateFaculty,
}
