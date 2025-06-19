import { FaGithub, FaReddit } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IconContext } from "react-icons/lib";

export default function Footer() {
    return (
        <footer className="pt-24 px-6 lg:px-8">
            {/* <p className="hidden lg:block lg:pb-24 text-2xl text-medium-gray text-center">0xChat is a free and private Web3 chat app using your data, not SMS/MMS. Enjoy secure, decentralized messaging with user-controlled data and anonymous wallet login for lasting privacy. Backed by leading investors.</p> */}
            <div className="lg:flex lg:pt-24 justify-between items-center">
                <div className="lg:hidden flex justify-between py-12">
                    <ul className="flex flex-col gap-y-4">
                        <div className="text-xl font-semibold">Quick Links</div>
                        <a href="" className="block dark:text-light-gray">Home</a>
                        <a href="" className="block dark:text-light-gray">Features</a>
                        <a href="" className="block dark:text-light-gray">Learn More</a>
                    </ul>
                    <ul className="flex flex-col gap-y-4">
                        <div className="text-xl font-semibold">Socials</div>
                        <a href="" className="flex items-center"><IconContext value={{ className: 'text-secondary size-6 dark:text-light-gray' }}><FaGithub /></IconContext><span className="pl-4 dark:text-light-gray">Github</span></a>
                        <a href="" className="flex items-center"><IconContext value={{ className: 'text-secondary size-6 dark:text-light-gray' }}><FaXTwitter /></IconContext><span className="pl-4 dark:text-light-gray">X.com</span></a>
                        <a href="" className="flex items-center"><IconContext value={{ className: 'text-secondary size-6 dark:text-light-gray' }}><FaReddit /></IconContext><span className="pl-4 dark:text-light-gray">Reddit</span></a>
                    </ul>
                </div>
                <ul className="hidden lg:flex lg:flex-col lg:gap-y-4">
                    <div className="text-xl font-semibold">Quick Links</div>
                    <a href="" className="block dark:text-dark-gray">Home</a>
                    <a href="" className="block dark:text-light-gray">Features</a>
                    <a href="" className="block dark:text-light-gray">Learn More</a>
                </ul>
                <ul className="hidden lg:flex lg:flex-col lg:gap-y-4">
                    <div className="text-xl font-semibold">Socials</div>
                    <a href="" className="flex items-center"><IconContext value={{ className: 'text-secondary size-6 dark:text-light-gray' }}><FaGithub /></IconContext><span className="pl-4 dark:text-light-gray">Github</span></a>
                    <a href="" className="flex items-center"><IconContext value={{ className: 'text-secondary size-6 dark:text-light-gray' }}><FaXTwitter /></IconContext><span className="pl-4 dark:text-light-gray">X.com</span></a>
                    <a href="" className="flex items-center"><IconContext value={{ className: 'text-secondary size-6 dark:text-light-gray' }}><FaReddit /></IconContext><span className="pl-4 dark:text-light-gray">Reddit</span></a>
                </ul>
                <form onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <p className="font-semibold text-lg">Subscribe</p>
                        <p className="text-medium-gray dark:text-medium-gray">Subscribe to our newsletter and receive the latest 0xChat news every month</p>
                    </div>
                    <input className="mt-4 w-full border border-light-gray dark:border-dark-gray backdrop-blur rounded-sm p-3 bg-extremely-light-gray dark:bg-extremely-dark-gray focus:outline focus:outline-secondary dark:focus:outline-primary" type="email" placeholder="Enter Email" />
                    <button className="w-[50%] border rounded-full mt-4 py-3 bg-secondary dark:bg-primary text-primary dark:text-secondary font-semibold text-lg" type="submit">Subscribe</button>
                </form>
            </div>
            <hr className="mt-12 text-very-light-gray dark:text-dark-gray" />
            <div className="text-center py-6">Copyright {new Date().getFullYear()} 0xChat Inc.</div>
        </footer>
    )
}