"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const ApiError_1 = __importDefault(require("../../../error/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const user_model_1 = require("../user/user.model");
const student_constants_1 = require("./student.constants");
const student_model_1 = require("./student.model");
const getAllStudent = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filterableData = __rest(filters, ["searchTerm"]);
    const andConditons = [];
    if (searchTerm) {
        andConditons.push({
            $or: student_constants_1.studentSearchableFields.map(field => ({
                [field]: {
                    $regex: searchTerm,
                    $options: 'i',
                },
            })),
        });
    }
    if (Object.keys(filterableData).length) {
        andConditons.push({
            $and: Object.entries(filterableData).map(([fields, value]) => ({
                [fields]: value,
            })),
        });
    }
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(paginationOptions);
    const sortCondition = {};
    if (sortBy && sortOrder) {
        sortCondition[sortBy] = sortOrder;
    }
    const whereCondition = (andConditons === null || andConditons === void 0 ? void 0 : andConditons.length) > 0 ? { $and: andConditons } : {};
    const result = yield student_model_1.Student.find(whereCondition)
        .populate('academicSemester')
        .populate('academicDepartment')
        .populate('academicFaculty')
        .sort(sortCondition)
        .skip(skip)
        .limit(limit);
    const total = yield student_model_1.Student.countDocuments(whereCondition);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getSingleStudent = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield student_model_1.Student.findOne({ id })
        .populate('academicSemester')
        .populate('academicDepartment')
        .populate('academicFaculty');
    return result;
});
const deleteStudent = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // check if the student is exist
    const isExist = yield student_model_1.Student.findOne({ id });
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Student not found !');
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const student = yield student_model_1.Student.findOneAndDelete({ id }, { session });
        if (!student) {
            throw new ApiError_1.default(404, 'Failed to delete student');
        }
        yield user_model_1.User.findOneAndDelete({ id }, { session });
        yield session.commitTransaction();
        yield session.endSession();
        return student;
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
});
const updateStudent = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield student_model_1.Student.findOne({ id });
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Student not found !');
    }
    // const { name, guardian, localGuardian, ...studentData } = payload
    // const updatedStudentData: Partial<IStudent> = { ...studentData }
    // if (name && Object.keys(name).length > 0) {
    //   Object.keys(name).forEach(key => {
    //     const nameKey = `name.${key}` as keyof Partial<IStudent>
    //     ;(updatedStudentData as any)[nameKey] = name[key as keyof typeof name]
    //   })
    // }
    // if (guardian && Object.keys(guardian).length > 0) {
    //   Object.keys(guardian).forEach(key => {
    //     const guardianKey = `guardian.${key}` as keyof Partial<IStudent> // `guardian.fisrtguardian`
    //     ;(updatedStudentData as any)[guardianKey] =
    //       guardian[key as keyof typeof guardian]
    //   })
    // }
    // if (localGuardian && Object.keys(localGuardian).length > 0) {
    //   Object.keys(localGuardian).forEach(key => {
    //     const localGuradianKey = `localGuardian.${key}` as keyof Partial<IStudent> // `localGuardian.fisrtName`
    //     ;(updatedStudentData as any)[localGuradianKey] =
    //       localGuardian[key as keyof typeof localGuardian]
    //   })
    // }
    const result = yield student_model_1.Student.findOneAndUpdate({ id }, payload, {
        new: true,
    })
        .populate('academicFaculty')
        .populate('academicDepartment')
        .populate('academicSemester');
    return result;
});
exports.StudentService = {
    getAllStudent,
    getSingleStudent,
    deleteStudent,
    updateStudent,
};
