import express from 'express'
import { AcademicFacultyRoute } from '../modules/academicFaculty/academicFaculty.route'
import { AcademicSemesterRoute } from '../modules/academicSemester/academicSemester.route'
import { UserRoutes } from '../modules/user/user.route'

const router = express.Router()
const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/academic-semester',
    route: AcademicSemesterRoute,
  },
  {
    path: '/academic-faculty',
    route: AcademicFacultyRoute,
  },
]
moduleRoutes.forEach(route => router.use(route.path, route.route))
export default router
