import { ChatData } from "../models/chatsModel.js";

export async function setMessageStatusForSender(sender, recipient) {
    const senderChatData = await ChatData.findOne({ owner: sender });
    const chats = senderChatData.chats.map(c => {
        if(c.address === recipient) {
            c.messages.forEach(m => m.status = 'seen');
        }
        return c;
    })
    return ChatData.updateOne({ owner: sender }, { chats: chats })
}

export async function setMessageStatusForRecipient(sender, recipient) {
    const receiverChatData = await ChatData.findOne({ owner: recipient });
    const chats = receiverChatData.chats.map(c => {
        if(c.address === sender) {
            c.messages.forEach(m => m.status = 'seen');
        }
        return c;
    })
    return ChatData.updateOne({ owner: recipient }, { chats: chats })
}