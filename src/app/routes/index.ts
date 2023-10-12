import express from 'express'
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
]
moduleRoutes.forEach(route => router.use(route.path, route.route))
export default router
