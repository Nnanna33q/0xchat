import Moon from "../assets/svgs/moon"
import Sun from "../assets/svgs/sun"
import { useContext } from "react";
import { ThemeContext } from "../contexts/themeContext";
import { useEffect, useRef } from "react";
import { animate } from "motion/react";

export default function DarkMode() {
    const darkModeRef = useRef(null);

    useEffect(() => {
        animate(darkModeRef.current, { translateY: window.innerWidth < 640 ? '80vh' : '85vh' }, { duration: 1, type: 'spring', bounce: 0.6 })
    }, [])

    const { isDark, setIsDark } = useContext(ThemeContext);

    const toggleDarkMode = () => {
        const dark = localStorage.getItem('dark');
        if (dark) {
            setIsDark(false);
            localStorage.setItem('dark', '');
            const words = document.querySelectorAll('.card-words');
            words.forEach(w => {
                animate(w, { color: '#000000'});
            })
            animate(darkModeRef.current, { translateX: ['200px', 0] });
        } else {
            setIsDark(true);
            localStorage.setItem('dark', 'true');
            const words = document.querySelectorAll('.card-words');
            words.forEach(w => {
                animate(w, { color: '#ffffff' });
            })
            
            animate(darkModeRef.current, { translateX: ['200px', 0] });
        }
    }

    return (
        <div ref={darkModeRef} className='fixed top-[0vh] left-[75vw] sm:left-[85vw] lg:left-[90vw] bg-secondary text-primary size-15 rounded-full z-49' onClick={toggleDarkMode}>
                {isDark ? <Sun /> : <Moon />}
        </div>
    )
}