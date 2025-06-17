import { useEffect, useRef } from "react";
import { animate } from "motion/react";

export default function Stats() {
    const stats12Ref = useRef(null);
    const stats8Ref = useRef(null);
    const stats10Ref = useRef(null);
    const stats15Ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(async e => {
                if(e.isIntersecting) {
                    await animate(0, 12000, { delay: 0.5, duration: 2, onUpdate: (latest) => {
                        stats12Ref.current.innerText = `${latest.toFixed(0)}+`;
                    }})
                    observer.disconnect();
                }
            })
        })

        observer.observe(stats12Ref.current);

        return () => observer.disconnect();

    }, [])

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(async e => {
                if(e.isIntersecting) {
                    await animate(0, 800, { delay: 0.5, duration: 1.5, onUpdate: (latest) => {
                        stats8Ref.current.innerText = `${latest.toFixed(0)}+`;
                    }})
                    observer.disconnect();
                }
            })
        })

        observer.observe(stats8Ref.current);

        return () => observer.disconnect();

    }, [])

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(async e => {
                if(e.isIntersecting) {
                    await animate(0, 10, { delay: 0.5, duration: 1, onUpdate: (latest) => {
                        stats10Ref.current.innerText = `$${latest.toFixed(0)}M+`;
                    }})
                    observer.disconnect();
                }
            })
        })

        observer.observe(stats10Ref.current);

        return () => observer.disconnect();

    }, [])

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(async e => {
                if(e.isIntersecting) {
                    await animate(0, 15, { delay: 0.5, duration: 1, onUpdate: (latest) => {
                        stats15Ref.current.innerText = `${latest.toFixed(0)}+`;
                    }})
                    observer.disconnect();
                }
            })
        })

        observer.observe(stats15Ref.current);

        return () => observer.disconnect();

    }, [])

    return (
        <div className="px-6">
            <div className="text-center ">
                <h1 className="text-secondary text-3xl font-semibold dark:text-light-gray">Trusted By Creators Worldwide</h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 rounded-lg gap-1 mt-10 sm:mt-15">
                <div className="rounded-tr-lg rounded-tl-lg sm:rounded-tl-lg bg-extremely-light-gray dark:bg-extremely-dark-gray p-10 text-center">
                    <div ref={stats12Ref} className="numbers-animate text-3xl font-semibold dark:text-very-light-gray">0+</div>
                    <div className="text-sm font-light dark:text-light-gray">Connected wallets</div>
                </div>
                <div className="sm:rounded-tr-lg bg-extremely-light-gray dark:bg-extremely-dark-gray p-10 text-center">
                    <div ref={stats8Ref} className="numbers-animate text-3xl font-semibold dark:text-very-light-gray">0+</div>
                    <div className="text-sm font-light dark:text-light-gray">Daily active users</div>
                </div>
                <div className="sm:rounded-bl-lg bg-extremely-light-gray dark:bg-extremely-dark-gray p-10 text-center">
                    <div ref={stats10Ref} className="numbers-animate text-3xl font-semibold dark:text-very-light-gray">$0M</div>
                    <div className="text-sm font-light dark:text-light-gray">Total funds raised</div>
                </div>
                <div className="rounded-bl-lg rounded-br-lg sm:rounded-br-lg bg-extremely-light-gray dark:bg-extremely-dark-gray p-10 text-center">
                    <div ref={stats15Ref} className="numbers-animate text-3xl font-semibold dark:text-very-light-gray">0+</div>
                    <div className="text-sm font-light dark:text-light-gray">0xChat funding partners</div>
                </div>
            </div>
        </div>
    )
}