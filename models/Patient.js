import mongoose from "mongoose";

const { Schema, model } = mongoose;

const PatientSchema = new Schema ({
    patientId: {
        type: Number
    },
    patientNo: {
        type: Number
    },
    firstName: {
        type: String,
        required: true
    },
    middleName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    maritalStatus: {
        type: Number,
        required: true
    },
    address: {
        type: String,
    },
    state: {
        type: String,
    },
    country: {
        type: String,
    },
    kinName: {
        type: String,
    },
    kinPhone: {
        type: String,
    },
    kinRelationship: {
        type: String,
    },
    kinAddress: {
        type: String,
    },
    payerId: {
        type: Number,
        required: true
    },
    active: {
        type: Number
    },
    encodedBy: {
        type: Number,
        required: true
    },
    encodedDate: {
        type: Date,
        required: true
    },
    lastUpdatedBy: {
        type: Number,
        required: true
    },
    lastUpdatedDate: {
        type: Date,
        required: true
    }
}, {timestamps: true})

export default model("Patient", PatientSchema)