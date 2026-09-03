import mongoose, { Schema, model, models } from "mongoose";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        image: {
            type: String,
            required: false
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        verifyCode: {
            type: String,
            required: false
        },
        verifyCodeExpiry: {
            type: Date,
            required: false
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        isAcceptingMessage: {
            type: Boolean,
            default: false
        },
        createdAt: { type: Date },
        updatedAt: { type: Date },
        messages: [
            {
                content: {
                    type: String,
                    required: true
                },
                createdAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ],
    },
    {
        timestamps: true
    }
);

const UserModel = models.UserModel || model("UserModel", userSchema)

export default UserModel;