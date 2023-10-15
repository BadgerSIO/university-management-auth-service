import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { AcademicFacultyController } from './academicFaculty.controller'
import { AcademicFacultyValidation } from './academicFaculty.validation'

const router = express.Router()

router.post(
  '/create-faculty',
  validateRequest(AcademicFacultyValidation.createAcademicFacultyZodSchema),
  AcademicFacultyController.createAcademicFaculty,
)
router.get('/', AcademicFacultyController.getAllFaculty)
router.get('/:id', AcademicFacultyController.getFacultyById)
router.patch(
  '/:id',
  validateRequest(AcademicFacultyValidation.updateAcademicFacultyZodSchema),
  AcademicFacultyController.updateFacutly,
)
router.delete('/:id', AcademicFacultyController.deleteFaculty)

export const AcademicFacultyRoute = router
