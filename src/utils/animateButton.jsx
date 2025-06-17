import { animate } from "motion/react";

export function animateButtonStart(element, isDark) {
    animate(element, { backgroundImage: isDark ? 'linear-gradient(to right, rgb(0, 0, 0) 100%, rgb(255, 255, 255) 0%)' : 'linear-gradient(to right, rgb(255, 255, 255) 100%, rgb(0, 0, 0) 0%)' })
}

export function animateButtonEnd(element, isDark) {
    animate(element, { backgroundImage: isDark ? 'linear-gradient(to right, rgb(0, 0, 0) 0%, rgb(255, 255, 255) 0%)' : 'linear-gradient(to right, rgb(255, 255, 255) 0%, rgb(0, 0, 0) 0%)' })
}