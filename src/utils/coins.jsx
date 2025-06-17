import EthereumLogo from "../assets/svgs/ethereum";
import { EthereumLogoNetwork } from "../assets/svgs/ethereum";
import UsdtLogo from "../assets/svgs/usdt";
import BnbLogo from "../assets/svgs/bnb";
import { BnbLogoNetwork } from "../assets/svgs/bnb";
import UsdcLogo from "../assets/svgs/usdc";

export const coins = [
    {
        name: "Ethereum",
        network: 'Sepolia',  // Switch to ethereum after dev
        symbol: "ETH",
        tokenDecimal: 18,
        chainId: 11155111,
        logo: EthereumLogo,
        networkLogo: EthereumLogoNetwork,
        contractAddress: null,
        key: 1
    },
    {
        name: "Binance Coin",
        network: 'Binance SmartChain',
        symbol: "BNB",
        tokenDecimal: 18,
        chainId: 56,
        logo: BnbLogo,
        networkLogo: BnbLogoNetwork,
        contractAddress: null,
        key: 2
    },
    {
        name: "Tether",
        network: 'Sepolia',  // Switch to ethereum after dev
        symbol: "USDT",
        tokenDecimal: 18,
        chainId: 11155111,
        logo: UsdtLogo,
        networkLogo: EthereumLogoNetwork,
        contractAddress: '0x863aE464D7E8e6F95b845FD3AF0f9A2B2034D6dD',
        key: 3
    },
    {
        name: "Tether",
        network: 'Binance SmartChain',
        symbol: "USDT",
        tokenDecimal: 18,
        chainId: 56,
        logo: UsdtLogo,
        networkLogo: BnbLogoNetwork,
        contractAddress: '0x63b7e5ae00cc6053358fb9b97b361372fba10a5e',
        key: 4
    },
    {
        name: "Usd Coin",
        network: 'Sepolia',  // Switch to ethereum after dev
        symbol: "USDC",
        tokenDecimal: 6,
        chainId: 11155111,
        logo: UsdcLogo,
        networkLogo: EthereumLogoNetwork,
        contractAddress: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
        key: 5
    },
    {
        name: "Usd Coin",
        network: 'Binance SmartChain',
        symbol: "USDC",
        tokenDecimal: 6,
        chainId: 56,
        logo: UsdcLogo,
        networkLogo: BnbLogoNetwork,
        contractAddress: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
        key: 6
    }
]