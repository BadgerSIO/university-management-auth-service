import express from 'express'
import { AcademicDepartmentRoute } from '../modules/academicDepartment/academicDepartment.route'
import { AcademicFacultyRoute } from '../modules/academicFaculty/academicFaculty.route'
import { AcademicSemesterRoute } from '../modules/academicSemester/academicSemester.route'
import { FacultyRoutes } from '../modules/faculty/faculty.route'
import { ManagementDepartmentRoute } from '../modules/managementDepartment/managementDepartment.route'
import { StudentRoutes } from '../modules/student/student.route'
import { UserRoutes } from '../modules/user/user.route'

const router = express.Router()
const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/students',
    route: StudentRoutes,
  },
  {
    path: '/faculty',
    route: FacultyRoutes,
  },
  {
    path: '/academic-semester',
    route: AcademicSemesterRoute,
  },
  {
    path: '/academic-faculty',
    route: AcademicFacultyRoute,
  },
  {
    path: '/academic-department',
    route: AcademicDepartmentRoute,
  },
  {
    path: '/management-departments',
    route: ManagementDepartmentRoute,
  },
]
moduleRoutes.forEach(route => router.use(route.path, route.route))
export default router
