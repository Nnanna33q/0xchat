import ethImg from "../imgs/ethereum-logo-network.png";

export default function EthereumLogo() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><g fill="none" fillRule="evenodd"><circle cx="16" cy="16" r="16" fill="#627EEA"/><g fill="#FFF" fillRule="nonzero"><path fillOpacity=".602" d="M16.498 4v8.87l7.497 3.35z"/><path d="M16.498 4L9 16.22l7.498-3.35z"/><path fillOpacity=".602" d="M16.498 21.968v6.027L24 17.616z"/><path d="M16.498 27.995v-6.028L9 17.616z"/><path fillOpacity=".2" d="M16.498 20.573l7.497-4.353-7.497-3.348z"/><path fillOpacity=".602" d="M9 16.22l7.498 4.353v-7.701z"/></g></g></svg>
    )
}

export function EthereumLogoNetwork() {
    return (
        <img className="size-3 absolute top-0 right-0 ring ring-primary rounded-full" src={ethImg}/>
    )
}