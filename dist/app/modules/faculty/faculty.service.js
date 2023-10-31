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
exports.FacultyService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const ApiError_1 = __importDefault(require("../../../error/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const user_model_1 = require("../user/user.model");
const faculty_constants_1 = require("./faculty.constants");
const faculty_model_1 = require("./faculty.model");
const getAllFaculties = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    // Extract searchTerm to implement search query
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(paginationOptions);
    const andConditions = [];
    // Search needs $or for searching in specified fields
    if (searchTerm) {
        andConditions.push({
            $or: faculty_constants_1.facultySearchableFields.map(field => ({
                [field]: {
                    $regex: searchTerm,
                    $options: 'i',
                },
            })),
        });
    }
    // Filters needs $and to fullfill all the conditions
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }
    // Dynamic  Sort needs  field to  do sorting
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield faculty_model_1.Faculty.find(whereConditions)
        .populate('academicDepartment')
        .populate('academicFaculty')
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield faculty_model_1.Faculty.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getSingleFaculty = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield faculty_model_1.Faculty.findOne({ id })
        .populate('academicDepartment')
        .populate('academicFaculty');
    return result;
});
const deleteFaculty = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // check if the Faculty is exist
    const isExist = yield faculty_model_1.Faculty.findOne({ id });
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Faculty not found !');
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const faculty = yield faculty_model_1.Faculty.findOneAndDelete({ id }, { session });
        if (!faculty) {
            throw new ApiError_1.default(404, 'Failed to delete Faculty');
        }
        yield user_model_1.User.findOneAndDelete({ id }, { session });
        yield session.commitTransaction();
        yield session.endSession();
        return faculty;
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
});
const updateFaculty = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield faculty_model_1.Faculty.findOne({ id });
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Faculty not found !');
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
    const result = yield faculty_model_1.Faculty.findOneAndUpdate({ id }, payload, {
        new: true,
    })
        .populate('academicFaculty')
        .populate('academicDepartment');
    return result;
});
exports.FacultyService = {
    getAllFaculties,
    getSingleFaculty,
    deleteFaculty,
    updateFaculty,
};