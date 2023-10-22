import { IAcademicSemester } from '../academicSemester/academicSemester.interface'
import { User } from './user.model'
export const findLastStudentId = async (): Promise<string | undefined> => {
  const lastStudent = await User.findOne(
    {
      role: 'student',
    },
    { id: 1, _id: 0 },
  )
    .sort({
      createdAt: -1,
    })
    .lean()

  return lastStudent?.id ? lastStudent.id.substring(4) : undefined
}

export const generateStudentId = async (
  academicsemester: IAcademicSemester,
) => {
  const currentId =
    (await findLastStudentId()) || (0).toString().padStart(5, '0') //00000
  //increment by 1
  let incrementedId = (parseInt(currentId) + 1).toString().padStart(5, '0')
  incrementedId = `${academicsemester.year.substring(2)}${
    academicsemester.code
  }${incrementedId}`
  return incrementedId
}
