import Backdrop from "./backdrop";
import { IoCloseCircle } from "react-icons/io5";
import { IconContext } from "react-icons/lib";
import { useState, useEffect, useLayoutEffect, useRef, useContext, useMemo } from "react";
import { animate, motion, AnimatePresence } from "motion/react";
import { AlertFailure, AlertSuccess } from "./alert";
import { SpinnerDark, SpinnerLight } from "./spinner";
import { ThemeContext } from "../contexts/themeContext";
import { SelectedChatContext } from "../contexts/selectedChatContext";
import { startChatViewMessage } from "../utils/viewMessages";
import { FaUser } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";
import { coins } from "../utils/coins";
import { WsContext } from "../contexts/wsContext";
import { truncateAddress } from "../utils/truncate";
import { CryptoRequestsContext } from "../contexts/cryptoRequestsContext";
import { modal } from "../modal";
import { BrowserProvider, ethers, parseUnits } from 'ethers';

const abi = [
    "function transfer(address to, uint amount)"
]

export default function Modal({ disableModal }) {
    const { isDark } = useContext(ThemeContext);
    const [position, setPosition] = useState({});
    const [alertFailure, setAlertFailure] = useState({ visible: false, msg: '' });
    const [isSpinnerVisible, setIsSpinnerVisible] = useState(false);
    const inputRef = useRef(null);
    const buttonRef = useRef(null);
    const { setSelectedChat } = useContext(SelectedChatContext);

    useEffect(() => {
        // Removes failure alert notification after 3 seconds;
        let id;
        if (alertFailure.visible) {
            id = setTimeout(() => {
                setAlertFailure({ visible: false, msg: '' });
            }, 3000)
        }

        return () => id && clearTimeout(id);
    }, [alertFailure.visible])

    useEffect(() => {
        async function animateModal() {
            const backdrop = document.querySelector('.backdrop');
            const modalContainer = document.querySelector('.modal-container');
            await animate(backdrop, { height: '100vh' }, { duration: 0.3 });
            await animate(modalContainer, { translateY: 0 }, { duration: 1, type: 'spring', bounce: 0.3 })
        }
        animateModal();
    }, [])

    async function closeAnimation() {
        async function exitAnimateModal() {
            const backdrop = document.querySelector('.backdrop');
            const modalContainer = document.querySelector('.modal-container');
            await animate(modalContainer, { translateY: '100vh' }, { duration: 0.6, type: 'spring', bounce: 0.3 })
            await animate(backdrop, { height: 0 }, { duration: 0.2 });
        }
        await exitAnimateModal();
        disableModal();
    }

    function calculateModalPosition() {
        const modal = document.querySelector('.modal-container');

        const position = {
            top: (window.innerHeight / 2) - (modal.clientHeight / 2),
            left: (window.innerWidth / 2) - (modal.clientWidth / 2)
        }
        setPosition(position);
    }

    useLayoutEffect(() => calculateModalPosition(), [])

    useLayoutEffect(() => {
        document.body.classList.add('overflow-hidden');
        return () => document.body.classList.remove('overflow-hidden');
    }, [])

    function setSpiner() {
        return isDark ? <SpinnerDark /> : <SpinnerLight />;
    }

    function handleInputChange(e) {
        if (e.target.value) {
            buttonRef.current.disabled = false;
        } else {
            buttonRef.current.disabled = true;
        }
    }

    async function startChat(e) {
        // Starts a new chat
        e.preventDefault();
        setIsSpinnerVisible(true);
        try {
            if (inputRef.current.value.length === 42 && inputRef.current.value[0] === '0' && inputRef.current.value[1] === 'x') {
                const response = await fetch('/app/start-chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ recipient: inputRef.current.value })
                })
                const data = await response.json();
                if (data.success) {
                    setSelectedChat(data.chat);
                    document.querySelector('.io-close-circle').click();
                    startChatViewMessage();
                } else {
                    throw data.errorMessage;
                }
            } else {
                throw 'Invalid evm address';
            }
        } catch (e) {
            console.error(e);
            setAlertFailure({ visible: true, msg: typeof e === 'string' ? e : 'An unexpected error occurred' });
            setIsSpinnerVisible(false);
        }
    }

    return (
        <div>
            <Backdrop />
            <div>
                <div className={`modal-container bg-primary dark:bg-secondary w-[95%] sm:w-[75%] lg:w-[50vw] border border-very-light-gray dark:border-dark-gray shadow shadow-md rounded-md z-150 p-4 sm:p-8`} style={{ position: 'fixed', top: `${position.top}px`, left: `${position.left}px`, transform: 'translateY(100vh)' }}>
                    <h2 className="font-bold text-lg text-secondary dark:text-primary">Start Chat</h2>
                    <div className="io-close-circle absolute right-4 top-4" onClick={closeAnimation}>
                        <IconContext value={{ className: 'size-6 text-secondary dark:text-primary' }}>
                            <IoCloseCircle />
                        </IconContext>
                    </div>
                    <p className="text-sm font-extralight text-secondary dark:text-primary">Enter an address to start a new chat</p>
                    <div className="py-12">
                        <input ref={inputRef} onChange={handleInputChange} className="w-full border border-light-gray dark:border-dark-gray p-2 text-secondary dark:text-primary rounded-sm outline-none focus:border-secondary dark:focus:border-primary" type="text" placeholder="0x..." />
                        <button ref={buttonRef} className="flex items-center justify-center mt-4 w-full bg-secondary dark:bg-primary text-primary dark:text-secondary rounded-sm py-2" onClick={startChat}>
                            {!isSpinnerVisible && <span className="pr-1 text-lg">Start Chatting</span>}
                            {isSpinnerVisible && setSpiner()}
                        </button>
                    </div>
                </div>
            </div>
            <AnimatePresence>
                {alertFailure.visible && <AlertFailure msg={alertFailure.msg} />}
            </AnimatePresence>
        </div>
    )
}

export function ProfileModal({ disableProfileModal, avatarSrc, setAvatarSrc, owner, ws }) {
    const { isDark } = useContext(ThemeContext);
    const [position, setPosition] = useState({});
    const [alertFailure, setAlertFailure] = useState({ visible: false, msg: '' });
    const [isSpinnerVisible, setIsSpinnerVisible] = useState(false);

    useEffect(() => {
        // Removes failure alert notification after 3 seconds;
        let id;
        if (alertFailure.visible) {
            id = setTimeout(() => setAlertFailure({ visible: false, msg: '' }), 3000)
        }

        return () => id && clearTimeout(id);
    }, [alertFailure.visible])

    useEffect(() => {
        async function animateModal() {
            const backdrop = document.querySelector('.backdrop');
            const modalContainer = document.querySelector('.profile-modal-container');
            await animate(backdrop, { height: '100vh' }, { duration: 0.3 });
            await animate(modalContainer, { translateY: 0 }, { duration: 1, type: 'spring', bounce: 0.3 })
        }
        animateModal();
    }, [])

    async function closeAnimation() {
        async function exitAnimateModal() {
            const backdrop = document.querySelector('.backdrop');
            const modalContainer = document.querySelector('.profile-modal-container');
            await animate(modalContainer, { translateY: '100vh' }, { duration: 0.6, type: 'spring', bounce: 0.3 })
            await animate(backdrop, { height: 0 }, { duration: 0.2 });
        }
        await exitAnimateModal();
        disableProfileModal();
    }

    function calculateModalPosition() {
        const modal = document.querySelector('.profile-modal-container');

        const position = {
            top: (window.innerHeight / 2) - (modal.clientHeight / 2),
            left: (window.innerWidth / 2) - (modal.clientWidth / 2),
            height: modal.clientHeight
        }
        setPosition(position);
    }

    useLayoutEffect(() => calculateModalPosition(), [])

    useLayoutEffect(() => {
        document.body.classList.add('overflow-hidden');
        return () => document.body.classList.remove('overflow-hidden');
    }, [])

    useEffect(() => {
        const backdrop = document.querySelector('.backdrop');
        async function unscaleImage() {
            const modal = document.querySelector('.profile-modal-container');
            if (modal.classList.contains('animation-complete')) {
                const img = document.querySelector('.avatar-container');
                const modal = document.querySelector('.profile-modal-container');
                const addressContainer = document.querySelector('.address-container');
                const closeBtn = document.querySelector('.io-close-circle-profile');
                async function animateImage() {
                    animate(img, { scale: 1 }, { duration: 0.5, type: 'spring', bounce: 0.2 })
                    animate(modal, { backgroundColor: isDark ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)', borderColor: isDark ? 'rgb(51, 51, 51)' : 'rgb(240, 240, 240)' }, { duration: 0.2 });
                    animate(addressContainer, { opacity: 1 }, { duration: 0.2 });
                    animate(closeBtn, { opacity: 1 }, { duration: 0.2 });
                    img.classList.add('rounded-full');
                }
                animateImage();
                modal.classList.remove('animation-complete');
                modal.classList.remove('pointer-events-none');
            }
        }

        backdrop.addEventListener('click', unscaleImage);

        () => backdrop.removeEventListener('click', unscaleImage);
    }, [])

    async function viewImage() {
        const img = document.querySelector('.avatar-container');
        const modal = document.querySelector('.profile-modal-container');
        const addressContainer = document.querySelector('.address-container');
        const closeBtn = document.querySelector('.io-close-circle-profile');
        async function animateImage() {
            animate(modal, { backgroundColor: 'transparent', borderColor: 'transparent' }, { duration: 0.2 });
            animate(addressContainer, { opacity: 0 }, { duration: 0.2 });
            animate(closeBtn, { opacity: 0 }, { duration: 0.2 });
            img.classList.remove('rounded-full');
            await animate(img, { scale: 4 }, { duration: 0.5, type: 'spring', bounce: 0.2 })
        }
        animateImage();
        modal.classList.add('animation-complete');
        modal.classList.add('pointer-events-none');
    }

    function renderSpinner() {
        if (isSpinnerVisible) {
            return isDark ? <div className="py-12.5"><SpinnerLight /></div> : <div className="py-12.5"><SpinnerDark /></div>
        } else {
            return <IconContext value={{ className: 'size-25 rounded-full dark:text-primary text-secondary' }}><FaUser /></IconContext>
        }
    }

    function triggerFileInput() {
        const photo = document.querySelector('.upload-photo');
        photo.click();
    }

    function renderText(avatarSrc) {
        if (isSpinnerVisible) {
            return <div className="pt-2"></div>
        } else {
            if (avatarSrc) {
                return <div className="text-secondary dark:text-primary pt-2" onClick={triggerFileInput}>Edit Photo</div>
            } else {
                return <div className="text-secondary dark:text-primary pt-2" onClick={triggerFileInput}>Add Photo</div>
            }
        }
    }

    async function uploadPhoto(file) {
        const photo = document.querySelector('.upload-photo');
        try {
            photo.classList.add('pointer-events-none') // Prevent image selection
            setIsSpinnerVisible(true);

            // Validate file
            if (!file.type.includes('image')) {
                throw 'Invalid mimetype';
            }

            if ((file.size / 1000000) > 100) {
                throw 'Photo must be less than 100MB to upload';
            }

            const formData = new FormData();
            formData.append('photo', file);

            const response = await fetch('/app/upload/photo', {
                method: 'POST',
                body: formData
            })
            const data = await response.json();

            if (data.success) {
                // Set avatarSrc to data.url without refreshing page
                setAvatarSrc(data.url);
                photo.classList.remove('pointer-events-none') // Enable image selection
                setIsSpinnerVisible(false);
                // Broadcast this change to user's friends via websocket on the backend
                if (ws && ws.readyState === ws.OPEN) {
                    ws.send(JSON.stringify({
                        updateAvatar: true,
                        url: data.url
                    }))
                }
            } else {
                throw data.errorMessage
            }
        } catch (e) {
            console.error(e);
            setAlertFailure({ visible: true, msg: typeof e === 'string' ? e : e.errorMessage });
            photo.classList.remove('pointer-events-none') // Enable image selection
            setIsSpinnerVisible(false);
        }
    }

    async function setFileBlob(e) {
        await uploadPhoto(e.target.files[0]);
        e.target.value = '';
    }

    return (
        <div>
            <Backdrop />
            <div>
                <div className={`profile-modal-container  w-[95%] sm:w-[75%] lg:w-[50vw] border border-very-light-gray dark:border-dark-gray rounded-md z-150 p-4 sm:p-8`} style={{ position: 'fixed', top: `${position.top}px`, left: `${position.left}px`, transform: 'translateY(100vh)', backgroundColor: isDark ? 'rgb(0,0,0)' : 'rgb(255,255,255)', borderColor: isDark ? 'rgb(51, 51, 51)' : 'rgb(240, 240, 240)' }}>
                    <div className="flex items-center justify-center">
                        <div className="absolute right-4">
                            <div className="io-close-circle-profile" onClick={closeAnimation}>
                                <IconContext value={{ className: 'size-6 text-secondary dark:text-primary' }}>
                                    <IoCloseCircle />
                                </IconContext>
                            </div>
                        </div>
                        <h2 className="font-bold text-lg text-secondary dark:text-primary ">Profile</h2>
                    </div>
                    <div className="flex flex-col items-center py-8">
                        {avatarSrc
                            ? <img className="avatar-container size-25 rounded-full" src={avatarSrc} onClick={viewImage} />
                            : <div onClick={triggerFileInput}>{renderSpinner()}</div>}
                        {renderText(avatarSrc)}
                    </div>
                    <div className="address-container">
                        <label htmlFor='user-address' className='text-secondary dark:text-primary pl-2'>Address</label>
                        <input id='user-address' className="w-full bg-primary dark:bg-secondary dark:text-primary text-secondary p-2 mt-1 rounded-sm ring ring-medium-gray" type="text" disabled={true} value={owner} />
                    </div>
                    <input type="file" className="w-0 h-0 opacity-0 upload-photo" accept="image/*" onInput={setFileBlob} />
                </div>
            </div>
            <AnimatePresence>
                {alertFailure.visible && <AlertFailure msg={alertFailure.msg} />}
            </AnimatePresence>
        </div>
    )
}

function Tokens({ setKey }) {
    function handleClick(c) {
        setKey(c.key);
        document.querySelector('.close-select-token').click();
    }

    const tokens = coins.map(c => {
        return (
            <div key={c.key} className="py-4" id={c.key} onClick={() => handleClick(c)}>
                <div className="flex items-center">
                    <div className="rounded-full relative">
                        <c.logo />
                        <c.networkLogo />
                    </div>
                    <span className="pl-2 dark:text-primary">{c.symbol}</span>
                </div>
            </div>
        )
    })
    return (
        <>
            {tokens}
        </>
    )
}

function SelectToken({ position, setIsTokenModalVisible, setAlertFailure, setKey }) {
    useEffect(() => {
        function animateModal() {
            const modal = document.querySelector('.select-token-modal-container');
            animate(modal, { translateY: 0 }, { duration: 1, type: 'spring', bounce: 0.3 })
        }
        animateModal();
    }, [])

    async function closeAnimation() {
        async function animateExitModal() {
            const modal = document.querySelector('.select-token-modal-container');
            await animate(modal, { translateY: '100vh' }, { duration: 1, type: 'spring', bounce: 0.3 })
        }
        await animateExitModal();
        setIsTokenModalVisible(false);
    }

    return (
        <div className={`select-token-modal-container bg-primary dark:bg-secondary w-[95%] sm:w-[75%] lg:w-[50vw] border border-very-light-gray dark:border-dark-gray shadow shadow-md rounded-md z-160 p-4 sm:p-8`} style={{ position: 'fixed', top: `${position.top}px`, left: `${position.left}px`, transform: 'translateY(100vh)' }}>
            <div className="flex items-center justify-center">
                <h2 className="font-semibold text-lg text-secondary dark:text-primary">Select from supported tokens</h2>
                <div className="io-close-circle close-select-token absolute right-4 top-4" onClick={closeAnimation}>
                    <IconContext value={{ className: 'size-6 text-secondary dark:text-primary' }}>
                        <IoCloseCircle />
                    </IconContext>
                </div>
            </div>
            <div className="text-medium-gray border-b border-b-light-gray dark:border-b-dark-gray py-2">
                <small>Tokens</small>
            </div>
            {<Tokens setKey={setKey} />}
        </div>
    )
}

export function RequestModal({ disableRequestModal }) {
    const { isDark } = useContext(ThemeContext);
    const [position, setPosition] = useState({});
    const [alertFailure, setAlertFailure] = useState({ visible: false, msg: '' });
    const [alertSuccess, setAlertSuccess] = useState({ visible: false, msg: '' });
    const [previousInputValue, setPreviousInputValue] = useState(0);
    const [isSpinnerVisible, setIsSpinnerVisible] = useState(false);
    const { selectedChat } = useContext(SelectedChatContext);
    const [isTokenModalVisible, setIsTokenModalVisible] = useState(false);
    const [key, setKey] = useState(null);
    const [amount, setAmount] = useState(null);
    const { ws } = useContext(WsContext);
    const coin = useMemo(() => {
        return coins.find(c => c.key === key)
    }, [key]);

    useEffect(() => {
        // Removes failure alert notification after 3 seconds
        let id;
        if (alertFailure.visible) {
            id = setTimeout(() => {
                console.log('Cleared');
                setAlertFailure({ visible: false, msg: '' })
            }, 3000)
        }

        return () => id && clearTimeout(id);
    }, [alertFailure.visible])

    useEffect(() => {
        async function animateModal() {
            const backdrop = document.querySelector('.backdrop');
            const modalContainer = document.querySelector('.request-modal-container');
            await animate(backdrop, { height: '100vh' }, { duration: 0.3 });
            await animate(modalContainer, { translateY: 0 }, { duration: 1, type: 'spring', bounce: 0.3 })
        }
        animateModal();
    }, [])

    async function closeAnimation() {
        async function exitAnimateModal() {
            const backdrop = document.querySelector('.backdrop');
            const modalContainer = document.querySelector('.request-modal-container');
            await animate(modalContainer, { translateY: '100vh' }, { duration: 0.6, type: 'spring', bounce: 0.3 })
            await animate(backdrop, { height: 0 }, { duration: 0.2 });
        }
        await exitAnimateModal();
        disableRequestModal();
    }

    function calculateModalPosition() {
        const modal = document.querySelector('.request-modal-container');

        const position = {
            top: (window.innerHeight / 2) - (modal.clientHeight / 2),
            left: (window.innerWidth / 2) - (modal.clientWidth / 2)
        }
        setPosition(position);
    }

    useLayoutEffect(() => calculateModalPosition(), [])

    useLayoutEffect(() => {
        document.body.classList.add('overflow-hidden');
        return () => document.body.classList.remove('overflow-hidden');
    }, [])

    function inputAmount(e) {
        const amount = parseFloat(e.target.value);
        !isNaN(amount) && setAmount(amount);
    }

    function inputAmountOnFocus(e) {
        Array.from(e.target.parentElement.children).forEach(c => {
            if (c !== e.target) {
                c.classList.remove('border');
            } else {
                c.classList.add('border');
                setAmount(null);
            }
        })
    }

    function enforceMinMax(e) {
        const number = parseFloat(e.target.value);
        if (number < 1 || number > 1000) {
            previousInputValue ? e.target.value = previousInputValue : e.target.value = '';
            inputAmount(e);
        } else {
            setPreviousInputValue(number)
            inputAmount(e);
        }
    }

    function setText() {
        if (isSpinnerVisible) {
            return isDark ? <SpinnerDark /> : <SpinnerLight />
        } else {
            return 'Request';
        }
    }

    function tenDollarOnClick(e) {
        Array.from(e.target.parentElement.children).forEach(c => {
            if (c !== e.target) {
                c.classList.remove('border');
            } else {
                c.classList.add('border');
                setAmount(10);
            }
        })
    }

    function hundredDollarOnClick(e) {
        Array.from(e.target.parentElement.children).forEach(c => {
            if (c !== e.target) {
                c.classList.remove('border');
            } else {
                c.classList.add('border');
                setAmount(100);
            }
        })
    }

    function getCoinInfo() {
        if (coin) {
            return (
                <div className="flex items-center">
                    <div className="rounded-full relative">
                        <coin.logo />
                        <coin.networkLogo />
                    </div>
                    <span className="pl-2 dark:text-primary">{coin.symbol}</span>
                </div>
            )
        } else {
            return <span className="text-sm">Select Token</span>
        }
    }

    async function requestCrypto(e) {
        if (!amount) {
            setAlertFailure({ visible: true, msg: 'Please select an amount' });
            console.log('Please select an amount');
            return;
        }
        if (parseFloat(amount) < 1 || parseFloat(amount) > 1000 || isNaN(parseFloat(amount))) {
            setAlertFailure({ visible: true, msg: 'Invalid amount value' });
            console.log('Invalid amount value');
            return;
        }

        if (!key || typeof key !== 'number') {
            setAlertFailure({ visible: true, msg: 'Failed to retrieve token info' });
            return;
        }

        const tokenInfo = coins.find(c => c.key === key);
        setIsSpinnerVisible(true);
        e.target.disabled = true;

        // Broadcast via ws
        if (ws && ws.readyState === ws.OPEN) {
            ws.send(JSON.stringify({
                cryptoRequest: true,
                info: {
                    amount: amount,
                    name: tokenInfo.name,
                    network: tokenInfo.network,
                    symbol: tokenInfo.symbol,
                    chainId: tokenInfo.chainId,
                    contractAddress: tokenInfo.contractAddress,
                    decimal: tokenInfo.tokenDecimal,
                    donor: selectedChat.address
                }
            }))
        }
    }

    return (
        <div>
            <Backdrop />
            <div>
                <div className={`request-modal-container bg-primary dark:bg-secondary w-[95%] sm:w-[75%] lg:w-[50vw] border border-very-light-gray dark:border-dark-gray shadow shadow-md rounded-md z-150 p-4 sm:p-8`} style={{ position: 'fixed', top: `${position.top}px`, left: `${position.left}px`, transform: 'translateY(100vh)' }}>
                    <div className="flex items-center justify-center pt-2">
                        <h2 className="font-bold text-lg text-secondary dark:text-primary">Request Crypto</h2>
                        <div className="io-close-circle request-close-icon absolute right-4 top-4" onClick={closeAnimation}>
                            <IconContext value={{ className: 'size-6 text-secondary dark:text-primary' }}>
                                <IoCloseCircle />
                            </IconContext>
                        </div>
                    </div>
                    <small className="pb-4 dark:text-light-gray text-center block overflow-scroll" style={{ scrollbarWidth: 'none' }}>Send a crypto request to <span className="text-secondary dark:text-light-gray">{truncateAddress(selectedChat.address)}</span></small>
                    <div className="py-2">
                        <small className="text-medium-gray">Amount</small>
                        <div className="flex items-center gap-x-2 py-1">
                            <div onClick={tenDollarOnClick} className="w-[33%] bg-very-light-gray dark:bg-extremely-dark-gray text-center text-secondary dark:text-primary rounded-sm py-2 font-semibold">$10</div>
                            <div onClick={hundredDollarOnClick} className="w-[33%] bg-very-light-gray dark:bg-extremely-dark-gray text-center text-secondary dark:text-primary rounded-sm py-2 font-semibold">$100</div>
                            <input onFocus={inputAmountOnFocus} type="number" className="amountInput w-[33%] bg-very-light-gray dark:bg-extremely-dark-gray text-center text-secondary dark:text-primary rounded-sm py-2 font-semibold px-2 outline-none" placeholder={'$1-1000'} min="1" max="4" onChange={enforceMinMax} />
                        </div>
                    </div>
                    <div className="py-4 border-b border-b-light-gray dark:border-b-dark-gray">
                        <small className="text-medium-gray">Token</small>
                        <div className="drop-down py-1">
                            <div onClick={() => setIsTokenModalVisible(true)} className="tooltip-tokens-trigger px-2 py-3 flex items-center justify-between border border-very-light-gray dark:border-extremely-dark-gray rounded-sm bg-very-light-gray dark:bg-extremely-dark-gray text-secondary dark:text-primary">
                                {getCoinInfo()}
                                <IconContext value={{ className: 'text-medium-gray text-xs' }}>
                                    <FaAngleRight />
                                </IconContext>
                            </div>
                        </div>
                    </div>
                    <button onClick={requestCrypto} className="request-btn py-3 mt-4 text-center text-primary dark:text-secondary bg-secondary dark:bg-primary font-semibold border border-secondary dark:border-primary w-full rounded-sm">{setText()}</button>
                </div>
            </div>
            <AnimatePresence>
                {isTokenModalVisible && <SelectToken position={position} setIsTokenModalVisible={setIsTokenModalVisible} setAlertFailure={setAlertFailure} setKey={setKey} />}
                {alertFailure.visible && <AlertFailure msg={alertFailure.msg} />}
                {alertSuccess.visible && <AlertSuccess msg={alertSuccess.msg} />}
            </AnimatePresence>
        </div>
    )
}

export function CryptoRequestsModal({ disableCryptoRequestsModal }) {
    const { isDark } = useContext(ThemeContext);
    const [position, setPosition] = useState({});
    const [alertFailure, setAlertFailure] = useState({ visible: false, msg: '' });
    const [alertSuccess, setAlertSuccess] = useState({ visible: false, msg: '', check: false });
    const { selectedChat } = useContext(SelectedChatContext);
    const { cryptoRequests, setCryptoRequests } = useContext(CryptoRequestsContext);

    useEffect(() => {
        // Removes failure alert notification after 3 seconds;
        let id;
        if (alertFailure.visible) {
            id = setTimeout(() => setAlertFailure({ visible: false, msg: '' }), 3000)
        }

        return () => id && clearTimeout(id);
    }, [alertFailure.visible])

    useEffect(() => {
        // Removes success alert notification after 3 seconds;
        if (alertSuccess.visible) {
            setTimeout(() => setAlertSuccess({ visible: false, msg: '', check: false }), 3000)
        }
    }, [alertSuccess.visible])

    useEffect(() => {
        async function animateModal() {
            const backdrop = document.querySelector('.backdrop');
            const modalContainer = document.querySelector('.crypto-requests-modal-container');
            await animate(backdrop, { height: '100vh' }, { duration: 0.3 });
            await animate(modalContainer, { translateY: 0 }, { duration: 1, type: 'spring', bounce: 0.3 })
        }
        animateModal();
    }, [])

    async function closeAnimation() {
        async function exitAnimateModal() {
            const backdrop = document.querySelector('.backdrop');
            const modalContainer = document.querySelector('.crypto-requests-modal-container');
            await animate(modalContainer, { translateY: '100vh' }, { duration: 0.6, type: 'spring', bounce: 0.3 })
            await animate(backdrop, { height: 0 }, { duration: 0.2 });
        }
        await exitAnimateModal();
        disableCryptoRequestsModal();
    }

    function calculateModalPosition() {
        const modal = document.querySelector('.crypto-requests-modal-container');

        const position = {
            top: (window.innerHeight / 2) - (modal.clientHeight / 2),
            left: (window.innerWidth / 2) - (modal.clientWidth / 2)
        }
        setPosition(position);
    }

    useLayoutEffect(() => calculateModalPosition(), [])

    useLayoutEffect(() => {
        document.body.classList.add('overflow-hidden');
        return () => document.body.classList.remove('overflow-hidden');
    }, [])

    function CryptoRequest({ amount, symbol, id, date, last }) {
        const [isDeclineSpinnerVisible, setIsDeclineSpinnerVisible] = useState(false);
        const [isAcceptSpinnerVisible, setIsAcceptSpinnerVisible] = useState(false);

        async function declineRequest(e, id) {
            try {
                e.target.disabled = true;
                setIsDeclineSpinnerVisible(true);
                const response = await fetch('/app/decline', {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: id })
                })
                const data = await response.json();
                if (!data.success) {
                    throw data.errorMessage;
                }
                const newCryptoRequest = cryptoRequests.filter(c => c._id !== id);
                setCryptoRequests(newCryptoRequest);
            } catch (error) {
                e.target.disabled = false;
                setIsDeclineSpinnerVisible(false);
                console.error(error);
                setAlertFailure({ visible: true, msg: error });
            }
        }

        async function acceptRequest(e, id) {
            let price;
            try {
                e.target.disabled = true;
                setIsAcceptSpinnerVisible(true);

                // Check if browser has window.ethereum
                if (!window.ethereum) {
                    throw 'Failed to detect provider'
                }

                // Verify request
                const tokenInfo = cryptoRequests.find(c => c._id === id);
                const promisesArray = [
                    fetch('/app/verify-request', {
                        method: 'POST',
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id: id })
                    }),
                    fetch('/app/price', {
                        method: 'POST',
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ symbol: tokenInfo.symbol })
                    })
                ]
                const responses = await Promise.all(promisesArray);
                const datas = await Promise.all([responses[0].json(), responses[1].json()]);
                datas.forEach(d => {
                    if (!d.success) {
                        throw d.errorMessage;
                    }
                    if (d.price) {
                        price = d.price;
                    }
                })

                console.log('Yeesss');

                // Get signer and sign tx
                let amount = `${(tokenInfo.amount / price).toFixed(tokenInfo.decimal)}`;
                const amountToWei = parseUnits(amount, tokenInfo.decimal);
                if (modal.getChainId() !== tokenInfo.chainId) {
                    console.log(tokenInfo.chainId);
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: tokenInfo.chainId === 56 ? '0x38' : '0xaa36a7' }]
                    })
                }
                const signer = await new BrowserProvider(window.ethereum).getSigner();
                const tokenContract = tokenInfo.contractAddress ? new ethers.Contract(tokenInfo.contractAddress, abi, signer) : null;
                if (tokenContract) {
                    // Call contract's transfer function
                    const tx = await tokenContract.transfer(tokenInfo.recipient, amountToWei);
                    tx.wait()
                        .then(() => {
                            setAlertSuccess({ visible: true, msg: 'Transaction complete', check: true });
                        })
                        .catch(e => {
                            console.error(e);
                        })
                } else {
                    // Native blockchain token tx
                    const tx = await signer.sendTransaction({
                        to: tokenInfo.recipient,
                        value: amountToWei
                    })
                    tx.wait()
                        .then(() => {
                            setAlertSuccess({ visible: true, msg: 'Transaction complete', check: true });
                        })
                        .catch(e => {
                            console.error(e);
                        })
                }
                const updatedCryptoRequests = cryptoRequests.filter(c => c._id !== id);
                setCryptoRequests(updatedCryptoRequests);
                // Delete cryptoRequest from db
                const response = await fetch('/app/decline', {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: id })
                })
                const data = await response.json();
                if (!data.success) {
                    setAlertFailure({ visible: true, msg: 'Failed to delete crypto request' });
                }
            } catch (error) {
                e.target.disabled = false;
                setIsAcceptSpinnerVisible(false);
                setAlertFailure({ visible: true, msg: typeof error === 'string' ? error : 'An unexpected error occurred' });
                console.error(error);
            }
        }

        function getDeclineSpinner() {
            if (isDeclineSpinnerVisible) {
                return isDark ? <SpinnerLight /> : <SpinnerDark />
            } else {
                return <span>Decline</span>
            }
        }

        function getAcceptSpinner() {
            if (isAcceptSpinnerVisible) {
                return isDark ? <SpinnerDark /> : <SpinnerLight />
            } else {
                return <span>Accept</span>
            }
        }

        return (
            <div id={id} className={`py-4 ${last ? '' : 'border-b border-b-light-gray dark:border-b-dark-gray'}`}>
                <div className="flex items-center justify-between pb-1">
                    <small className="dark:text-light-gray text-dark-gray">Send ${amount} {symbol}</small>
                    <small className="dark:text-light-gray text-dark-gray">{`${date.getDate()}/${date.getMonth() + 1}/${date.getYear()}`}</small>
                </div>
                <div className="flex justify-between pt-1">
                    <button onClick={(e) => { declineRequest(e, id) }} className="w-[30%] sm:w-[25%] py-2 font-semibold rounded-sm bg-primary text-secondary dark:bg-secondary dark:text-primary border flex items-center justify-center">{getDeclineSpinner()}</button>
                    <button onClick={(e) => { acceptRequest(e, id) }} className="w-[30%] sm:w-[25%] py-2 font-semibold rounded-sm bg-secondary text-primary dark:bg-primary dark:text-secondary border">{getAcceptSpinner()}</button>
                </div>
            </div>
        )
    }

    function renderCryptoRequests() {
        // Filter crypto requests from user;
        const requests = cryptoRequests.filter(c => c.recipient === selectedChat.address);
        if (requests.length > 0) {
            return requests.map((r) => {
                return <CryptoRequest key={r._id} amount={r.amount} symbol={r.symbol} id={r._id} date={new Date(r.date)} last={r._id === requests[requests.length - 1]._id ? true : false} />
            })
        } else {
            return <div className="text-secondary dark:text-primary text-center py-4">No new crypto requests</div>
        }
    }

    return (
        <div>
            <Backdrop />
            <div>
                <div className={`crypto-requests-modal-container bg-primary dark:bg-secondary w-[95%] sm:w-[75%] lg:w-[50vw] max-h-[80vh] overflow-auto border border-very-light-gray dark:border-dark-gray shadow shadow-md rounded-md z-150 p-4 sm:p-8`} style={{ position: 'fixed', top: `${position.top}px`, left: `${position.left}px`, transform: 'translateY(100vh)', scrollbarWidth: 'none' }}>
                    <div className="pt-2">
                        <h2 className="font-bold text-lg text-secondary dark:text-primary text-center">Crypto Requests</h2>
                        <div className="io-close-circle absolute right-4 top-4" onClick={closeAnimation}>
                            <IconContext value={{ className: 'size-6 text-secondary dark:text-primary' }}>
                                <IoCloseCircle />
                            </IconContext>
                        </div>
                    </div>
                    <small className="dark:text-light-gray text-center block">View all crypto requests from <span className="text-secondary dark:text-light-gray">{truncateAddress(selectedChat.address)}</span> </small>
                    <div>
                        {renderCryptoRequests()}
                    </div>
                </div>
            </div>
            <AnimatePresence>
                {alertFailure.visible && <AlertFailure msg={alertFailure.msg} />}
                {alertSuccess.visible && <AlertSuccess msg={alertSuccess.msg} check={alertSuccess.check} />}
            </AnimatePresence>
        </div>
    )
}