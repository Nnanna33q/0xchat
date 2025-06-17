import conversationPng from "../assets/imgs/conversation.png";
import { animate, stagger } from "motion/react";
import { useEffect, useRef, useState } from "react";

export function SecureCard() {
    const imgRef = useRef(null);
    const shareContainerRef = useRef(null);
    const sharePRef = useRef(null);
    const cardBodyRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(async e => {
                if (e.isIntersecting) {
                    await animate(e.target, { scale: [0, 1] }, { duration: 1, type: 'spring', bounce: 0.6 });
                    observer.disconnect();
                }
            })
        })

        observer.observe(imgRef.current);

        return () => observer.disconnect();

    }, [])

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(async e => {
                if(e.isIntersecting) {
                    await animate('.share', { opacity: 1 }, { delay: stagger(0.05), duration: 0.5 });
                    observer.disconnect();
                }
            })
        })

        observer.observe(shareContainerRef.current);

        return () => observer.disconnect();
    }, [])

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if(e.isIntersecting) {
                    animate(sharePRef.current, { translate: 0 }, { duration: 0.7, type: 'spring', bounce: 0.3 });
                }
            })
        }, { threshold: 0.8 })

        observer.observe(cardBodyRef.current);

        return () => observer.disconnect();
    }, [])

    return (
        <div className="card-share sm:flex sm:p-4 pb-8 sm:pb-24 items-center justify-between card w-full rounded-sm overflow-hidden">
            <img ref={imgRef} src={conversationPng} alt="Secure Conversation" className="size-96 lg:size-[50%]" />
            <div ref={cardBodyRef} className="card-body sm:p-4 pb-10">
                <h1 ref={shareContainerRef} className="card-heading sm:text-start text-dark-gray dark:text-light-gray text-3xl sm:text-4xl font-bold pb-4 pt-4 sm:pt-0 text-pretty lg:text-5xl"><span className="share">S</span><span className="share">h</span><span className="share">a</span><span className="share">r</span><span className="share">e</span><span className="share invisible">i</span><span className="share">S</span><span className="share">e</span><span className="share">c</span><span className="share">u</span><span className="share">r</span><span className="share">e</span><span className="share">l</span><span className="share">y</span></h1>
                <p ref={sharePRef} className="card-content text-medium-gray dark:text-light-gray text-center sm:text-start font-extralight sm:text-lg text-pretty lg:text-xl translate-y-24 translate-x-0 sm:translate-y-0">Experience secure sharing powered by robust encryption and privacy-focused design. Your data stays yours, shared only with who you intend.</p>
            </div>
        </div>
    )
}

export function Card({ imgUrl, cardHeading, cardContent, icon, id, isDark }) {
    const [words, setWords] = useState(cardContent.split(' '));
    const cardRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(async e => {
                if(e.isIntersecting) {
                    await animate(`.card-words${id}`, { color: isDark ? '#ffffff' : '#000000' }, { delay: stagger(0.05), duration: 0.5 });
                    observer.disconnect();
                }
            })
        }, { threshold: 1 })

        observer.observe(cardRef.current);

        return () => observer.disconnect();

    }, []);

    return (
        <div ref={cardRef} className="sm:flex sm:p-4 items-center justify-between card w-full bg-very-light-gray dark:bg-extremely-dark-gray my-8 sm:px-8 sm:py-4 md:col-span-1">
            <div className="bg-primary dark:bg-secondary rounded-xl shadow shadow-lg dark:shadow-extremely-dark-gray">
                <img src={imgUrl} alt="Secure Conversation" className="w-56 p-8 mx-auto lg:size-full" />
                <div className="card-body p-8 pt-0">
                    <div className="flex justify-center items-center">
                        {icon}
                        <h1 className="card-heading text-secondary dark:text-light-gray text-2xl sm:text-2xl lg:text-3xl font-extrabold text-pretty pl-2">{cardHeading}</h1>
                    </div>
                    <p className="card-content pt-2 lg:pt-2 text-center font-light lg:font-light sm:text-base/6 text-pretty">
                        {words.map((w, i) => <span key={i} className={`card-words card-words${id} text-lg text-light-gray dark:text-dark-gray`}>{`${w} `}</span>)}
                    </p>
                </div>
            </div>
        </div>
    )
}