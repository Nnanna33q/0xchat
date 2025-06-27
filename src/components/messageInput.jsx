import { CiFaceSmile } from "react-icons/ci";
import { IconContext } from "react-icons/lib";
import { GoPlus } from "react-icons/go";
import { IoSend } from "react-icons/io5";
import { useState, useEffect, useLayoutEffect, useRef, useContext } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ThemeContext } from "../contexts/themeContext";
import { WsContext } from "../contexts/wsContext";
import "emoji-picker-element";
import { AlertFailureContext } from "../contexts/alertFailureContext";
import { ChatDataContext } from "../contexts/chatDataContext";
import { SelectedChatContext } from "../contexts/selectedChatContext";
import { MediaTooltip } from "./tooltip";
import { MediaPreview } from "./tooltip";

export default function MessageInput() {
    const { isDark } = useContext(ThemeContext);
    const [isSendBtnVisible, setIsSendBtnVisible] = useState(false);
    const [isPickerVisible, setIsPickerVisible] = useState(false);
    const [pickerLocation, setPickerLocation] = useState({ top: null, left: null });
    const [messageInputHeight, setMessageInputHeight] = useState(0);
    const plusRef = useRef(null);
    const textareaRef = useRef(null);
    const sendBtnRef = useRef(null);
    const { ws } = useContext(WsContext);
    const { setAlertFailure } = useContext(AlertFailureContext);
    const { owner } = useContext(ChatDataContext);
    const { chatData, setChatData } = useContext(ChatDataContext);
    const { selectedChat, setSelectedChat } = useContext(SelectedChatContext);
    const [isMediaTooltipVisible, setIsMediaTooltipVisible] = useState(false);
    const [media, setMedia] = useState({ mediaType: '', blob: null });
    const [mediaUrl, setMediaUrl] = useState({ mediaType: '', url: '' });
    const errorRef = useRef({ status: false, reason: '' });

    useLayoutEffect(() => {
        setMessageInputHeight(document.querySelector('.message-input').clientHeight);
    }, [])

    useEffect(() => {
        const pickerTrigger = document.querySelector('.emoji-picker-trigger');

        function displayPicker() {
            setIsPickerVisible(true);
        }

        function removePicker(e) {
            const emojiPicker = document.querySelector('emoji-picker');

            if (e.target === pickerTrigger || e.target === emojiPicker) {
                return;
            }
            setIsPickerVisible(false);
        }

        pickerTrigger.addEventListener('click', displayPicker);
        document.body.addEventListener('click', removePicker);

    }, [isPickerVisible])

    useEffect(() => {
        if (isPickerVisible) {
            const emojiPicker = document.querySelector('emoji-picker');
            const textarea = document.querySelector('textarea');
            function displayEmoji(e) {
                textarea.value += e.detail.emoji.unicode;
                setIsSendBtnVisible(true);
            }
            emojiPicker.addEventListener('emoji-click', displayEmoji);
            return () => emojiPicker.removeEventListener('emoji-click', displayEmoji);
        }
    }, [isPickerVisible])

    useLayoutEffect(() => {
        const messageInputCoords = document.querySelector('.input-container').getBoundingClientRect();
        const location = {
            bottom: messageInputCoords.top,
            left: messageInputCoords.left,
            width: messageInputCoords.width
        }
        setPickerLocation(location)
    }, [])

    function displaySendBtn(e) {
        if (e.target.value || mediaUrl.url) { // Modified recently
            setIsSendBtnVisible(true);
        } else {
            setIsSendBtnVisible(false);
        }
    }

    useEffect(() => {
        // Animates tooltip before removing from dom
        function clearTooltip(e) {
            const plusBtn = document.querySelector('.plus-message-icon');
            const plusBtnContainer = document.querySelector('.plus-message-icon-container');
            if (e.target === plusBtn || e.target === plusBtnContainer) {
                setIsMediaTooltipVisible(true);
            } else {
                setIsMediaTooltipVisible(false);
            }
        }

        document.body.addEventListener('click', clearTooltip);

        return () => document.body.removeEventListener('click', clearTooltip);
    }, [])

    function addPhoto() {
        const addPhotoInput = document.querySelector('.file-photo');
        addPhotoInput.click();
    }

    function addVideo() {
        const addVideoInput = document.querySelector('.file-video');
        addVideoInput.click();
    }

    async function setMediaFile(e) {
        setIsSendBtnVisible(true);
        const file = e.target.files[0];
        setMedia({
            mediaType: file.type.includes('image') ? 'image' : 'video',
            blob: file
        })

        const reader = new FileReader();

        function createDataUrl(file) {
            return new Promise((resolve) => {
                function readFile() {
                    resolve(reader.result);
                }

                function alertError() {
                    setAlertFailure({ visible: true, msg: 'Failed to read file content' });
                }

                reader.readAsDataURL(file);
                reader.addEventListener('load', readFile);
                reader.addEventListener('error', alertError);
            })
        }

        setMediaUrl({
            mediaType: file.type.includes('image') ? 'image' : 'video',
            url: await createDataUrl(file)
        })

        e.target.value = null;
    }

    function removePreview() {
        setMedia({ mediaType: '', blob: null });
        setMediaUrl({ mediaType: '', url: '' });
        if (!textareaRef.current.value) {
            setIsSendBtnVisible(false);
        }
    }

    async function sendMessage() {
        const message = textareaRef.current.value;
        let validatedMediaUrl = '';

        const messageObj = {
            messageId: window.crypto.randomUUID(),
            from: owner,
            to: selectedChat.address,
            text: message,
            time: new Date(),
            lastLogin: selectedChat.lastLogin,
            file: mediaUrl.url,
            mediaType: mediaUrl.mediaType,
            status: 'sending',
            avatar: selectedChat.avatar
        }

        if(mediaUrl.url && (media.blob.size / 1000000 <= 100)) {
            const updatedSelectedChat = { ...selectedChat, messages: [ ...selectedChat.messages, messageObj ]};
            const updatedChatData = chatData.filter(c => c.address !== updatedSelectedChat.address);
            textareaRef.current.value = '';
            setIsSendBtnVisible(false);
            setSelectedChat(updatedSelectedChat);
            setChatData([ ...updatedChatData, updatedSelectedChat ]);
            setMediaUrl({ mediaType: '', url: '' });
        }

        try {
            if (media.blob && (media.blob.size / 1000000 <= 100)) {
                const formData = new FormData();
                formData.append('media', media.blob);
                const mediaResponse = await fetch('/media/validate', {
                    method: 'POST',
                    body: formData
                })
                if(!mediaResponse.ok) {
                    errorRef.current.status = true;
                    errorRef.current.reason = 'Unstable internet connection';
                    throw errorRef.current.reason;
                }
                const data = await mediaResponse.json();
                if (data.success) {
                    validatedMediaUrl = data.url;
                } else {
                    errorRef.current.status = true;
                    errorRef.current.reason = data.errorMessage;
                    throw errorRef.current.reason;
                }
            } else {
                errorRef.current.status = true;
                errorRef.current.reason = 'Unexpected error occurred';
            }

            if (message.length <= 500) { // Checks message length
                if (ws && ws.readyState === ws.OPEN) {
                    if (!message && !validatedMediaUrl) {
                        sendBtnRef.current.classList.remove('pointer-events-none');
                        errorRef.current.status = false;
                        errorRef.current.reason = '';
                        return;
                    }
                    const newMessages = [...selectedChat.messages, { ...messageObj, file: validatedMediaUrl }]
                    if(errorRef.current.status && media.blob) {
                        setAlertFailure({ visible: true, msg: errorRef.current.reason });
                        errorRef.current.status = false;
                        errorRef.current.reason = '';
                        return;
                    }
                    ws.send(JSON.stringify({ ...messageObj, file: validatedMediaUrl }));
                    setSelectedChat({ ...selectedChat, messages: newMessages });
                    // Remove stale selected chat from chat data and replace with updated selected chat
                    const chats = chatData.filter(c => c.address !== selectedChat.address);
                    chats.unshift(selectedChat);
                    setChatData(chats);
                    textareaRef.current.value = '';
                    setIsSendBtnVisible(false);
                    setMedia({ mediaType: '', blob: null });
                    setMediaUrl({ mediaType: '', url: '' });
                }
            } else {
                setAlertFailure({ visible: true, msg: '500 characters length exceeded' });
            }
        } catch (e) {
            console.error(e);
            setAlertFailure({ visible: true, msg: e });
            const updatedMessages = selectedChat.messages.map(m => {
                if(m.messageId === messageObj.messageId) {
                    return { ...m, status: 'failed' };
                } else {
                    return m;
                }
            })
            const updatedSelectedChat = { ...selectedChat, messages: updatedMessages };
            setSelectedChat(updatedSelectedChat);
            const updatedChatData = chatData.filter(s => s.address !== updatedSelectedChat.address);
            updatedChatData.push(updatedSelectedChat);
            setChatData(updatedChatData);
            errorRef.current.status = false,
            errorRef.current.reason = '';
            setMedia({ mediaType: '', blob: null });
            setMediaUrl({ mediaType: '', url: '' });
        }
    }

    return (
        <div className="message-input-container sticky bottom-4 px-2 bg-transparent">
            <div className="message-input py-2">
                <div className="input-container flex items-center border border-light-gray rounded-full p-1 bg-primary dark:bg-secondary">
                    <motion.div
                        key={'btn'}
                        initial={{ x: '-10px', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '-10px', opacity: 0 }}
                        className="emoji-picker-trigger">
                        <IconContext value={{ className: 'size-9 lg:size-10 text-secondary bg-very-light-gray dark:text-primary dark:bg-secondary p-2 rounded-full pointer-events-none' }}>
                            <CiFaceSmile />
                        </IconContext>
                    </motion.div>
                    <div className="pt-1 w-full">
                        <textarea disabled={!selectedChat.address} ref={textareaRef} className="w-[100%] max-h-20 overflow-scroll outline-none px-2 bg-transparent text-secondary dark:text-primary placeholder:text-medium-gray" placeholder="Send Message" name="message" id="message" style={{ resize: 'none', scrollbarWidth: 'none' }} rows={1} maxLength={500} onChange={displaySendBtn}></textarea>
                    </div>
                    {isSendBtnVisible &&
                        <motion.div
                            ref={sendBtnRef}
                            onClick={sendMessage}
                            key={'btn'}
                            initial={{ x: '-10px', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: '-10px', opacity: 0 }}>
                            <IconContext value={{ className: 'size-9 lg:size-10 text-secondary dark:text-primary p-2.5 rounded-full' }}>
                                <IoSend />
                            </IconContext>
                        </motion.div>
                    }
                    {!isSendBtnVisible &&
                        <motion.div ref={plusRef}
                            className="plus-message-icon-container"
                            key={'bt'}
                            initial={{ x: '-10px', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: '-10px', opacity: 0 }}>
                            <IconContext value={{ className: 'plus-message-icon size-9 lg:size-10 text-secondary bg-very-light-gray dark:text-primary dark:bg-extremely-dark-gray p-2 rounded-full' }}>
                                <GoPlus />
                            </IconContext>
                        </motion.div>
                    }
                </div>
                <AnimatePresence>
                    {isPickerVisible && <motion.div
                        initial={{ transform: `translateY(${400 + messageInputHeight}px)` }}
                        animate={{ transform: 'translateY(0)' }}
                        exit={{ transform: `translateY(${400 + messageInputHeight}px)` }}
                        key={'animate-picker'}
                        className="emoji-picker-container z-100"
                        style={{ position: 'fixed', bottom: `${pickerLocation.bottom - 12}px`, left: `${pickerLocation.left}px`, width: window.innerWidth < 540 ? `${pickerLocation.width}px` : 'auto' }}
                    ><emoji-picker className={`${isDark ? 'dark' : 'light'}`}></emoji-picker></motion.div>}
                </AnimatePresence>
            </div>
            {isMediaTooltipVisible && <MediaTooltip addPhoto={addPhoto} addVideo={addVideo} />}
            <div className="w-[1px] h-[1px] absolute overflow-hidden visibility-hidden">
                <form encType="multipart/form-data">
                    <input onInput={setMediaFile} className="file-photo" accept="image/*" type="file" />
                </form>
                <form encType="multipart/form-data">
                    <input onInput={setMediaFile} className="file-video" accept="video/*" type="file" />
                </form>
            </div>
            {mediaUrl.url && <MediaPreview mediaType={mediaUrl.mediaType} url={mediaUrl.url} removePreview={removePreview} />}
        </div>
    )
}