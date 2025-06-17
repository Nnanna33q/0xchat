import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import Hero from "../components/hero";
import Features from "../components/features";
import Carousel from "../components/carousel";
import Stats from "../components/stats";
import Footer from "../components/footer";
import DarkMode from "../components/darkMode";
import { useState, createContext } from "react";
import { ThemeContext } from "../contexts/themeContext";

// export const ThemeContext = createContext(null);


export function Main() {
    const [isDark, setIsDark] = useState(localStorage.getItem('dark') ? true : false);

    useEffect(() => {
        if (isDark) {
            document.body.classList.add('dark')
        } else {
            document.body.classList.remove('dark')
        }
    }, [isDark])

    return (
        <ThemeContext.Provider value={{ isDark, setIsDark }}>
            <div className={`${isDark && 'dark'} dark:bg-secondary dark:text-primary relative`}>
                <Hero />
                <Features />
                <Carousel />
                <Stats />
                <Footer />
                <DarkMode />
            </div>
        </ThemeContext.Provider>
    )
}

const root = createRoot(document.querySelector('#root'));
root.render(<Main />);