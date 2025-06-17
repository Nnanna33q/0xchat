import { SunChat } from "../assets/svgs/sun"
import { MoonChat } from "../assets/svgs/moon"
import { GoPlus } from "react-icons/go";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IconContext } from "react-icons/lib";
import { CiSearch } from "react-icons/ci";
import { Chat } from "../components/chat";
import { Tooltip } from "../components/tooltip";
import { useContext, useState, useLayoutEffect, useEffect } from "react";
import { ThemeContext } from "../contexts/themeContext";
import { animate } from "motion/react";
import StartChat from "./startChat";
import { truncateAddress, truncateMessage } from "../utils/truncate";
import { ChatDataContext } from "../contexts/chatDataContext";
import { FaCamera } from "react-icons/fa";
import { formatTime } from "../utils/formatDate";

export default function SideChatLeft({ setIsModal, setIsProfileModal }) {
    const { chatData, owner } = useContext(ChatDataContext);
    const { isDark, setIsDark } = useContext(ThemeContext);
    const [chatsHeight, setChatsHeight] = useState(0);
    const [tooltip, setTooltip] = useState(false);
    const [filteredChatData, setFilteredChatData] = useState([]);

    useLayoutEffect(() => {
        // Sets chat height
        const chatSideLeft = document.querySelector('.side-chats-left');
        const searchContainer = document.querySelector('.search-container');
        const mobileHeight = document.body.clientHeight - chatSideLeft.clientHeight;
        const desktopHeight = window.innerHeight - searchContainer.getBoundingClientRect().bottom;
        setChatsHeight(window.innerWidth >= 1024 ? desktopHeight : mobileHeight);
    }, [])

    useEffect(() => {
        // Animates tooltip before removing from dom
        async function clearTooltip(e) {
            const dots = document.querySelector('.options-dots');
            const tooltip = document.querySelector('.tooltip');
            if (e.target === tooltip || e.target === dots || e.target === dots.children[0]) {
                return;
            }

            async function animateExitTooltip() {
                if (tooltip) {
                    const originalHeight = tooltip.clientHeight;
                    await animate(tooltip, { height: [`${originalHeight}px`, 0], visibility: 'hidden', paddingTop: 0, paddingBottom: 0 }, { duration: 0.2 })
                }
            }

            await animateExitTooltip();
            setTooltip(false);
        }

        document.body.addEventListener('click', clearTooltip);

        return () => document.body.removeEventListener('click', clearTooltip);
    }, [])

    async function toggleDarkMode(e) {
        // Toggles dark mode (onClick)
        const dark = localStorage.getItem('dark');
        if (dark) {
            localStorage.setItem('dark', '');
            setIsDark(false);
        } else {
            localStorage.setItem('dark', 'true');
            setIsDark(true);
        }
    }

    function search(e) {
        const subString = e.target.value;
        const filteredCD = chatData.filter(c => c.address.includes(subString));
        setFilteredChatData(filteredCD);
    }

    function displayTooltip() {
        // Displays tooltip (onClick)
        setTooltip(true);
    }

    function enableModal() {
        setIsModal(true);
    }

    function enableProfileModal() {
        setIsProfileModal(true);
    }

    function checkLastMessage(c) {
        // Checks if last Message exists
        if (c.messages[(c.messages.length) - 1]) {
            if (c.messages[(c.messages.length) - 1].file && c.messages[c.messages.length - 1].text) {
                return (
                    <div className="flex items-center">
                        <IconContext value={{ className: 'text-secondary dark:text-primary' }}>
                            <FaCamera />
                        </IconContext>
                        <span className="pl-2">{truncateMessage(c.messages[c.messages.length - 1].text)}</span>
                    </div>
                )
            } else {
                if (c.messages[c.messages.length - 1].text) {
                    return truncateMessage(c.messages[c.messages.length - 1].text)
                } else {
                    return (
                        <div className="flex items-center">
                            <IconContext value={{ className: 'text-secondary dark:text-primary' }}>
                                <FaCamera />
                            </IconContext>
                            <span className="pl-1">media</span>
                        </div>
                    )
                }
            }
        } else {
            // First and only message
            return ''
        }
    }

    function checkTime(c) {
        if (c.messages[(c.messages.length) - 1]) {
            if (c.messages[(c.messages.length) - 1].time) {
                return formatTime(new Date(c.messages[(c.messages.length) - 1].time));
            } else {
                return '';
            }
        } else {
            return '';
        }
    }

    function renderChats(chatData, filteredChatData) {
        const search = document.querySelector('.search-filter');
        const chats = [];
        if(search.value && filteredChatData.length === 0) {
            return <div className="text-secondary dark:text-primary font-semibold text-center">No Results</div>
        }

        if(search.value && filteredChatData.length > 0) {
            for (let i = filteredChatData.length - 1; i >= 0; i--) {
                chats.push(
                    <Chat
                        address={filteredChatData[i].address ? truncateAddress(filteredChatData[i].address) : 'no address'}
                        id={filteredChatData[i].address}
                        avatar={filteredChatData[i].avatar}
                        lastMsg={checkLastMessage(filteredChatData[i])}
                        time={checkTime(filteredChatData[i])}
                        chat={filteredChatData[i]}
                        latest={i === filteredChatData.length - 1} />
                )
            }

            return chats;
        }

        if(!search.value) {
            for (let i = chatData.length - 1; i >= 0; i--) {
                chats.push(
                    <Chat
                        address={chatData[i].address ? truncateAddress(chatData[i].address) : 'no address'}
                        id={chatData[i].address}
                        avatar={chatData[i].avatar}
                        lastMsg={checkLastMessage(chatData[i])}
                        time={checkTime(chatData[i])}
                        chat={chatData[i]}
                        latest={i === chatData.length - 1} />
                )
            }

            return chats;
        }
    }

    return (
        <div className="side-chats-left bg-primary dark:bg-secondary w-[100%] lg:w-[40%] lg:border overflow-hidden lg:border-light-gray dark:lg:border-dark-gray absolute lg:relative bg-primary z-100">
            <div className="flex justify-between items-center p-4 chat-header-left">
                <div onClick={enableProfileModal} className="address text-sm text-secondary dark:text-primary font-semibold">{owner ? `${truncateAddress(owner)} (Me)` : 'Unauthenticated'}</div>
                <div className="flex items-center gap-x-2">
                    {isDark ? <div onClick={toggleDarkMode} className='ring text-secondary dark:text-primary ring-extremely-light-gray dark:ring-extremely-dark-gray p-2 bg-extremely-light-gray dark:bg-extremely-dark-gray  size-8 rounded-full'>
                        <SunChat />
                    </div> : <div onClick={toggleDarkMode} className='ring text-secondary dark:text-primary ring-extremely-light-gray dark:ring-extremely-dark-gray p-2 bg-extremely-light-gray size-8 rounded-full'>
                        <MoonChat />
                    </div>}
                    <div className="hidden lg:block" onClick={enableModal}>
                        <IconContext value={{ className: 'ring text-secondary dark:text-primary ring-extremely-light-gray dark:ring-extremely-dark-gray p-2 bg-extremely-light-gray dark:bg-extremely-dark-gray size-8 rounded-full' }}>
                            <GoPlus />
                        </IconContext>
                    </div>
                    <div className="w-fit" onClick={displayTooltip}>
                        <IconContext value={{ className: 'options-dots ring text-secondary dark:text-primary ring-extremely-light-gray dark:ring-extremely-dark-gray p-2 bg-extremely-light-gray dark:bg-extremely-dark-gray size-8 rounded-full' }}>
                            <BsThreeDotsVertical />
                        </IconContext>
                    </div>
                </div>
            </div>
            <div className="px-4 pb-4 search-container">
                <div tabIndex={0} className="flex items-center border border-light-gray dark:border-medium-gray rounded-full px-4">
                    <IconContext value={{ className: 'pr-2 text-secondary dark:text-medium-gray size-9' }} >
                        <CiSearch />
                    </IconContext>
                    <input type="text" className="search-filter w-full outline-none text-secondary dark:text-primary" placeholder="Search..." onChange={search} />
                </div>
            </div>
            <div className={`chat-lists`}
                style={{ height: `${chatsHeight}px`, overflowY: 'auto', scrollbarWidth: 'none' }}
            >
                {chatData.length > 0 && renderChats(chatData, filteredChatData)}
            </div>
            {tooltip && <Tooltip />}
            <StartChat enableModal={enableModal} />
        </div>
    )
}