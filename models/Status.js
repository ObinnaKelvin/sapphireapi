import mongoose from "mongoose";

const { Schema, model } = mongoose;


const StatusSchema = new Schema ({
    statusId: {
        type: Number
    },
    statusName: {
        type: String,
        required: "Please enter name"
    },
    description: {
        type: String,
        required: "Please enter description"
    },
    category: {
        type: String,
        required: "Please enter category"
    },
    color: {
        type: String,
    },
    backgroundColor: {
        type: String,
    },
    active: {
        type: Number,
        default: 1
    },
}, {timestamps: true})

export default model("Status", StatusSchema)