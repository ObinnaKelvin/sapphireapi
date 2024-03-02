import mongoose from "mongoose";

const { Schema, model } = mongoose;

const NotificationsByUserSchema = new Schema ({

    notificationByUserId: {
        type: Number
    },
    notificationId: {
        type: Number
    },
    userId: {
        type: String
    },
    status: {
        type: String,
        default: "unread",
        required: true
    },
    priority: {
        type: String,
        default: null,
    },
    encodedDate: {
        type: Date,
        required: true
    },
    lastUpdatedDate: {
        type: Date,
        //required: true
    }
}, {timestamps: true})

export default model("NotificationsByUser", NotificationsByUserSchema)