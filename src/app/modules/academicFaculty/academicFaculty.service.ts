import { SortOrder } from 'mongoose'
import { paginationHelper } from '../../../helpers/paginationHelper'
import { IGenericResponse } from '../../../interfaces/common'
import { IPaginationOptions } from '../../../interfaces/paginationOptions'
import {
  IAcademicFaculty,
  IAcademicFacultyFilters,
} from './academicFaculty.interface'
import { AcademicFaculty } from './academicFaculty.model'

const createAcademicFaculty = async (
  payload: IAcademicFaculty,
): Promise<IAcademicFaculty> => {
  const result = await AcademicFaculty.create(payload)
  return result
}
const getAllFaculty = async (
  filters: IAcademicFacultyFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<IAcademicFaculty[]>> => {
  const { searchTerms, ...filterableData } = filters
  const academicFacultySearchableFields = ['title']
  const andConditons = []
  if (searchTerms) {
    andConditons.push({
      $or: academicFacultySearchableFields.map(field => ({
        [field]: {
          $regex: searchTerms,
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
  const result = await AcademicFaculty.find(whereCondition)
    .sort(sortCondition)
    .skip(skip)
    .limit(limit)
  const total = await AcademicFaculty.countDocuments()
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  }
}
const getFacultyById = async (id: string) => {
  const result = await AcademicFaculty.findById(id)
  return {
    data: result,
  }
}
const updateFacutly = async (
  id: string,
  payload: Partial<IAcademicFaculty>,
) => {
  const result = await AcademicFaculty.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  })
  return {
    data: result,
  }
}
export const AcademicFacultyServices = {
  createAcademicFaculty,
  getAllFaculty,
  getFacultyById,
  updateFacutly,
}
