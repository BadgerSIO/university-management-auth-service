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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicFacultyServices = void 0;
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const academicFaculty_model_1 = require("./academicFaculty.model");
const createAcademicFaculty = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield academicFaculty_model_1.AcademicFaculty.create(payload);
    return result;
});
const getAllFaculty = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerms } = filters, filterableData = __rest(filters, ["searchTerms"]);
    const academicFacultySearchableFields = ['title'];
    const andConditons = [];
    if (searchTerms) {
        andConditons.push({
            $or: academicFacultySearchableFields.map(field => ({
                [field]: {
                    $regex: searchTerms,
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
    const result = yield academicFaculty_model_1.AcademicFaculty.find(whereCondition)
        .sort(sortCondition)
        .skip(skip)
        .limit(limit);
    const total = yield academicFaculty_model_1.AcademicFaculty.countDocuments();
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getFacultyById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield academicFaculty_model_1.AcademicFaculty.findById(id);
    return {
        data: result,
    };
});
const updateFacutly = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield academicFaculty_model_1.AcademicFaculty.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });
    return {
        data: result,
    };
});
const deleteFaculty = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield academicFaculty_model_1.AcademicFaculty.findByIdAndDelete(id);
    return {
        data: result,
    };
});
exports.AcademicFacultyServices = {
    createAcademicFaculty,
    getAllFaculty,
    getFacultyById,
    updateFacutly,
    deleteFaculty,
};
