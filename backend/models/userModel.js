import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 20,
        unique: true
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
    isAvatarImageSet: {
        type: Boolean,
        default: false
    },
    avatarImage: {
        type: String,
        default: ''
    }
}, { timestamps: true });

export const userModel = mongoose.model('users', userSchema);