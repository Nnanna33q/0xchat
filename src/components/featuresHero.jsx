import Header from "./header";
import { useRef, useEffect } from "react";
import { animate, useInView, stagger } from "motion/react";

export default function FeaturesHero() {
    const heroHeaderRef = useRef(null);
    const isH1InView = useInView(heroHeaderRef, { once: true });

    useEffect(() => {
        if (isH1InView) {
            const animateHeroHeading = () => {
                animate('.animate-h1', { translateY: 0, opacity: [0, 1] }, { delay: stagger(0.05) })
            }
            animateHeroHeading();
        }
    }, [isH1InView])

    return (
        <div className="bg-primary dark:bg-secondary">
            <Header />

            <div className="relative isolate px-4 pt-14 lg:px-8">
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                >
                </div>
                <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
                    <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                        <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-600 dark:text-very-light-gray ring-1 ring-light-gray hover:ring-medium-gray bg-primary dark:bg-secondary">
                            Announcing our next round of funding.{' '}
                            <a href="#" className="font-bold text-secondary dark:text-primary">
                                <span aria-hidden="true" className="absolute inset-0" />
                                Read more <span aria-hidden="true">&rarr;</span>
                            </a>
                        </div>
                    </div>
                    <div className="text-center">
                        <h1 ref={heroHeaderRef} className="hero-header text-4xl font-semibold tracking-tight text-balance text-secondary dark:text-primary sm:text-7xl">
                            <span className="animate-h1">0</span><span className="animate-h1">x</span><span className="animate-h1">C</span><span className="animate-h1">h</span><span className="animate-h1">a</span><span className="animate-h1">t</span><span className="animate-h1 invisible">-</span><span className="animate-h1">F</span><span className="animate-h1">e</span><span className="animate-h1">a</span><span className="animate-h1">t</span><span className="animate-h1">u</span><span className="animate-h1">r</span>
                            <span className="animate-h1">e</span><span className="animate-h1">s</span>
                        </h1>
                        <p className="mt-8 text-lg font-medium text-pretty dark:text-light-gray sm:text-xl/8">
                            Discover the privacy-focused 0xChat features, built with end-to-end encryption at its core.
                        </p>
                    </div>
                </div>
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
                >
                </div>
            </div>
        </div>
    )
}