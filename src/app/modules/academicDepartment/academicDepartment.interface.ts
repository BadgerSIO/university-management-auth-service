import { Model, Types } from 'mongoose'
import { IAcademicFaculty } from '../academicFaculty/academicFaculty.interface'

export type IAcademicDepartment = {
  title: string
  academicFaculty: Types.ObjectId | IAcademicFaculty
}
export type AcademicDepartmentModel = Model<
  IAcademicDepartment,
  Record<string, unknown>
>
export type IAcademicDepartmentFilters = {
  searchTerms?: string
  title?: string
  academicFaculty?: Types.ObjectId
}
