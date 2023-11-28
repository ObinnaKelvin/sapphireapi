import mongoose from "mongoose";

const { Schema, model } = mongoose;

const PayerSchema = new Schema ({
    payerId: {
        type: Number
    },
    payerName: {
        type: String
    },
    payerCategoryId: {
        type: Number
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

export default model("Payer", PayerSchema)