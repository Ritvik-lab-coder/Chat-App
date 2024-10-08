import { messageModel } from "../models/messageModel.js";

export const addMessage = async (request, response) => {
    try {
        const { from, to, message } = request.body;
        const newMessage = await messageModel.create({
            message: {
                text: message,
            },
            users: [from, to],
            sender: from
        });
        if (newMessage) {
            return response.status(200).json({
                success: true,
                message: "Message sent successfully",
            });
        }
        return response.status(400).json({
            success: false,
            message: "Failed to send message",
        });
    } catch (error) {
        return response.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

export const getAllMessages = async (request, response) => {
    try {
        const from = request.headers.from;
        const to = request.headers.to;
        const messages = await messageModel.find({
            users: {
                $all: [from, to],
            }
        }).sort({ updatedAt: 1 });
        const projectMessages = messages.map((message) => {
            return {
                fromSelf: message.sender.toString() === from,
                message: message.message.text,
            };
        });
        return response.status(200).json({
            success: true,
            messages: projectMessages
        });
    } catch (error) {
        return response.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}