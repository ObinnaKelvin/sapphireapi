import mongoose from "mongoose";

const { Schema, model } = mongoose;

const TariffSchema = new Schema ({

    tariffId: {
        type: Number
    },
    tariffName: {
        type: String
    },
    serviceId: {
        type: Number
    },
    payerId: {
        type: Number,
        default: null
    },
    cost: {
        type: Number
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
}, {timestamps: true})

export default model("Tariff", TariffSchema)