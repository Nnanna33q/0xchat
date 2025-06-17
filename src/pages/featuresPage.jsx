import { StrictMode, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import Features from "../components/features";
import Carousel from "../components/carousel";
import Stats from "../components/stats";
import Footer from "../components/footer";
import DarkMode from "../components/darkMode";
import FeaturesHero from "../components/featuresHero";
import { ThemeContext } from "../contexts/themeContext";

function FeaturesPage() {
    const [isDark, setIsDark] = useState(localStorage.getItem('dark') ? true : false);

    useEffect(() => {
        isDark ? document.body.classList.add('dark') : document.body.classList.remove('dark');
    }, [isDark]);

    return (
        <ThemeContext.Provider value={{ isDark, setIsDark }}>
            <div className={`${isDark && 'dark' } dark:bg-secondary dark:text-primary`}>
                <FeaturesHero />
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
root.render(
    <StrictMode>
        <FeaturesPage />
    </StrictMode>
)