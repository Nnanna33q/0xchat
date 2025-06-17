import { SecureCard, Card } from "./card";
import sayAnythingImgUrl from "../assets/imgs/say-anything.png";
import privacyImgUrl from "../assets/imgs/privacy.jpg";
import connectImgUrl from "../assets/imgs/connect.png";
import encryptionImgUrl from "../assets/imgs/encryption.png";
import { ThemeContext } from "../contexts/themeContext";
import { useContext } from "react";

export default function Features() {
    const { isDark } = useContext(ThemeContext);

    return (
        <div className="features-main text-center lg:px-8">
            <div className="features-intro">
                <h1 className="text-3xl sm:text-4xl font-bold sm:text-4xl lg:text-5xl dark:text-light-gray">Why Use 0xChat?</h1>
                <p className="text-lg dark:text-light-gray font-light text-pretty text-medium-gray sm:text-xl/8 py-4 sm:py-8">Find out why 0xChat is your choice for simple, powerful, and secure messaging</p>
            </div>
            <div className="features">
                <SecureCard />
                <div className="grid md:grid-cols-2 bg-very-light-gray dark:bg-extremely-dark-gray py-8 px-4">
                    <Card imgUrl={sayAnythingImgUrl} cardHeading={'Speak Freely'} cardContent={`Share your thoughts, feelings, and ideas without reservation. This is your space to connect openly`} icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -3 24 24" fill="currentColor" className="size-6 dark:text-light-gray">
                        <path fillRule="evenodd" d="M12 2.25c-2.429 0-4.817.178-7.152.521C2.87 3.061 1.5 4.795 1.5 6.741v6.018c0 1.946 1.37 3.68 3.348 3.97.877.129 1.761.234 2.652.316V21a.75.75 0 0 0 1.28.53l4.184-4.183a.39.39 0 0 1 .266-.112c2.006-.05 3.982-.22 5.922-.506 1.978-.29 3.348-2.023 3.348-3.97V6.741c0-1.947-1.37-3.68-3.348-3.97A49.145 49.145 0 0 0 12 2.25ZM8.25 8.625a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Zm2.625 1.125a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875-1.125a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z" clipRule="evenodd" />
                    </svg>
                    } id={1} isDark={isDark} />
                    <Card imgUrl={privacyImgUrl} cardHeading={'Lasting Privacy'} cardContent={`Built for the long term, ensuring your personal information stays protected, always`} icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 dark:text-light-gray">
                        <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
                    </svg>} id={2} isDark={isDark} />
                    <Card imgUrl={connectImgUrl} cardHeading={'Wallet Connect'} cardContent={`Securely access the app using your existing crypto wallet. No new accounts needed`} icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 dark:text-light-gray">
                        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                    </svg>
                    } id={3} isDark={isDark}/>
                    <Card imgUrl={encryptionImgUrl} cardHeading={'User Encrypted'} cardContent={`Messages are encrypted on the sender's device and can only be decrypted by the intended recipient(s)`} icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 dark:text-light-gray">
                        <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Zm3.094 8.016a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                    </svg>
                    } id={4} isDark={isDark} />
                </div>
            </div>
        </div>
    )
}
