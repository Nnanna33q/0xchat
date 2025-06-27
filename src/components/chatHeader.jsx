import { IconContext } from "react-icons/lib";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaUser } from "react-icons/fa6";
import { ChatHeaderTooltip } from "./tooltip";
import { useEffect, useState, useContext } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { animate } from 'motion/react';
import { SelectedChatContext } from "../contexts/selectedChatContext";
import { truncateAddress } from "../utils/truncate";
import { HiddenContext } from "../contexts/hiddenContext";
import formatDate from "../utils/formatDate";
import { formatTime } from "../utils/formatDate";

export default function ChatHeader({ setIsRequestModal, setIsCryptoRequestsModal }) {
    const { selectedChat } = useContext(SelectedChatContext);
    const [tooltip, setTooltip] = useState(false);
    const { setHidden } = useContext(HiddenContext);

    function viewChats() {
        const sideChat = document.querySelector('.side-chats-left');
        animate(sideChat, { x: 0, pointerEvents: 'all' }, { duration: 0.3 })
        setHidden(() => true);
    }

    useEffect(() => {
        async function clearTooltip(e) {
            const tooltip = document.querySelector('.tooltip-chat-header');
            const dots = document.querySelector('.options-dots-2');

            async function animateExitTooltip() {
                if (tooltip) {
                    const originalHeight = tooltip.clientHeight;
                    await animate(tooltip, { height: [`${originalHeight}px`, 0], visibility: 'hidden', paddingTop: 0, paddingBottom: 0 }, { duration: 0.2 })
                }
            }

            if (e.target === dots || e.target === tooltip) {
                setTooltip(true);
            } else {
                await animateExitTooltip();
                setTooltip(false);
            }
        }

        document.body.addEventListener('click', clearTooltip)
        return () => document.body.removeEventListener('click', clearTooltip);
    }, [])

    return (
        <>
            <div className={`chat-header p-4 border-b border-light-gray dark:border-dark-gray sticky top-0 left-0`}>
                <div className="flex justify-between lg:block items-center">
                    <div className="block lg:hidden pr-4" onClick={viewChats}>
                        <IconContext value={{ className: "size-6 text-secondary dark:text-primary" }}>
                            <IoArrowBackCircleOutline />
                        </IconContext>
                    </div>
                    <div className="flex items-start justify-between w-full">
                        <div className="flex items-center">
                            <div className="avatar">
                                {selectedChat.avatar ? <img className="size-8 rounded-full" src={selectedChat.avatar} alt="avatar" /> :
                                    <IconContext value={{ className: 'size-8 rounded-full dark:text-primary text-secondary' }}>
                                        <FaUser />
                                    </IconContext>}
                            </div>
                            <div className="pl-2">
                                <div className="address font-semibold text-sm text-secondary dark:text-primary">{selectedChat.address ? truncateAddress(selectedChat.address) : '0x0000...0000000' }</div>
                                <div className={`status text-xs ${selectedChat.online ? 'text-success' : 'text-medium-gray' }`}>{selectedChat.online ? 'online' : `${selectedChat.lastLogin ? `Last seen ${formatDate(new Date(selectedChat.lastLogin))} at ${formatTime(new Date(selectedChat.lastLogin))}` : ''}` }</div>
                            </div>
                        </div>
                        <div>
                            <IconContext value={{ className: 'text-secondary dark:text-primary options-dots-2 ring ring-extremely-light-gray dark:ring-extremely-dark-gray p-2 bg-extremely-light-gray dark:bg-extremely-dark-gray size-8 rounded-full' }}>
                                <BsThreeDotsVertical />
                            </IconContext>
                        </div>
                    </div>
                </div>
            </div>
            {tooltip && <ChatHeaderTooltip setIsRequestModal={setIsRequestModal} setICryptoRequestsModal={setIsCryptoRequestsModal} />}
        </>
    )
}