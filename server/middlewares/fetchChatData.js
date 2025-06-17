import { ChatData } from "../models/chatsModel.js";
import { User } from "../models/userModel.js";
import {decrypt } from "../utils/crypto.js";

export default async function fetchChatData(req, res) {
    try {
        const chatData = await ChatData.findOne({ owner: req.address });
        const chats = chatData ? chatData.chats : [];
        const decryptedChats = chats.map(c => {
            const messages = [];
            for(let i = 0; i < c.messages.length; i++) {
                const message = {
                    from: c.messages[i].from,
                    to: c.messages[i].to,
                    text: decrypt(c.messages[i].encryptedMessage, c.messages[i].iv),
                    time: c.messages[i].time,
                    file: c.messages[i].file,
                    status: c.messages[i].status,
                    mediaType: c.messages[i].mediaType
                }
                messages.push(message);
            }
            return { 
                address: c.address,
                avatar: c.avatar,
                online: c.online,
                lastLogin: c.lastLogin,
                messages: messages
            }
        })
        res.status(200).json({ success: true, data: decryptedChats, owner: req.address });
    } catch (e) {
        console.log('Error occurred in fetchChatData');
        console.error(e);
        res.status(500).json({ success: false, errorMessage: 'Failed to fetch chat. Try again later' });
    }
}

export async function fetchAvatar(req, res) {
    try {
        const user = await User.findOne({ address: req.session._address });
        res.status(200).json({ success: true, url: user.avatar });
    } catch (e) {
        console.log('Error occurred while fetching avatar');
        console.error(e);
        res.status(500).json({ success: false, errorMessage: 'Failed to fetch chat. Try again later' });
    }
}