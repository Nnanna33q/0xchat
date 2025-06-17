import Metamask from "../assets/svgs/metamask";
import TrustWallet from "../assets/svgs/trustwallet";
import Phantom from "../assets/svgs/phantom";
import Safepal from "../assets/svgs/safepal";
import Imtoken from "../assets/svgs/imtoken";
import Rabby from "../assets/svgs/rabby";
import React from "react";
import { useEffect, useRef, useState } from "react";
import { animate } from "motion/react";

const initialWallets = [<div><Metamask /></div>, <div><TrustWallet /></div>, <div><Phantom /></div>, <div className="pl-10 safepal-wal"><Safepal /></div>, <div className="pl-10"><Imtoken /></div>, <div className="pl-7 pr-7"><Rabby /></div>]



export default function Carousel() {
  const [wallets, setWallets] = useState([...initialWallets, ...initialWallets])
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(async (e) => {
        if(e.isIntersecting) {
          animate(scrollContainerRef.current, { translateX: '-50%' }, { duration: 40, repeat: Infinity, ease: 'linear' });
          observer.disconnect();
        }
      })
    })
    
    observer.observe(scrollContainerRef.current);

    return () => observer.disconnect();
  }, [])

  return (
    <div className="bg-white dark:bg-secondary pb-24 pt-6 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex items-center gap-x-8 overflow-hidden dark:text-primary" style={{ scrollbarWidth: 'none' }}>
          <div ref={scrollContainerRef} className="scroll-items-containe flex items-center">
            {wallets.map((w, i) => <div key={i}>{w}</div>)}
          </div>
        </div>
      </div>
    </div>
  )
}
