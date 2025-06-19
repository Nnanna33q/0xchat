import Header from './header';
import { animate, stagger, motion, useInView } from "motion/react";
import { ThemeContext } from '../contexts/themeContext';
import { useContext, useEffect, useRef } from 'react';

export default function Hero() {
  const { isDark } = useContext(ThemeContext);
  const heroHeaderRef = useRef(null);
  const isH1InView = useInView(heroHeaderRef, { once: true })

  useEffect(() => {
    if(isH1InView) {
      const animateHeroHeading = () => {
        animate('.animate-h1', { translateY: 0,  opacity: [0, 1] }, { delay: stagger(0.05) })
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
            <h1 ref={heroHeaderRef} className="hero-header text-5xl font-semibold tracking-tight text-balance text-secondary dark:text-primary sm:text-7xl">
              <div><span className="animate-h1">U</span><span className="animate-h1">n</span><span className="animate-h1">c</span><span className="animate-h1">e</span><span className="animate-h1">n</span><span className="animate-h1">s</span><span className="animate-h1">o</span><span className="animate-h1">r</span><span className="animate-h1">a</span><span className="animate-h1">b</span><span className="animate-h1">l</span><span className="animate-h1">e</span><span className="animate-h1 invisible">-</span></div>
              <div><span className="animate-h1">W</span><span className="animate-h1">e</span><span className="animate-h1">b</span><span className="animate-h1">3</span><span className="animate-h1 invisible">-</span>
              <span className="animate-h1">C</span><span className="animate-h1">h</span><span className="animate-h1">a</span><span className="animate-h1">t</span></div>
            </h1>
            <p className="mt-8 text-lg font-medium text-pretty dark:text-light-gray sm:text-xl/8">
              Control your communication: Decentralized, peer-to-peer messaging puts you in charge.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <motion.a href="/" className="font-semibold text-secondary hover:text-primary dark:text-primary dark:hover:text-secondary rounded-full w-[40%] py-2.5 border" style={{ backgroundImage: `linear-gradient(to right, ${isDark ? 'white 0%, black 0%' : 'black 0%, white 0%'})` }} whileHover={{ backgroundImage: `linear-gradient(to right, ${isDark ? 'white 100%, black 0%' : 'black 100%, white 0%'}` }}>
                Learn More <span aria-hidden="true">→</span>
              </motion.a>
              <motion.a
                style={{backgroundImage: `linear-gradient(to right, ${isDark ? 'black 0%, white 0%' : 'white 0%, black 0%'})`}}
                whileHover={{ backgroundImage: `linear-gradient(to right, ${isDark ? 'black 100%, white 0%' : 'white 100%, black 0%'})`}}
                href="/app/chats"
                className="w-[40%] rounded-full text-primary hover:text-secondary dark:text-secondary dark:hover:text-primary py-2.5 font-semibold shadow-xs border focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Launch App
              </motion.a>
            </div>
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
