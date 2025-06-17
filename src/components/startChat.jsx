import { IconContext } from "react-icons/lib";
import { GoPlus } from "react-icons/go";
import { ThemeContext } from "../contexts/themeContext";
import { useContext, useState, useLayoutEffect } from "react";

export default function StartChat({ enableModal }) {
    const [rightDimension, setRight] = useState(null);
    const { isDark } = useContext(ThemeContext);

    useLayoutEffect(() => {
        const sideChatLeftDimension = document.querySelector('.side-chats-left').getBoundingClientRect().right;
        const startChatWidth = document.querySelector('.start-chat').clientWidth;
        setRight(sideChatLeftDimension - startChatWidth - 16);
    }, [])

    return (
        <div onClick={enableModal} style={{ position: 'fixed', bottom: '10vh', left: `${rightDimension}px`}} className={`start-chat lg:hidden flex items-center justify-center bg-secondary dark:bg-primary size-12 rounded-full z-49`}>
            <IconContext value={{ className: `${isDark ? 'text-secondary' : 'text-primary' } size-7`}}>
                <GoPlus />
            </IconContext>
        </div>
    )
}