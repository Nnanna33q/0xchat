import { ThemeContext } from "../contexts/themeContext";
import { useContext } from "react";

export default function Spinner() {
    const { isDark } = useContext(ThemeContext);
    
    return (
        <span className={`loader border-3 ${isDark ? 'border-b-primary border-t-primary border-l-primary' : 'border-b-secondary border-t-secondary border-l-secondary' }`}></span>
    )
}

export function SpinnerLight() {
    return (
        <span className='loader border-3 border-b-primary border-t-primary border-l-primary border-r-secondary'></span>
    )
}

export function SpinnerDark() {
    return (
        <span className='loader border-3 border-b-secondary border-t-secondary border-l-secondary border-r-primary'></span>
    )
}


export function MessageSpinner() {
    const { isDark } = useContext(ThemeContext);
    
    return (
        <span className={`message-loader border-1 ${isDark ? 'border-b-secondary border-t-secondary border-l-secondary' : 'border-b-primary border-t-primary border-l-primary' }`}></span>
    )
}