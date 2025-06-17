import { ChatData } from "../models/chatsModel.js";
import { User } from "../models/userModel.js";

export default async function startChat(req, res) {
    try {
        const { recipient } = req.body;

        // Basic address validation
        if(recipient.length !== 42 && recipient[0] !== '0' && recipient[1] !== 'x') {
            res.status(400).json({ success: false, errorMessage: `Invalid address` });
            return;
        }

        // Prevent self messaging
        if(recipient === req.session._address) {
            res.status(400).json({ success: false, errorMessage: `You can't message yourself`});
            return;
        }
    
        // Check if recipient is also a user;
        const recipientUserData = await User.findOne({ address: recipient });
    
        const userChatData = await ChatData.findOne({ owner: req.address });
    
        if(userChatData) {
            // Check if user already had a convo with recipient
            const { chats } = userChatData;
            const convo = chats.find((c) => c.address === recipient);
            if(!convo) {
                // No prior convo, update userChatData
                const chat = {
                    address: recipient,
                    avatar: recipientUserData ? recipientUserData.avatar : '',
                    online: recipientUserData ? recipientUserData.online : false,
                    lastLogin: recipientUserData ? recipientUserData.lastLogin : null,
                    messages: []
                }
                const updatedChatData = await ChatData.updateOne({ owner: req.address }, { chats: [...chats, chat] }, { new: true });
                res.status(200).json({ success: true, chat: chat })
            } else {
                // Send recipient chat if there is a convo
                res.status(200).json({ success: true, chat: convo });
            }
        } else {
            // save recipient as user's first chat
            const chat = {
                address: recipient,
                avatar: recipientUserData ? recipientUserData.avatar : '',
                online: recipientUserData ? recipientUserData.online : false,
                lastLogin: recipientUserData ? recipientUserData.lastLogin : null,
                messages: []
            }
            // Send chat to client
            res.status(200).json({ success: true, chat: chat });
        }
    } catch(e) {
        console.error(e);
        res.status(500).json({ success: false, errorMessage: 'An unexpected error occurred' });
    }
}