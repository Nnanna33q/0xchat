import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { ThemeContext } from "../contexts/themeContext";
import Header from "../components/header";
import { useEffect, useState, useRef } from "react";
import { animate, useInView, stagger, AnimatePresence } from "motion/react";
import DarkMode from "../components/darkMode";
import { modal } from "../modal";
import { BrowserProvider } from "ethers";
import { SiweMessage } from "siwe";
import { AlertSuccess, AlertFailure } from "../components/alert";
import Spinner from "../components/spinner";
import { animateButtonStart, animateButtonEnd } from "../utils/animateButton";

function Connect() {
    const [isDark, setIsDark] = useState(localStorage.getItem('dark') ? true : false);
    const heroHeaderRef = useRef(null);
    const isH1InView = useInView(heroHeaderRef, { once: true });
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [alertSuccess, setAlertSuccess] = useState({ visible: false, msg: '' });
    const [alertFailure, setAlertFailure] = useState({ visible: false, msg: '' });
    const [isLoading, setIsLoading] = useState(false);
    const buttonRef = useRef(null);

    useEffect(() => {
        if (alertFailure.visible) {
            setTimeout(() => {
                setAlertFailure({ visible: false, msg: '' });
            }, 3000)
        }
    }, [alertFailure.visible])

    useEffect(() => {
        if (alertSuccess.visible) {
            setTimeout(() => {
                setAlertSuccess({ visible: false, msg: '' });
            }, 3000)
        }
    }, [alertSuccess.visible])

    useEffect(() => {
        if (isH1InView) {
            const animateHeroHeading = () => {
                animate('.animate-h1', { translateY: 0, opacity: [0, 1] }, { delay: stagger(0.05) })
            }
            animateHeroHeading();
        }
    }, [isH1InView])

    useEffect(() => {
        if (isDark) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }, [isDark])

    useEffect(async () => {
        window.addEventListener('online', () => {
            setIsOnline(true);
            setAlertSuccess({ msg: 'Back Online!', visible: true });
            setAlertFailure({ msg: '', visible: false });
        })
        window.addEventListener('offline', () => {
            setIsOnline(false);
            setAlertFailure({ msg: 'Seems like you disconnected :(', visible: true });
            setAlertSuccess({ msg: '', visible: false });
        })

        return async () => {
            window.removeEventListener('online', () => {
                setIsOnline(true);
            })

            window.removeEventListener('offline', () => {
                setIsOnline(false);
            })
        }
    }, [])

    async function getNonce() {
        try {
            const response = await fetch('/nonce');
            if (response.ok) {
                const data = await response.json();
                return data.nonce;
            } else {
                throw "Failed to retrieve nonce";
            }
        } catch (e) {
            modal.getIsConnectedState() && await modal.disconnect();
            setAlertFailure({ visible: true, msg: e });
        }
    }

    async function verifyMessage({ message, signature, address }) {
        const response = await fetch('/verify', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message, signature, address })
        })
        const data = await response.json();
        if(!data.success) {
            throw data.errorMessage;
        }
        window.location.href = '/app/chats';
    }

    async function connect(e) {
        try {
            if (isOnline) {
                e.target.disabled = true;
                animateButtonStart(e.target, isDark);
                setIsLoading(true)

                if (modal.getWalletProvider()) {
                    const signer = await new BrowserProvider(modal.getWalletProvider()).getSigner();
                    const message = new SiweMessage({ chainId: modal.getChainId(), statement: 'Sign in to 0xChat', domain: window.location.host, uri: window.location.origin, version: "1", nonce: await getNonce(), address: signer.address }).prepareMessage();
                    const signature = await signer.signMessage(message);
                    await verifyMessage({ message, signature, address: signer.address });
                    e.target.disabled = false;
                    await modal.disconnect();
                    return;
                }

                modal.setThemeMode(isDark ? 'dark' : 'light')
                await modal.open()
                modal.subscribeEvents(async (event) => {
                    if (event.data.event === "CONNECT_SUCCESS") {
                        const signer = await new BrowserProvider(modal.getWalletProvider()).getSigner();
                        const message = new SiweMessage({ chainId: modal.getChainId(), statement: 'Sign in to 0xChat', domain: window.location.host, uri: window.location.origin, version: "1", nonce: await getNonce(), address: signer.address }).prepareMessage();
                        const signature = await signer.signMessage(message)
                        await verifyMessage({ message, signature, address: signer.address });
                        e.target.disabled = false;
                        setIsLoading(false);
                    }

                    if (event.data.event === "MODAL_CLOSE") {
                        setIsLoading(false);
                        animateButtonEnd(e.target, isDark);
                        e.target.disabled = false;
                    }
                })
            } else {
                setAlertFailure({ visible: true, msg: 'No internet connection detected!' });
            }
        } catch (error) {
            console.error(error);
            e.target.disabled = false;
            setIsLoading(false);
            animateButtonEnd(e.target, isDark);
            setAlertFailure({ visible: true, msg: error.code === 'ACTION_REJECTED' ? 'Signing request cancelled' : 'An unexpected error occurred' });
            setAlertSuccess({ visible: false, msg: '' });
        }
    }

    return (
        <ThemeContext.Provider value={{ isDark, setIsDark }}>
            <DarkMode />
            <div className="bg-primary dark:bg-secondary h-[100vh]">
                <Header />

                <div className="relative isolate px-4 pt-14 lg:px-8">
                    <div
                        aria-hidden="true"
                        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                    >
                    </div>
                    <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
                        <div className="text-center">
                            <h1 ref={heroHeaderRef} className="hero-header text-3xl font-semibold tracking-tight text-balance text-secondary dark:text-primary sm:text-5xl">
                                <span className="animate-h1">L</span><span className="animate-h1">o</span><span className="animate-h1">g</span><span className="animate-h1">i</span><span className="animate-h1">n</span><span className="animate-h1 invisible">-</span>
                                <span className="animate-h1">T</span><span className="animate-h1">o</span><span className="animate-h1 invisible">-</span>
                                <span className="animate-h1">0</span><span className="animate-h1">x</span><span className="animate-h1">C</span><span className="animate-h1">h</span><span className="animate-h1">a</span><span className="animate-h1">t</span>
                            </h1>
                            <p className="mt-8 text-lg font-medium text-pretty dark:text-light-gray sm:text-xl/8">
                                Connect with your web3 based wallet and sign-in
                            </p>
                            <div className="mt-10 flex items-center justify-center gap-x-6">
                                <button
                                    ref={buttonRef}
                                    style={{ backgroundImage: isDark ? 'linear-gradient(to right, rgb(0, 0, 0) 0%, rgb(255, 255, 255) 0%)' : 'linear-gradient(rgb(255, 255, 255) 0%, rgb(0, 0, 0) 0%)', borderColor: isDark ? 'rgb(255, 255, 2550' : 'rgb(0, 0, 0)' }}
                                    href="#"
                                    className={`w-[50%] border rounded-full text-primary dark:text-secondary py-2.5 font-semibold shadow-xs border focus-visible:outline-2 focus-visible:outline-offset-2`}
                                    onClick={connect}
                                >
                                    {isLoading ? <Spinner /> : "Connect"}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div
                        aria-hidden="true"
                        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
                    >
                    </div>
                </div>
            </div>
            <AnimatePresence>
                {alertSuccess.visible && <AlertSuccess msg={alertSuccess.msg} />}
                {alertFailure.visible && <AlertFailure msg={alertFailure.msg} />}
            </AnimatePresence>
        </ThemeContext.Provider>
    )
}

const root = createRoot(document.querySelector('#root'));

root.render(
    <StrictMode>
        <Connect />
    </StrictMode>
)