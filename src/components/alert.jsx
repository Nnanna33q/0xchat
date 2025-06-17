import { IoIosWarning } from "react-icons/io";
import { MdOutlineMarkUnreadChatAlt } from "react-icons/md";
import { FaWifi } from "react-icons/fa";
import { IconContext } from "react-icons/lib";
import { useContext } from "react";
import { ThemeContext } from "../contexts/themeContext";
import { motion } from "motion/react";
import { truncateAddress } from "../utils/truncate";
import { FaCheck } from "react-icons/fa";
import { GiReceiveMoney } from "react-icons/gi";

export function AlertSuccess({ msg, check }) {
    const { isDark } = useContext(ThemeContext);

    return (
        <motion.div
            initial={{ transform: 'translateX(-100%)' }}
            animate={{ transform: 'translateX(0)' }}
            exit={{ transform: 'translateX(100%)' }}
            className="flex justify-center fixed top-5 z-200 w-full">
            <div className={`border border-success text-success w-[95%] lg:w-[50%] flex items-center p-2 sm:p-4 rounded-md mx-auto shadow-sm ${isDark ? 'bg-success-dark' : 'bg-success-light'}`}>
                <div className="flex items-center">
                    <IconContext value={{ className: "size-5" }}>
                        { check ? <FaCheck /> : <FaWifi /> }
                    </IconContext>
                    <span className='pl-2'>{msg}</span>
                </div>
            </div>
        </motion.div>
    )
}

export function AlertFailure({ msg }) {
    const { isDark } = useContext(ThemeContext);

    return (
        <motion.div
            initial={{ transform: 'translateX(-100%)' }}
            animate={{ transform: 'translateX(0)' }}
            exit={{ transform: 'translateX(100%)' }}
            className="flex justify-center fixed top-5 z-200 w-full">
            <div className={`border border-danger text-danger w-[95%] lg:w-[50%] flex items-center p-2 sm:p-4 rounded-md mx-auto shadow-sm ${isDark ? 'bg-danger-dark' : 'bg-danger-light'}`}>
                <div className="flex items-center">
                    <IconContext value={{ className: "size-5" }}>
                        <IoIosWarning />
                    </IconContext>
                    <span className='pl-2'>{msg}</span>
                </div>
            </div>
        </motion.div>
    )
}

export function AlertMessage({ address }) {
    const { isDark } = useContext(ThemeContext);

    return (
        <motion.div
            initial={{ transform: 'translateX(-100%)' }}
            animate={{ transform: 'translateX(0)' }}
            exit={{ transform: 'translateX(100%)' }}
            className="alert-message flex justify-center fixed top-5 z-200 w-full">
            <div className={`border border-message text-message w-[95%] lg:w-[50%] flex items-center p-2 sm:p-4 rounded-md mx-auto shadow-sm ${isDark ? 'bg-message-dark' : 'bg-message-light'}`}>
                <div className="flex items-center">
                    <IconContext value={{ className: "size-5" }}>
                        <MdOutlineMarkUnreadChatAlt />
                    </IconContext>
                    <span className='pl-2'>{`New message from ${truncateAddress(address)}`}</span>
                </div>
            </div>
        </motion.div>
    )
}

export function AlertCryptoRequest({ address, value, tokenName }) {
    const { isDark } = useContext(ThemeContext);

    return (
        <motion.div
            initial={{ transform: 'translateX(-100%)' }}
            animate={{ transform: 'translateX(0)' }}
            exit={{ transform: 'translateX(100%)' }}
            className="alert-message flex justify-center fixed top-5 z-200 w-full">
            <div className={`border border-message text-message w-[95%] lg:w-[50%] flex items-center p-2 sm:p-4 rounded-md mx-auto shadow-sm ${isDark ? 'bg-message-dark' : 'bg-message-light'}`}>
                <div className="flex items-center">
                    <IconContext value={{ className: "size-5" }}>
                        <GiReceiveMoney />
                    </IconContext>
                    <span className='pl-2'>{`${truncateAddress(address)} is requesting for $${value} ${tokenName}`}</span>
                </div>
            </div>
        </motion.div>
    )
}