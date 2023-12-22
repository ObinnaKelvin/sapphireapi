import mongoose from "mongoose";

const { Schema, model } = mongoose;


const PayerCategorySchema = new Schema ({
    payerCategoryId: {
        type: Number
    },
    payerCategoryName: {
        type: String,
        required: "Please enter name"
    },
    active: {
        type: Number,
        default: 1
    },
}, {timestamps: true})

export default model("PayerCategory", PayerCategorySchema)