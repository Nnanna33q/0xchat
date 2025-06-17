import ChatHeader from "./chatHeader"
import { ChatDate, ReceiverChatBubble, SenderChatBubble, StartChatDate } from "./chatBubble";
import MessageInput from "./messageInput";
import { useState, useLayoutEffect, useRef, useContext, useEffect } from "react";
import { SelectedChatContext } from "../contexts/selectedChatContext";
import { formatTime } from "../utils/formatDate";

export default function SideChatRight({ setIsRequestModal, setIsCryptoRequestsModal }) {
    const { selectedChat } = useContext(SelectedChatContext);
    const [chatBodyHeight, setChatBodyHeight] = useState(0);
    const messagesRef = useRef(null);

    useEffect(() => {
        // Scrolls to last message each time selectedChat changes
        const lastMessage = messagesRef.current.children[messagesRef.current.children.length - 1];
        lastMessage && lastMessage.scrollIntoView();
    }, [selectedChat.messages]);

    useLayoutEffect(() => {
        const chatHeaderHeight = document.querySelector('.chat-header').clientHeight;
        const messageInputHeight = document.querySelector('.message-input').clientHeight;
        const parentHeight = (document.querySelector('.parentElem').clientHeight) - (window.innerWidth >= 1024 ? 32 : 0);
        setChatBodyHeight(parentHeight - (chatHeaderHeight + messageInputHeight));
    }, [])

    useLayoutEffect(() => {
        const chatHeaderHeight = document.querySelector('.chat-header').clientHeight;
        const messageInputHeight = document.querySelector('.message-input').clientHeight;
        const parentHeight = (document.querySelector('.parentElem').clientHeight) - (window.innerWidth >= 1024 ? 32 : 0);
        setChatBodyHeight(parentHeight - (chatHeaderHeight + messageInputHeight));
    }, [])

    function displayDate(message, previousMessage) {
        if(previousMessage && new Date(message.time).getDate() !== new Date(previousMessage.time).getDate()) {
            return true;
        } else {
            return false;
        }
    }

    function displayStartDate(messages) {
        if(messages && messages.length > 0) {
            const today = new Date();
            const date = new Date(messages[0].time);
            if(date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()) {
                return 'Today';
            } else if((today.getDay() - date.getDay() === 1) && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()) {
                return 'Yesterday';
            } else {
                return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
            }
        }
    }

    function displayMessages(messages) {
        if(messages && messages.length > 0) {
            return messages.map((m, i) => {
                if(m.from !== selectedChat.address) {
                    if(messages[i + 1] && messages[i + 1].from === m.from) {
                        return displayDate(m, messages[i - 1]) ? 
                        <div>
                            <ChatDate date={new Date(m.time)} />
                            <SenderChatBubble message={m.text} paddingB={'0.25rem'} time={formatTime(new Date(m.time))} status={m.status} mediaUrl={m.file} mediaType={m.mediaType} />
                        </div> :
                        <SenderChatBubble message={m.text} paddingB={'0.25rem'} time={formatTime(new Date(m.time))} status={m.status} mediaUrl={m.file} mediaType={m.mediaType} />
                    } else {
                        return displayDate(m, messages[i - 1]) ?
                        <div>
                            <ChatDate date={new Date(m.time)} />
                            <SenderChatBubble message={m.text} paddingB={'1rem'} time={formatTime(new Date(m.time))} status={m.status} mediaUrl={m.file} mediaType={m.mediaType} />
                        </div> :
                        <SenderChatBubble message={m.text} paddingB={'1rem'} time={formatTime(new Date(m.time))} status={m.status} mediaUrl={m.file} mediaType={m.mediaType} />
                    }
                } else {
                    if(messages[i + 1] && messages[i + 1].to === m.to) {
                        return displayDate(m, messages[i - 1]) ? 
                        <div>
                            <ChatDate date={new Date(m.time)} />
                            <ReceiverChatBubble message={m.text} paddingB={'0.25rem'} time={formatTime(new Date(m.time))} mediaUrl={m.file} mediaType={m.mediaType} />
                        </div> :
                        <ReceiverChatBubble message={m.text} paddingB={'0.25rem'} time={formatTime(new Date(m.time))} mediaUrl={m.file} mediaType={m.mediaType} />
                    } else {
                        return displayDate(m, messages[i - 1]) ? 
                        <div>
                            <ChatDate date={new Date(m.time)} />
                            <ReceiverChatBubble message={m.text} paddingB={'1rem'} time={formatTime(new Date(m.time))} mediaUrl={m.file} mediaType={m.mediaType} />
                        </div> :
                        <ReceiverChatBubble message={m.text} paddingB={'1rem'} time={formatTime(new Date(m.time))} mediaUrl={m.file} mediaType={m.mediaType} />
                    }
                }
            })
        }
    }

    return (
        <div className="chat-message bg-primary dark:bg-secondary lg:block w-[100%] lg:w-[60%] lg:border lg:border-light-gray dark:lg:border-dark-gray">
            <ChatHeader setIsRequestModal={setIsRequestModal} setIsCryptoRequestsModal={setIsCryptoRequestsModal} />
            <div style={{ height: `${chatBodyHeight}px`, overflow: 'auto', scrollbarWidth: 'none' }}>
                <div className="messages-container px-4 py-2">
                    <div className="text-center text-medium-gray">{selectedChat ? 'No more messages to load' : '' }</div>
                </div>
                <div ref={messagesRef} className="px-4 py-2" style={{ scrollbarWidth: 'none' }}>
                    { selectedChat && <StartChatDate date={displayStartDate(selectedChat.messages)} /> }
                    { selectedChat && displayMessages(selectedChat.messages)}
                </div>
            </div>
            <MessageInput />
        </div>
    )
}