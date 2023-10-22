import { SortOrder } from 'mongoose'
import { paginationHelper } from '../../../helpers/paginationHelper'
import { IGenericResponse } from '../../../interfaces/common'
import { IPaginationOptions } from '../../../interfaces/paginationOptions'
import {
  IAcademicDepartment,
  IAcademicDepartmentFilters,
} from './academicDepartment.interface'
import { AcademicDepartment } from './academicDepartment.model'

const createAcademicDepartment = async (
  payload: IAcademicDepartment,
): Promise<IAcademicDepartment> => {
  const result = (await AcademicDepartment.create(payload)).populate(
    'academicFaculty',
  )
  return result
}
const getAllDepartment = async (
  filters: IAcademicDepartmentFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<IAcademicDepartment[]>> => {
  const { searchTerms, ...filterableData } = filters
  const academicDepartmentSearchableFields = ['title']
  const andConditons = []
  if (searchTerms) {
    andConditons.push({
      $or: academicDepartmentSearchableFields.map(field => ({
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
  const result = await AcademicDepartment.find(whereCondition)
    .populate('academicFaculty')
    .sort(sortCondition)
    .skip(skip)
    .limit(limit)
  const total = await AcademicDepartment.countDocuments()
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  }
}
const getDepartmentById = async (id: string) => {
  const result =
    await AcademicDepartment.findById(id).populate('academicFaculty')
  return {
    data: result,
  }
}
const updateFacutly = async (
  id: string,
  payload: Partial<IAcademicDepartment>,
) => {
  const result = await AcademicDepartment.findOneAndUpdate(
    { _id: id },
    payload,
    {
      new: true,
    },
  ).populate('academicFaculty')
  return {
    data: result,
  }
}
const deleteDepartment = async (id: string) => {
  const result = await AcademicDepartment.findByIdAndDelete(id)
  return {
    data: result,
  }
}
export const AcademicDepartmentServices = {
  createAcademicDepartment,
  getAllDepartment,
  getDepartmentById,
  updateFacutly,
  deleteDepartment,
}
