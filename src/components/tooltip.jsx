import { IconContext } from "react-icons/lib";
import { GoGear } from "react-icons/go";
import { MdBlock, MdOutlineVerified } from "react-icons/md";
import { CiGift } from "react-icons/ci";
import { GiSoundOn, GiSoundOff } from "react-icons/gi";
import { BsDoorClosed } from "react-icons/bs";
import { CiLogout } from "react-icons/ci";
import { LuUserPen } from "react-icons/lu";
import { LuImagePlus } from "react-icons/lu";
import { RiVideoOnAiLine } from "react-icons/ri";
import { BsPinAngle } from "react-icons/bs";
import { useEffect, useLayoutEffect, useState, useContext } from "react";
import { animate } from "motion/react";
import { IoCloseCircle } from "react-icons/io5";
import { AudioContext } from "../contexts/AudioContext";
import { SelectedChatContext } from "../contexts/selectedChatContext";
import { GiReceiveMoney } from "react-icons/gi";

export function Tooltip() {
    const [location, setLocation] = useState({ top: null, left: null });
    const { hasUserInteracted, setHasUserInteracted } = useContext(AudioContext);

    useLayoutEffect(() => {
        // Positions tooltip
        const chatHeaderDimension = document.querySelector('.chat-header-left').getBoundingClientRect();
        const tooltipWidth = document.querySelector('.tooltip').clientWidth;
        const l = {
            top: chatHeaderDimension.bottom,
            left: chatHeaderDimension.right - tooltipWidth - 16
        }
        setLocation(l)
    }, [])

    useEffect(() => {
        function animateTooltip() {
            const tooltip = document.querySelector('.tooltip');
            const originalHeight = tooltip.clientHeight;
            animate(tooltip, { height: [0, `${originalHeight}px`], visibility: 'visible' }, { duration: 0.2 })
        }
        animateTooltip();
    }, [])

    return (
        <div className="tooltip w-[50%] sm:w-[25%] lg:w-[40%] border border-very-light-gray dark:border-dark-gray bg-primary dark:bg-secondary text-secondary dark:text-primary p-2 rounded-md shadow-md" style={{ position: 'absolute', top: `${location.top}px`, left: `${location.left}px`, overflow: 'hidden', visibility: 'hidden' }}>
            <div className="text-sm flex items-center hover:bg-very-light-gray dark:hover:bg-dark-gray pl-2 gap-x-2 rounded-md py-2">
                <IconContext value={{ className: 'size-5' }}>
                    <GoGear />
                </IconContext>
                <div>Settings</div>
            </div>
            {hasUserInteracted ?
                <div className="text-sm flex items-center hover:bg-very-light-gray dark:hover:bg-dark-gray pl-2 gap-x-2 rounded-md py-2" onClick={() => setHasUserInteracted(() => false)} >
                    <IconContext value={{ className: 'size-5' }}>
                        <GiSoundOff />
                    </IconContext>
                    <div>Disable Sound</div>
                </div> :
                <div className="text-sm flex items-center hover:bg-very-light-gray dark:hover:bg-dark-gray pl-2 gap-x-2 rounded-md py-2" onClick={() => setHasUserInteracted(() => true)} >
                    <IconContext value={{ className: 'size-5' }}>
                        <GiSoundOn />
                    </IconContext>
                    <div>Enable Sound</div>
                </div>}
            <div className="text-sm flex items-center hover:bg-very-light-gray dark:hover:bg-dark-gray pl-2 gap-x-2 rounded-md py-2">
                <IconContext value={{ className: 'size-5' }}>
                    <BsDoorClosed />
                </IconContext>
                <div>Archived Chats</div>
            </div>
            <div className="text-sm flex items-center hover:bg-danger-light dark:hover:bg-danger-dark pl-2 gap-x-2 rounded-md py-2">
                <IconContext value={{ className: 'text-danger size-5' }}>
                    <CiLogout />
                </IconContext>
                <div className="text-danger">Logout</div>
            </div>
        </div>
    )
}

export function ChatHeaderTooltip({ setIsRequestModal, setICryptoRequestsModal }) {
    const [location, setLocation] = useState({ top: null, left: null });
    const { selectedChat } = useContext(SelectedChatContext);

    useEffect(() => {
        function animateTooltip() {
            const tooltip = document.querySelector('.tooltip-chat-header');
            const originalHeight = tooltip.clientHeight;
            animate(tooltip, { height: [0, `${originalHeight}px`], visibility: 'visible' }, { duration: 0.2 })
        }
        animateTooltip();
    }, [])

    useLayoutEffect(() => {
        const chatHeaderDimension = document.querySelector('.chat-header').getBoundingClientRect();
        const tooltipWidth = document.querySelector('.tooltip-chat-header').clientWidth;
        setLocation({
            top: chatHeaderDimension.bottom,
            left: chatHeaderDimension.right - tooltipWidth - 16
        })
    }, [])

    function enableRequestModal() {
        selectedChat.address && setIsRequestModal(true);
    }

    function enableCryptoRequestsModal() {
        selectedChat.address && setICryptoRequestsModal(true);
    }

    return (
        <div className="tooltip-chat-header w-[50%] sm:w-[25%] lg:w-[13%] border border-very-light-gray dark:border-dark-gray bg-primary dark:bg-secondary text-secondary dark:text-primary p-2 rounded-md shadow-md" style={{ position: 'absolute', top: `${location.top}px`, left: `${location.left}px`, overflow: 'hidden', visibility: 'hidden' }}>
            <div className="text-sm flex items-center hover:bg-very-light-gray dark:hover:bg-dark-gray pl-2 gap-x-2 rounded-md py-2">
                <IconContext value={{ className: '' }}>
                    <LuUserPen />
                </IconContext>
                <div>Set Name</div>
            </div>
            <div className="text-sm flex items-center hover:bg-very-light-gray dark:hover:bg-dark-gray pl-2 gap-x-2 rounded-md py-2">
                <IconContext value={{ className: '' }}>
                    <BsPinAngle />
                </IconContext>
                <div>Pin Chat</div>
            </div>
            <div className="text-sm flex items-center hover:bg-very-light-gray dark:hover:bg-dark-gray pl-2 gap-x-2 rounded-md py-2">
                <IconContext value={{ className: '' }}>
                    <BsDoorClosed />
                </IconContext>
                <div>Archive Chat</div>
            </div>
            <div onClick={enableRequestModal} className="text-sm flex items-center hover:bg-very-light-gray dark:hover:bg-dark-gray pl-2 gap-x-2 rounded-md py-2">
                <IconContext value={{ className: '' }}>
                    <GiReceiveMoney />
                </IconContext>
                <div>Request Crypto</div>
            </div>
            <div onClick={enableCryptoRequestsModal} className="text-sm flex items-center hover:bg-very-light-gray dark:hover:bg-dark-gray pl-2 gap-x-2 rounded-md py-2">
                <IconContext value={{ className: '' }}>
                    <CiGift />
                </IconContext>
                <div>
                    <span>Crypto Requests</span>
                </div>
            </div>
            <div className="text-sm flex items-center hover:bg-danger-light dark:hover:bg-danger-dark pl-2 gap-x-2 rounded-md py-2">
                <IconContext value={{ className: 'text-danger' }}>
                    <MdBlock />
                </IconContext>
                <div className="text-danger">Block User</div>
            </div>
        </div>
    )
}

export function MediaTooltip({ addPhoto, addVideo }) {
    const [location, setLocation] = useState({ top: null, left: null });

    useLayoutEffect(() => {
        const messageInputDimensions = document.querySelector('.message-input-container');
        const l = { top: messageInputDimensions.clientHeight + 8, right: 8 }
        setLocation(l);
    }, [])

    return (
        <div className="tooltip-media w-[50%] sm:w-[25%] border border-very-light-gray dark:border-dark-gray bg-primary dark:bg-secondary text-secondary dark:text-primary p-2 rounded-md shadow-md" style={{ position: 'absolute', bottom: `${location.top}px`, right: `${location.right}px`, overflow: 'hidden' }}>
            <div onClick={addPhoto} className="text-sm flex items-center hover:bg-very-light-gray dark:hover:bg-dark-gray pl-2 gap-x-2 rounded-md py-2">
                <IconContext value={{ className: '' }}>
                    <LuImagePlus />
                </IconContext>
                <div>Add Photo</div>
            </div>
            <hr />
            <div onClick={addVideo} className="text-sm flex items-center hover:bg-very-light-gray dark:hover:bg-dark-gray pl-2 gap-x-2 rounded-md py-2">
                <IconContext value={{ className: '' }}>
                    <RiVideoOnAiLine />
                </IconContext>
                <div>Add Video</div>
            </div>
        </div>
    )
}

export function MediaPreview({ url, mediaType, removePreview }) {
    const [location, setLocation] = useState({ top: null, left: null });

    useLayoutEffect(() => {
        const messageInputDimensions = document.querySelector('.message-input-container');
        const l = { top: messageInputDimensions.clientHeight + 8, right: 8 }
        setLocation(l);
    }, [])

    return (
        <div className="display-media w-[50vw] sm:w-[25vw] lg:w-[30vw] border border-very-light-gray dark:border-dark-gray bg-primary dark:bg-secondary text-secondary dark:text-primary rounded-md shadow-md" style={{ position: 'absolute', bottom: `${location.top}px`, right: `${location.right}px`, overflow: 'hidden' }}>
            {mediaType === 'image' ? <img src={url} alt="Photo" /> : <video controls={true} src={url} alt="Media" />}
            <div onClick={removePreview} className="absolute right-[4px] top-[4px] z-90 bg-primary dark:bg-secondary rounded-full w-fit">
                <IconContext value={{ className: 'size-5 text-secondary dark:text-primary' }}>
                    <IoCloseCircle />
                </IconContext>
            </div>
        </div>
    )
}