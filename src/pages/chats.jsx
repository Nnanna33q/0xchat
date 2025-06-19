import { createRoot } from "react-dom/client";
import { useState, useLayoutEffect, useEffect, StrictMode, useRef, useContext } from "react";
import { ThemeContext } from "../contexts/themeContext";
import { ChatDataContext } from "../contexts/chatDataContext";
import { SelectedChatContext } from "../contexts/selectedChatContext";
import { CryptoRequestsContext } from "../contexts/cryptoRequestsContext";
import { WsContext } from "../contexts/wsContext";
import { AlertFailureContext } from "../contexts/alertFailureContext";
import { AudioContext } from "../contexts/AudioContext";
import Modal from "../components/modal";
import { ProfileModal, RequestModal, CryptoRequestsModal } from "../components/modal";
import SideChatLeft from "../components/sideChatLeft";
import SideChatRight from "../components/sideChatRight";
import { AlertSuccess, AlertFailure, AlertMessage, AlertCryptoRequest } from "../components/alert";
import { AnimatePresence } from "motion/react";
import { HiddenContext } from "../contexts/hiddenContext";
import messageIncoming from "../assets/audio/message-incoming-2-199577.mp3";

function Chats() {
    const [isDark, setIsDark] = useState(localStorage.getItem('dark'));
    const [isModal, setIsModal] = useState(false);
    const [isProfileModal, setIsProfileModal] = useState(false);
    const [isRequestModal, setIsRequestModal] = useState(false);
    const [isCryptoRequestsModal, setIsCryptoRequestsModal] = useState(false);
    const [alertSuccess, setAlertSuccess] = useState({ visible: false, msg: '', check: false });
    const [alertFailure, setAlertFailure] = useState({ visible: false, msg: '' });
    const [alertMessage, setAlertMessage] = useState({ visible: false, address: '' });
    const [alertCryptoRequest, setAlertCryptoRequest] = useState({ visible: false, address: '', value: '', tokenName: '' });
    const [chatData, setChatData] = useState([]);
    const [owner, setOwner] = useState('');
    const [selectedChat, setSelectedChat] = useState(chatData.length > 0 ? chatData[chatData.length - 1] : {});
    const [ws, setWs] = useState(null);
    const [hidden, setHidden] = useState(true);
    const [hasUserInteracted, setHasUserInteracted] = useState(false);
    const [audio, setAudio] = useState(new Audio(messageIncoming));
    const [avatarSrc, setAvatarSrc] = useState('');
    const [cryptoRequests, setCryptoRequests] = useState([]);

    useEffect(() => {
        // Fetches chatData
        async function fetchChatData() {
            const response = await fetch('/app/chat-data');
            if (response.ok) {
                const chatResponseData = await response.json();
                if (chatResponseData.success) {
                    setChatData(chatResponseData.data);
                    chatResponseData.data.length > 0 && setSelectedChat(chatResponseData.data[chatResponseData.data.length - 1]);
                    setOwner(chatResponseData.owner);
                } else {
                    throw chatResponseData.errorMessage;
                }
            } else {
                throw 'Failed to fetch chat data';
            }
        }

        try {
            fetchChatData();
        } catch (e) {
            console.error(e);
            setAlertFailure({ visible: true, msg: e });
        }
    }, []);

    useEffect(() => {
        // Fetch avatar
        async function fetchAvatar() {
            try {
                const response = await fetch('/app/avatar');
                const data = await response.json();
                if (data.success) {
                    setAvatarSrc(data.url);
                } else {
                    throw data.errorMessage
                }
            } catch (e) {
                console.error(e);
                setAlertFailure({ visible: true, msg: e });
            }
        }
        fetchAvatar();
    }, [])

    useEffect(() => {
        // Fetch all crypto requests
        async function fetchCryptoRequests() {
            try {
                const response = await fetch('/app/crypto-requests');
                const result = await response.json();
                if (!result.success) {
                    throw result.errorMessage;
                }
                setCryptoRequests(result.data);
            } catch (e) {
                console.error(e);
                setAlertFailure({ visible: true, msg: e });
            }
        }
        fetchCryptoRequests();
    }, [])

    useEffect(() => {
        // Disables failure alert after 3 seconds
        let id;
        if (alertFailure.visible) {
            id = setTimeout(() => {
                setAlertFailure({ visible: false, msg: '' });
            }, 3000)
        }
        return () => id && clearTimeout(id);
    }, [alertFailure.visible])

    useEffect(() => {
        // Disables success alert after 3 seconds
        let id;
        if (alertSuccess.visible) {
            id = setTimeout(() => {
                setAlertSuccess({ visible: false, msg: '', check: false });
            }, 3000)
        }
        return () => id && clearTimeout(id);
    }, [alertSuccess.visible])

    useEffect(() => {
        // Disables message alert after 3 seconds
        let id;
        if (alertMessage.visible) {
            id = setTimeout(() => {
                setAlertMessage({ visible: false, address: '' });
            }, 3000)
        }
        return () => id && clearTimeout(id);
    }, [alertMessage.visible])

    useEffect(() => {
        // Disables crypto request alert after 5 seconds
        let id;
        if (alertCryptoRequest.visible) {
            id = setTimeout(() => {
                setAlertCryptoRequest({ visible: false, address: '', value: '', tokenName: '' });
            }, 5000)
        }
        return () => id && clearTimeout(id);
    }, [alertCryptoRequest.visible])

    useLayoutEffect(() => {
        // Sets page theme depending on isDark
        if (isDark) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }, [isDark])

    useEffect(() => {
        const ws = new WebSocket('/');
        setWs(ws);
        return () => {
            setWs(null);
            ws.close();
        };
    }, [])

    useEffect(() => {
        // Register ws event listener;
        function onOpen(e) {
            console.log('ws is open');
        }

        function onError(e) {
            setAlertFailure({ visible: true, msg: 'ws error occurred' });
        }

        async function onMessage(e) {
            const message = JSON.parse(e.data);
            if (message.response) {
                // Get message from selectedChat
                const newMessages = selectedChat.messages.map((m) => {
                    if (m.messageId === message.response.messageId) {
                        message.response.errorMessage && setAlertFailure({ visible: true, msg: message.response.errorMessage });
                        const updatedMessage = { ...m, status: message.response.status };
                        return updatedMessage;
                    } else {
                        return m
                    }
                })
                const newSelectedChat = { ...selectedChat, messages: newMessages }
                setSelectedChat(newSelectedChat);
                const updatedChatData = chatData.filter(c => c.address !== newSelectedChat.address);
                updatedChatData.push(newSelectedChat);
                setChatData(updatedChatData);
            }

            if (message.received === true) {
                // Someone sent a message
                const updatedChatData = chatData.map(c => {
                    if (c.address === message.message.from) {
                        c.messages = [...c.messages, message.message];
                    }
                    return c;
                })
                const sender = updatedChatData.find(c => c.address === message.message.from);
                // If !sender, message was sent by new user;
                !sender && updatedChatData.push({
                    address: message.message.from,
                    avatar: message.message.avatar,
                    online: message.message.online,
                    lastLogin: message.message.lastLogin,
                    messages: [message.message]
                })
                setChatData(updatedChatData);

                if (sender && sender.address === selectedChat.address) {
                    if (window.innerWidth >= 1024 || hidden === false) {
                        // Only sets selectedChat if sender is also selectedChat.address;
                        setSelectedChat(sender);
                        // update message status to seen;
                        ws.send(JSON.stringify({
                            updateStatus: true,
                            recipient: sender.address
                        }))
                    } else {
                        setAlertMessage(() => {
                            hasUserInteracted && audio.play();
                            return { visible: true, address: sender.address }
                        });
                    }
                } else {
                    setAlertMessage(() => {
                        hasUserInteracted && audio.play();
                        return { visible: true, address: message.message.from };
                    })
                }
            }

            if (message.updateStatus) {
                // Update messages to seen;
                const sChat = chatData.find(s => s.address === message.address);
                sChat.messages.forEach(m => m.status = 'seen');
                message.statusSetter && setSelectedChat(sChat)
                const updatedchatData = chatData.map(c => {
                    if (c.address === message.recipient) {
                        return sChat;
                    } else {
                        return c;
                    }
                })
                setChatData(updatedchatData);
            }

            if (message.onlineStatus && message.onlineStatus.online === false) {
                // One of user's friends went offline
                const updatedChatData = chatData.map(c => {
                    if (c.address === message.onlineStatus.address) {
                        c.online = false;
                        c.lastLogin = message.onlineStatus.lastLogin
                        if (c.address === selectedChat.address) {
                            setSelectedChat(c);
                        }
                    }
                    return c;
                })
                setChatData(updatedChatData);
                try {
                    const response = await fetch('/app/online/false', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ address: message.onlineStatus.address, lastLogin: message.onlineStatus.lastLogin })
                    })
                    const data = await response.json();
                    if (!data.success) {
                        throw data.errorMessage;
                    }
                } catch (e) {
                    console.error(e);
                }
            }


            if (message.onlineStatus && message.onlineStatus.online === true) {
                // One of user's friends came online
                const updatedChatData = chatData.map(c => {
                    if (c.address === message.onlineStatus.address) {
                        c.online = true;
                        if (c.address === selectedChat.address) {
                            setSelectedChat(c);
                        }
                    }
                    return c;
                })
                setChatData(updatedChatData);
                try {
                    const response = await fetch('/app/online/true', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ address: message.onlineStatus.address })
                    })
                    const data = await response.json();
                    if (!data.success) {
                        throw data.errorMessage;
                    }
                } catch (e) {
                    console.error(e);
                }
            }

            if (message.updateAvatar) {
                if (selectedChat.address = message.address) {
                    setSelectedChat({ ...selectedChat, avatar: message.url });
                }
                setChatData(chatData.map(c => {
                    if (c.address === message.address) {
                        c.avatar = message.url;
                    }
                    return c;
                }))
            }

            if (message.cryptoRequestSender) {
                // Enable request button
                document.querySelector('.request-btn').disabled = false;
                document.querySelector('.request-close-icon').click();
                setAlertSuccess({ visible: true, msg: 'Request sent successfully!', check: true });
            }

            if (message.cryptoRequest) {
                const { info } = message;
                // Notify user of new crypto request
                setAlertCryptoRequest({ visible: true, address: info.recipient, value: info.amount, tokenName: info.symbol });
                const updatedCryptoRequests = cryptoRequests;
                updatedCryptoRequests.unshift(info);
                setCryptoRequests(updatedCryptoRequests);
                hasUserInteracted && audio.play();
            }
        }

        function onClose(e) {
            console.log(e);
        }

        if (ws) {
            ws.addEventListener('open', onOpen);

            ws.addEventListener('error', onError);

            ws.addEventListener('message', onMessage)

            ws.addEventListener('close', onClose);
        }

        return () => {
            if (ws) {
                ws.removeEventListener('open', onOpen);
                ws.removeEventListener('error', onError);
                ws.removeEventListener('message', onMessage);
                ws.removeEventListener('close', onClose);
            }
        }

    }, [selectedChat, chatData, hidden, hasUserInteracted]);


    function disableModal() {
        // Disables modal (onClick event);
        setIsModal(false);
    }

    function disableProfileModal() {
        setIsProfileModal(false);
    }

    function disableRequestModal() {
        setIsRequestModal(false);
    }

    function disableCryptoRequestsModal() {
        setIsCryptoRequestsModal(false);
    }

    return (
        <ThemeContext.Provider value={{ isDark, setIsDark }}>
            <ChatDataContext.Provider value={{ chatData, owner, setChatData }}> {/* Immediately passes data to child components */}
                <SelectedChatContext.Provider value={{ selectedChat, setSelectedChat }}>
                    <WsContext.Provider value={{ ws }}>
                        <AlertFailureContext.Provider value={{ setAlertFailure }}>
                            <HiddenContext.Provider value={{ hidden, setHidden }}>
                                <AudioContext.Provider value={{ hasUserInteracted, setHasUserInteracted }}>
                                    <CryptoRequestsContext.Provider value={{ cryptoRequests, setCryptoRequests }}>
                                        <div className="parentElem bg-primary dark:bg-secondary lg:flex h-[100vh] lg:px-10 lg:py-4 overflow-x-hidden">
                                            <SideChatLeft setIsModal={setIsModal} setIsProfileModal={setIsProfileModal} />
                                            <SideChatRight setIsRequestModal={setIsRequestModal} setIsCryptoRequestsModal={setIsCryptoRequestsModal} />
                                            {isModal && <Modal disableModal={disableModal} />}
                                            {isProfileModal && <ProfileModal disableProfileModal={disableProfileModal} avatarSrc={avatarSrc} setAvatarSrc={setAvatarSrc} owner={owner} ws={ws} />}
                                            {isRequestModal && <RequestModal disableRequestModal={disableRequestModal} />}
                                            {isCryptoRequestsModal && <CryptoRequestsModal disableCryptoRequestsModal={disableCryptoRequestsModal} />}
                                        </div>
                                        <AnimatePresence>
                                            {alertSuccess.visible && <AlertSuccess msg={alertSuccess.msg} check={alertSuccess.check} />}
                                            {alertFailure.visible && <AlertFailure msg={alertFailure.msg} />}
                                            {alertMessage.visible && <AlertMessage address={alertMessage.address} />}
                                            {alertCryptoRequest.visible && <AlertCryptoRequest address={alertCryptoRequest.address} value={alertCryptoRequest.value} tokenName={alertCryptoRequest.tokenName} />}
                                        </AnimatePresence>
                                    </CryptoRequestsContext.Provider>
                                </AudioContext.Provider>
                            </HiddenContext.Provider>
                        </AlertFailureContext.Provider>
                    </WsContext.Provider>
                </SelectedChatContext.Provider>
            </ChatDataContext.Provider>
        </ThemeContext.Provider>
    )
}

const root = createRoot(document.querySelector('#root'));

root.render(
    <StrictMode>
        <Chats />
    </StrictMode>
)