import { SortOrder } from 'mongoose'
import { paginationHelper } from '../../../helpers/paginationHelper'
import { IGenericResponse } from '../../../interfaces/common'
import { IPaginationOptions } from '../../../interfaces/paginationOptions'
import { managementDepartmentsSearchableFields } from './managementDepartment.constants'
import {
  IManagementDepartment,
  IManagementDepartmentFilters,
} from './managementDepartment.interface'
import { ManagementDepartment } from './managementDepartment.model'

const createManagementDepartment = async (
  payload: IManagementDepartment,
): Promise<IManagementDepartment> => {
  const result = await ManagementDepartment.create(payload)
  return result
}

const getAllManagementDepartments = async (
  filters: IManagementDepartmentFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<IManagementDepartment[]>> => {
  const { searchTerms, ...filterableData } = filters

  const andConditons = []
  if (searchTerms) {
    andConditons.push({
      $or: managementDepartmentsSearchableFields.map(field => ({
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
  const result = await ManagementDepartment.find(whereCondition)
    .sort(sortCondition)
    .skip(skip)
    .limit(limit)
  const total = await ManagementDepartment.countDocuments()
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  }
}

export const ManagementDepartmentServices = {
  createManagementDepartment,
  getAllManagementDepartments,
}
