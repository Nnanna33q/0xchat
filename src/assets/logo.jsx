import { useContext, useEffect } from "react";
import { ThemeContext } from "../contexts/themeContext";
import { animate } from "motion/react"
import { useRef } from "react";

export default function Logo({ animateLogo }) {
    const { isDark } = useContext(ThemeContext);
    const logoRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
        if(animateLogo) {
            const animateLogoAndText = async () => {
                await animate(logoRef.current, { pathLength: [0, 1] }, { duration: 1 });
                await animate(textRef.current, { opacity: [0, 1] }, { duration: 0.5 });
            }
            animateLogoAndText();
        }
    }, [])

    return (
        <svg width="75" viewBox="25 0 250 170" className="dark:text-secondary text-primary" xmlns="http://www.w3.org/2000/svg"><path ref={logoRef} d="M30 40 a10 10 0 0 1 10 -10 h120 a10 10 0 0 1 10 10 v80 a10 10 0 0 1 -10 10 h-90 l-20 20 v-20 h-10 a10 10 0 0 1 -10 -10 z" fill={isDark ? 'black' : 'white'} stroke={isDark ? 'white' : 'black' } strokeWidth="5" /><text ref={textRef} x="100" y="100" textAnchor="middle" fontFamily="inter, Public Sans, sans-serif" fontSize="56" fill={ isDark ? 'white' : 'black' } fontWeight={500} opacity={animateLogo ? 0 : 1}>0x</text></svg>
    )
}