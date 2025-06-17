import { animate } from "motion/react";

function checkMessageStatus(selectedChat) {
    if(selectedChat) {
        const unreadMessage = selectedChat.messages.find((m) => {
            if(m.status === 'delivered' && m.from === selectedChat.address) {
                return m;
            }
        })
        return unreadMessage ? true : false;
    }
}

// Custom Hook
export function viewMessages(chatData, id, setSelectedChat, ws, setHidden) {
    if(window.innerWidth < 1024) {
        const sideChat = document.querySelector('.side-chats-left');
        animate(sideChat, { x: '-100%', pointerEvents: 'none' }, { duration: 0.3 });
        setHidden(() => false);
    }
    const selectedChat = chatData.find(c => c.address === id);
    selectedChat && setSelectedChat(selectedChat);
    const chatList = document.querySelector('.chat-lists');
    Array.from(chatList.children).forEach(c => {
        if (c.id !== id) {
            if(c.classList.contains('bg-very-light-gray')) {
                c.classList.remove('bg-very-light-gray');
                c.classList.remove('dark:bg-extremely-dark-gray');
            }
        } else {
            c.classList.add('bg-very-light-gray');
            c.classList.add('dark:bg-extremely-dark-gray');
        }
    })
    // Set message status to seen using ws;
    if(checkMessageStatus(selectedChat) && ws && ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify({
            updateStatus: true,
            recipient: id
        }))
    }
}

export function startChatViewMessage() {
    if(window.innerWidth < 1024) {
        const sideChat = document.querySelector('.side-chats-left');
        animate(sideChat, { x: '-100%', pointerEvents: 'none' }, { duration: 0.3 })
    }
}