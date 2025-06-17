// These functions saves a message to db for both sender and recipient

import { ChatData } from "../models/chatsModel.js";
import { User } from "../models/userModel.js";
import { encrypt } from "../utils/crypto.js";

export async function saveMessageForSender(message, sender, recipient) {
    const senderChatData = await ChatData.findOne({ owner: message.from });
    const recipientUserData = await User.findOne({ addres: message.to });
    const encryptedData = encrypt(message.text);
    const messageObj = {
        from: message.from,
        to: message.to,
        encryptedMessage: encryptedData.encryptedMessage,
        iv: encryptedData.iv,
        time: message.time,
        file: message.file,
        mediaType: message.mediaType,
        messageId: message.messageId,
        status: 'delivered'
    }
    if (senderChatData) {
        const chats = senderChatData.chats ? senderChatData.chats : [];
        let selectedChat = chats.find(c => c.address === message.to);
        if (selectedChat) {
            selectedChat.messages.length > 0 ? selectedChat.messages = [...selectedChat.messages, messageObj] : selectedChat.messages = [messageObj]
        } else {
            selectedChat = {
                address: message.to,
                avatar: recipientUserData ? recipientUserData.avatar : '', // Recipient avatar
                online: recipient ? true : false, // Checks if recipient is online
                lastLogin: recipientUserData ? recipient.lastLogin : null, // Recipient lastLogin
                messages: [messageObj]
            }
        }
        // Remove stale selectedChat from chats array and replace with updated selectedChat
        const updatedChats = senderChatData.chats.filter(c => c.address !== message.to);
        updatedChats.push(selectedChat);
        console.log('Saving message for sender if senderChatData exists');
        return ChatData.findOneAndUpdate({ owner: message.from }, { chats: updatedChats }, { new: true })
    } else {
        console.log('No senderChatData, creating chatData and saving the message')
        return new ChatData({
            owner: message.from,
            chats: [
                {
                    address: message.to,
                    avatar: message.avatar,
                    online: recipient ? true : false,
                    lastLogin: message.lastLogin,
                    messages: [messageObj]
                }
            ]
        }).save()
    }
}

export async function saveMessageForRecipient(message, sender, recipient) {
    const recipientChatData = await ChatData.findOne({ owner: message.to });
    const encryptedData = encrypt(message.text);
    const senderUserData = await User.findOne({ address: message.from })
    const messageObj = {
        from: message.from,
        to: message.to,
        encryptedMessage: encryptedData.encryptedMessage,
        iv: encryptedData.iv,
        time: message.time,
        file: message.file,
        mediaType: message.mediaType,
        messageId: message.messageId,
        status: 'delivered'
    }
    if (recipientChatData) {
        const chats = recipientChatData.chats ? recipientChatData.chats : [];
        let selectedChat = chats.find(c => c.address === message.from);
        if (selectedChat) {
            selectedChat.messages.length > 0 ? selectedChat.messages = [...selectedChat.messages, messageObj] : selectedChat.messages = [messageObj]
        } else {
            selectedChat = {
                address: message.from,
                avatar: senderUserData ? senderUserData.avatar : '', // Avatar of sender
                online: sender ? true : false, // Checks if sender is online
                lastLogin: senderUserData ? senderUserData.lastLogin : null, // Last Login of sender
                messages: [messageObj]
            }
        }
        // Remove stale selectedChat from chats array and replace with updated selectedChat
        const updatedChats = chats.filter(c =>  c.address !== message.from);
        updatedChats.push(selectedChat);
        console.log('Recipient has chat data. saving message for recipient');
        return ChatData.findOneAndUpdate({ owner: message.to }, { chats: updatedChats }, { new: true })
    } else {
        console.log('Saving chat data for recipient')
        return new ChatData({
            owner: message.to,
            chats: [
                {
                    address: message.from,
                    avatar: message.avatar,
                    online: sender ? true : false,
                    lastLogin: message.lastLogin,
                    messages: [messageObj]
                }
            ]
        }).save()
    }
}