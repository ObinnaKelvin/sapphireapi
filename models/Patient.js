import mongoose from "mongoose";

const { Schema, model } = mongoose;

const PatientSchema = new Schema ({
    // patientId: {
    //     type: Number
    // },
    // patientNo: {
    //     type: Number
    // },
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
    age: {
        type: Number,
        default: 20
    },
    maritalStatus: {
        type: String,
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
        default: 1,
        required: true
    },
    active: {
        type: Number,
        default: 1,
    },
    encodedBy: {
        type: Number,
    },
    encodedDate: {
        type: Date,
    },
    lastUpdatedBy: {
        type: Number,
    },
    lastUpdatedDate: {
        type: Date,
    }
}, {timestamps: true})

export default model("Patient", PatientSchema)