// Counts and return unread messages

export default function countUnread(chat) {
    const unreadMessages = chat.messages.filter(m => (m.status === 'delivered' && chat.address === m.from ));
    return unreadMessages.length <= 0 ? 'seen' : unreadMessages.length;
} 