import { MdError } from "react-icons/md";
import { IconContext } from "react-icons/lib";
import { MessageSpinner } from "./spinner";
import formatDate from "../utils/formatDate";

export function SenderChatBubble({ message, paddingB, time, status, mediaType, mediaUrl }) {

    function setMessageStatus() {
        if (status === 'failed') {
            return <IconContext value={{ className: 'size-2 text-danger' }}>
                <MdError />
            </IconContext>
        } else if (status === 'delivered') {
            return 'delivered'
        } else if (status === 'seen') {
            return 'seen';
        } else {
            // Message is being validated by server
            return <MessageSpinner />
        }
    }

    function setMediaElement() {
        if (mediaUrl) {
            if (mediaType === 'image') {
                return <img className="w-full rounded-tl-xl rounded-tr-xl" src={mediaUrl} />
            } else {
                return <video controls className="w-full rounded-tl-xl rounded-tr-xl" src={mediaUrl} />
            }
        }
    }

    return (
        <div className={`flex justify-end`} style={{ paddingBottom: paddingB }} >
            <div className={`max-w-[75%] lg:max-w-[50%] ${!mediaUrl ? 'px-2 py-1 lg:px-4 lg:py-2' : ''} bg-secondary dark:bg-very-light-gray border border-secondary dark:border-primary text-primary dark:text-secondary rounded-tl-xl rounded-tr-xl rounded-bl-xl`} style={{ wordWrap: 'break-word' }}>
                {setMediaElement()}
                <div className={`${mediaUrl ? 'px-2 py-1 lg:px-4 lg:py-2' : ''}`}>
                    <div className="text-sm lg:text-md">{message}</div>
                    <div className="flex items-center justify-end text-[0.6rem] pl-4 lg:text-[0.7rem] text-end font-extralight text-gray-300 dark:text-gray-900"><span>{time}</span> <span className="pl-[0.25rem]">{setMessageStatus()}</span></div>
                </div>
            </div>
        </div>
    )
}

export function ReceiverChatBubble({ message, paddingB, time, mediaUrl, mediaType }) {
    function setMediaElement() {
        if (mediaUrl) {
            if (mediaType === 'image') {
                return <img className="w-full rounded-tl-xl rounded-tr-xl" src={mediaUrl} />
            } else {
                return <video controls className="w-full rounded-tl-xl rounded-tr-xl" src={mediaUrl} />
            }
        }
    }

    return (
        <div className={`flex justify-start`} style={{ paddingBottom: paddingB }} >
            <div className={`max-w-[75%] lg:max-w-[50%] ${!mediaUrl ? 'px-2 py-1 lg:px-4 lg:py-2' : ''} bg-secondary dark:bg-very-light-gray border border-secondary dark:border-primary text-primary dark:text-secondary rounded-tl-xl rounded-tr-xl rounded-br-xl`} style={{ wordWrap: 'break-word' }}>
                {setMediaElement()}
                <div className={`${mediaUrl ? 'px-2 py-1 lg:px-4 lg:py-2' : ''}`}>
                    <div className="text-sm lg:text-md">{message}</div>
                    <div className="text-[0.6rem] pl-4 lg:text-[0.7rem] text-end font-extralight text-gray-300 dark:text-gray-900">{time}</div>
                </div>
            </div>
        </div>
    )
}

export function ChatDate({ date }) {
    return (
        <div className="py-4 font-semibold text-sm text-center text-secondary dark:text-primary">{formatDate(date)}</div>
    )
}

export function StartChatDate({ date }) {
    return (
        <div className="py-4 font-semibold text-sm text-center text-secondary dark:text-primary">{date}</div>
    )
}