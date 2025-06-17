import mongoose from "mongoose";

// messages in chat
const messageSchema = mongoose.Schema({
    from: String,
    to: String,
    encryptedMessage: String,
    iv: String,
    time: Date,
    file: String,
    mediaType: String,
    messageId: String,
    status: String
})

// schema of people user has chatted with
const chatSchema = mongoose.Schema({
    address: String,
    avatar: String,
    online: Boolean,
    lastLogin: Date,
    messages: [
        messageSchema
    ]
})

// User's chats
const chatDataSchema = mongoose.Schema({
    owner: {
        type: String,
        unique: true
    },
    chats: [chatSchema]
})

export const ChatData = mongoose.model('ChatData', chatDataSchema);

export const Message = mongoose.model('Message', messageSchema);