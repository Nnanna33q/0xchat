import { FaUser } from "react-icons/fa6";
import { IconContext } from "react-icons/lib";
import { viewMessages } from "../utils/viewMessages";
import countUnread from "../utils/countUnread";
import { ChatDataContext } from "../contexts/chatDataContext";
import { SelectedChatContext } from "../contexts/selectedChatContext";
import { WsContext } from "../contexts/wsContext";
import { useContext } from "react";
import { HiddenContext } from "../contexts/hiddenContext";

export function Chat({ avatar, address, lastMsg, time, chat, id, latest }) {
    const { chatData } = useContext(ChatDataContext);
    const { setSelectedChat } = useContext(SelectedChatContext);
    const { ws } = useContext(WsContext);
    const { setHidden } = useContext(HiddenContext);

    function notif() {
        const lastMessage = chat.messages[chat.messages.length - 1];
        if(lastMessage) {
            if(lastMessage.from === chat.address) {
                const count = countUnread(chat);
                return count === 'seen' ? <div className="new-message-status text-muted text-medium-gray font-light text-secondary dark:text-primary text-xs"></div> : <div className="flex justify-end"><div className="new-message-length text-success size-4 text-xs flex items-center justify-center bg-success-light dark:bg-success-dark rounded-full">{count}</div></div>
            } else {
                return <div className="new-message-status text-muted text-medium-gray font-light text-secondary dark:text-primary text-xs">{lastMessage.status}</div>
            }
        } else {
            return <div className="new-message-status text-muted text-medium-gray font-light text-secondary dark:text-primary text-xs"></div>
        }
    }

    return (
        <div className={`p-4 ${latest ? 'bg-very-light-gray dark:bg-extremely-dark-gray' : ''}`} onClick={() => viewMessages(chatData, id, setSelectedChat, ws, setHidden)} id={id}>
            <div className="flex items-start justify-between">
                <div className="flex items-center">
                    <div className="avatar">
                        {avatar ? <img className="size-10 rounded-full" src={avatar} alt="avatar" /> : <IconContext value={{ className: 'size-10 rounded-full dark:text-primary text-secondary'}}><FaUser /></IconContext>}
                    </div>
                    <div className="pl-2">
                        <div className="address font-semibold text-sm  text-secondary dark:text-primary">{address}</div>
                        <div className="latest-message text-xs text-dark-gray dark:text-light-gray">{lastMsg}</div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="delivery-time text-muted text-medium-gray font-light text-sm">{time}</div>
                    <div className="">
                        {notif()}
                    </div>
                </div>
            </div>
        </div>
    )
}