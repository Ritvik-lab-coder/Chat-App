import { userModel } from "../models/userModel.js"
import bcrypt from 'bcryptjs'
import { request } from "express";
import jwt from 'jsonwebtoken'

export const register = async (request, response) => {
    try {
        const { username, email, password } = request.body;
        let user = await userModel.findOne({ username });
        if (user) {
            return response.status(400).json({
                success: false,
                message: "Username already exists"
            });
        }
        user = await userModel.findOne({ email });
        if (user) {
            return response.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        user = await userModel.create({
            username,
            email,
            password: hashedPassword
        });
        delete user.password;
        return response.status(200).json({
            success: true,
            message: "User created successfully",
            user
        });
    } catch (error) {
        return response.status(500).json({
            success: false,
            message: 'Error registering user',
        });
    }
};

export const login = async (request, response) => {
    try {
        const { email, password } = request.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return response.status(400).json({
                success: false,
                message: "Email not found"
            });
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return response.status(400).json({
                success: false,
                message: "Invalid password"
            });
        }
        delete user.password;
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        return response.cookie('token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        }).status(200).json({
            success: true,
            message: "User logged in successfully",
            user,
            token
        });
    } catch (error) {
        return response.status(500).json({
            success: false,
            message: 'Error registering user',
        });
    }
};

export const logout = async (request, response) => {
    try {
        response.cookie('token', '', {
            httpOnly: true,
            maxAge: 0,
        });
        return response.status(200).json({
            success: true,
            message: "User logged out successfully",
        });
    } catch (error) {
        return response.status(500).json({
            success: false,
            message: 'Error registering user',
        });
    }
}

export const setAvatar = async (request, response) => {
    try {
        const { image } = request.body;
        const id = request.params.id;
        const user = await userModel.findByIdAndUpdate(id, {
            avatarImage: image,
            isAvatarImageSet: true
        }, { new: true });
        return response.status(201).json({
            success: true,
            message: "Avatar updated successfully",
            user
        });
    } catch (error) {
        return response.status(500).json({
            success: false,
            message: 'Error registering user',
        });
    }
}

export const getAllUsers = async (request, response) => {
    try {
        const users = await userModel.find({ _id: { $ne: request.params.id } }).select(["email", "username", "avatarImage", "_id"]);
        if (!users) {
            return response.status(404).json({
                success: false,
                message: "No users found"
            });
        }
        return response.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            users
        });
    } catch (error) {
        return response.status(500).json({
            success: false,
            message: 'Error registering user',
        });
    }
}