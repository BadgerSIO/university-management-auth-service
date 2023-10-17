import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { AcademicDepartmentController } from './academicDepartment.controller'
import { AcademicDepartmentValidation } from './academicDepartment.validation'

const router = express.Router()

router.post(
  '/create-department',
  validateRequest(
    AcademicDepartmentValidation.createAcademicDepartmentZodSchema,
  ),
  AcademicDepartmentController.createAcademicDepartment,
)
router.get('/', AcademicDepartmentController.getAllDepartment)
router.get('/:id', AcademicDepartmentController.getDepartmentById)
router.patch(
  '/:id',
  validateRequest(
    AcademicDepartmentValidation.updateAcademicDepartmentZodSchema,
  ),
  AcademicDepartmentController.updateFacutly,
)
router.delete('/:id', AcademicDepartmentController.deleteDepartment)

export const AcademicDepartmentRoute = router
