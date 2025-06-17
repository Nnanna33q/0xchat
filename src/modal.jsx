import { createAppKit } from "@reown/appkit/react"
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { mainnet, sepolia, bsc } from "@reown/appkit/networks";

const  metadata = {
    name: '0xChat',
    description: 'Decentralized messaging platform',
    url: 'http://localhost:3000'
}

export const modal = createAppKit({
    projectId: '4a2794f271a62a52f62542950c7aa4b1',
    metadata,
    networks: [mainnet, sepolia, bsc],
    adapters: [new EthersAdapter()],
    enableCoinbase: false,
    allowUnsupportedChain: true,
    features: {
        email: false,
        socials: false
    }
})