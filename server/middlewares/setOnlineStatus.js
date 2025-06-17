import { ChatData } from "../models/chatsModel.js";

export async function setOnlineStatusToFalse(req, res) {
    try {
        const { address, lastLogin } = req.body;
        if (address.length !== 42 || address[0] !== '0' || address[1] !== 'x') {
            res.status(400).json({ success: false, errorMessage: 'Failed to set online status' });
            return;
        }
        const userChatData = await ChatData.findOne({ owner: req.session._address });
        if (!userChatData) {
            throw 'No user chat data';
        }
        const updatedChats = userChatData.chats.map(c => {
            if (c.address === address) {
                c.online = false;
                c.lastLogin = lastLogin
            }
            return c;
        })
        await ChatData.updateOne({ owner: req.session._address }, { chats: updatedChats });
        res.status(201).json({ success: true });
    } catch (e) {
        console.error(e);
        typeof e === 'string' ? res.status(400).json({ success: false, errorMessage: e }) : res.status(500).json({ success: false, errorMessage: 'An unexpected error occurred' });
    }
}

export async function setOnlineStatusToTrue(req, res) {
    try {
        const { address } = req.body;
        if (address.length !== 42 || address[0] !== '0' || address[1] !== 'x') {
            res.status(400).json({ success: false, errorMessage: 'Failed to set online status' });
            return;
        }
        const userChatData = await ChatData.findOne({ owner: req.session._address });
        if (!userChatData) {
            throw 'No user chat data';
        }
        const updatedChats = userChatData.chats.map(c => {
            if (c.address === address) {
                c.online = true;
            }
            return c;
        })
        await ChatData.updateOne({ owner: req.session._address }, { chats: updatedChats });
        res.status(201).json({ success: true });
    } catch (e) {
        console.error(e);
        typeof e === 'string' ? res.status(400).json({ success: false, errorMessage: e }) : res.status(500).json({ success: false, errorMessage: 'An unexpected error occurred' });
    }
}