"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Faculty = void 0;
const mongoose_1 = require("mongoose");
const common_1 = require("../../../constants/common");
const FacultySchema = new mongoose_1.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: {
            firstName: {
                type: String,
                required: true,
            },
            lastName: {
                type: String,
                required: true,
            },
            middleName: {
                type: String,
                required: false,
            },
        },
        required: true,
    },
    dateOfBirth: {
        type: String,
    },
    gender: {
        type: String,
        enum: common_1.gender,
    },
    bloodGroup: {
        type: String,
        enum: common_1.bloodGroup,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    contactNo: {
        type: String,
        unique: true,
        required: true,
    },
    emergencyContactNo: {
        type: String,
        required: true,
    },
    presentAddress: {
        type: String,
        required: true,
    },
    permanentAddress: {
        type: String,
        required: true,
    },
    academicDepartment: {
        type: mongoose_1.Types.ObjectId,
        ref: 'AcademicDepartment',
        required: true,
    },
    designation: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String,
    },
    academicFaculty: {
        type: mongoose_1.Types.ObjectId,
        ref: 'AcademicFaculty',
        required: true,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.Faculty = (0, mongoose_1.model)('Faculty', FacultySchema);
