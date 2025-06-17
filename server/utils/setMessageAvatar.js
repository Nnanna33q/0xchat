import { ChatData } from "../models/chatsModel.js";

// Sets message avatar for user's chat buddies
export async function setMessageAvatar(ownerAddress, url) {
    const userChatData = await ChatData.findOne({ owner: ownerAddress });
    const chatDatapromiseArray = userChatData.chats.map(c => {
        return ChatData.findOne({ owner: c.address});
    })
    const chatDatas = await Promise.all(chatDatapromiseArray);
    const updatedChatDatas = chatDatas.map(c => {
        c.chats.forEach(c => {
            if(c.address === ownerAddress) {
                c.avatar = url;
            }
        })
        return c;
    })
    const resultsProm = updatedChatDatas.map(u => {
        return ChatData.findOneAndUpdate({ owner: u.owner }, { chats: u.chats }, { new: true });
    })

    const results = await Promise.all(resultsProm);
    return results;
}