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
exports.ManagementDepartmentServices = void 0;
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const managementDepartment_constants_1 = require("./managementDepartment.constants");
const managementDepartment_model_1 = require("./managementDepartment.model");
const createManagementDepartment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield managementDepartment_model_1.ManagementDepartment.create(payload);
    return result;
});
const getAllManagementDepartments = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerms } = filters, filterableData = __rest(filters, ["searchTerms"]);
    const andConditons = [];
    if (searchTerms) {
        andConditons.push({
            $or: managementDepartment_constants_1.managementDepartmentsSearchableFields.map(field => ({
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
    const result = yield managementDepartment_model_1.ManagementDepartment.find(whereCondition)
        .sort(sortCondition)
        .skip(skip)
        .limit(limit);
    const total = yield managementDepartment_model_1.ManagementDepartment.countDocuments();
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getSinglelManagementDepartment = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield managementDepartment_model_1.ManagementDepartment.findById(id);
    return {
        data: result,
    };
});
const updateManagementDepartment = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield managementDepartment_model_1.ManagementDepartment.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });
    return {
        data: result,
    };
});
exports.ManagementDepartmentServices = {
    createManagementDepartment,
    getAllManagementDepartments,
    getSinglelManagementDepartment,
    updateManagementDepartment,
};
