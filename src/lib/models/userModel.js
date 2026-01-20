import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: false
        },
        image: {
            type: String,
            required: false
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        verifyCode: {
            type: String,
            required: true
        },
        verifyCodeExpiry: {
            type: Date,
            required: true
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


userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const UserModel = models.UserModel || model("UserModel", userSchema)

export default UserModel;