import mongoose from "mongoose";

const { Schema, model } = mongoose;

const AppointmentSchema = new Schema ({
    appointmentId: {
        type: Number
    },
    patientId: {
        type: Number
    },
    patientNo: {
        type: Number
    },
    staffId: {
        type: Number,
        default: null
    },
    visitId: {
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
    dateOfBirth: {
        type: Date,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
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
    referralTypeId: {
        type: Number,
        default: null
    },
    referToDoctor: {
        type: Number,
        default: null
    },
    authorizationNo: {
        type: Number,
        default: null
    },
    appointmentStatus: {
        type: Number,
        default: 9
    },
    paymentStatus: {
        type: Number,
        default: 2
    },
    active: {
        type: Number,
        default: 1
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
    },
    cancelReason: {
        type: String
    },
    invoiceId: {
        type: Number,
        default: null
    },
    payerId: {
        type: Number,
        required: true
    },
    payerCategoryId: {
        type: Number,
        required: true
    },
    checkInBy: {
        type: Number,
    },
    checkInDate: {
        type: Date,
    },
}, {timestamps: true})

export default model("Appointment", AppointmentSchema)