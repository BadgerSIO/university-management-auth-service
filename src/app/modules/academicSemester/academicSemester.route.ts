import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { AcademicSemesterController } from './academicSemester.controller'
import { AcademicSemesterValidation } from './academicSemester.validation'

const router = express.Router()
router.get('/', AcademicSemesterController.getAllSemester)
router.get('/:id', AcademicSemesterController.getSemesterById)
router.delete('/:id', AcademicSemesterController.deleteSemester)
router.patch(
  '/:id',
  validateRequest(AcademicSemesterValidation.updateAcademicSemesterZodSchema),
  AcademicSemesterController.updateSemester,
)
router.post(
  '/create-semester',
  validateRequest(AcademicSemesterValidation.createAcademicSemesterZodSchema),
  AcademicSemesterController.createSemester,
)

export const AcademicSemesterRoute = router
