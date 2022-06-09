import { config } from './config'
import { BlockchainEnum } from './api/_generated-types'

type Network = {
  title: string
  explorerUrl: string
  etherscanApiUrl: string | null
  coin: string
  decimals?: number
  blockchain: BlockchainEnum
  rpcUrls?: string[]
  chainId: number | string
  icon:
    | 'ethereumRegular'
    | 'bnbRegular'
    | 'wavesRegular'
    | 'avalanche'
    | 'solana'
    | 'polygon'
    | 'moonriver'
    | 'fantom'
    | 'cronos'
    | 'arbitrum'
    | 'aurora'
    | 'moonbeam'
}

const prodNetworks: Record<string, Network> = {
  1: {
    chainId: 1,
    title: 'Ethereum',
    explorerUrl: 'https://etherscan.io',
    etherscanApiUrl: 'https://api.etherscan.io/api',
    coin: 'ETH',
    decimals: 18,
    blockchain: BlockchainEnum.Ethereum,
    icon: 'ethereumRegular',
  },
  1666600000: {
    chainId: 1666600000,
    title: 'Harmony',
    explorerUrl: 'https://explorer.harmony.one',
    etherscanApiUrl: null,
    coin: 'ONE',
    decimals: 18,
    blockchain: BlockchainEnum.Ethereum,
    icon: 'ethereumRegular',
    rpcUrls: [
      'https://api.harmony.one',
      'https://s1.api.harmony.one',
      'https://s2.api.harmony.one',
      'https://s3.api.harmony.one',
    ],
  },
  56: {
    chainId: 56,
    title: 'Binance Smart Chain',
    etherscanApiUrl: 'https://api.bscscan.com/api',
    explorerUrl: 'https://bscscan.com',
    coin: 'BNB',
    decimals: 18,
    blockchain: BlockchainEnum.Ethereum,
    icon: 'bnbRegular',
    rpcUrls: [
      'https://bsc-dataseed.binance.org/',
      'https://bsc-dataseed1.defibit.io/',
      'https://bsc-dataseed1.ninicoin.io/',
    ],
  },
  137: {
    chainId: 137,
    title: 'Polygon',
    etherscanApiUrl: 'https://api.polygonscan.com/api',
    explorerUrl: 'https://polygonscan.com',
    coin: 'MATIC',
    decimals: 18,
    blockchain: BlockchainEnum.Ethereum,
    icon: 'polygon',
    rpcUrls: [
      'https://rpc-mainnet.maticvigil.com/',
      'https://rpc-mainnet.maticvigil.com/',
    ],
  },
  1285: {
    chainId: 1285,
    title: 'Moonriver',
    etherscanApiUrl: 'https://api-moonriver.moonscan.io',
    explorerUrl: 'https://moonriver.moonscan.io',
    coin: 'MOVR',
    decimals: 18,
    blockchain: BlockchainEnum.Ethereum,
    icon: 'moonriver',
    rpcUrls: [
      'https://rpc.moonriver.moonbeam.network',
      'https://rpc.moonriver.moonbeam.network',
    ],
  },
  1284: {
    chainId: 1284,
    title: 'MoonBeam',
    etherscanApiUrl: 'https://api-moonbeam.moonscan.io/api',
    explorerUrl: 'https://moonbeam.moonscan.io',
    coin: 'GLMR',
    decimals: 18,
    blockchain: BlockchainEnum.Ethereum,
    icon: 'moonbeam',
    rpcUrls: [
      'https://rpc.api.moonbeam.network',
      'https://rpc.api.moonbeam.network',
    ],
  },
  1313161554: {
    chainId: 1313161554,
    title: 'Aurora',
    etherscanApiUrl: 'https://api.aurorascan.dev/api',
    explorerUrl: 'https://aurorascan.dev',
    coin: 'ETH',
    decimals: 18,
    blockchain: BlockchainEnum.Ethereum,
    icon: 'aurora',
    rpcUrls: ['https://mainnet.aurora.dev', 'https://mainnet.aurora.dev'],
  },
  43114: {
    chainId: 43114,
    title: 'Avalanche',
    explorerUrl: 'https://snowtrace.io',
    etherscanApiUrl: 'https://api.snowtrace.io/api',
    coin: 'AVAX',
    decimals: 18,
    blockchain: BlockchainEnum.Ethereum,
    icon: 'avalanche',
    rpcUrls: [
      'https://api.avax.network/ext/bc/C/rpc',
      'https://api.avax.network/ext/bc/C/rpc',
    ],
  },
  250: {
    chainId: 250,
    title: 'Fantom',
    explorerUrl: 'https://ftmscan.com',
    etherscanApiUrl: 'https://api.ftmscan.com/api',
    coin: 'FTM',
    decimals: 18,
    blockchain: BlockchainEnum.Ethereum,
    icon: 'fantom',
    rpcUrls: ['https://rpc.ftm.tools'],
  },
  25: {
    chainId: 25,
    title: 'Cronos',
    explorerUrl: 'https://cronoscan.com',
    etherscanApiUrl: 'https://api.cronoscan.com/api',
    coin: 'CRO',
    decimals: 18,
    blockchain: BlockchainEnum.Ethereum,
    icon: 'cronos',
    rpcUrls: ['https://evm.cronos.org'],
  },
  42161: {
    chainId: 42161,
    title: 'Arbitrum',
    explorerUrl: 'https://arbiscan.io',
    etherscanApiUrl: 'https://api.arbiscan.io/api',
    coin: 'ETH',
    decimals: 18,
    blockchain: BlockchainEnum.Ethereum,
    icon: 'arbitrum',
    rpcUrls: ['https://arb1.arbitrum.io/rpc'],
  },
  10: {
    chainId: 10,
    title: 'Optimistic Ethereum',
    explorerUrl: 'https://optimistic.etherscan.io',
    etherscanApiUrl: 'https://api-optimistic.etherscan.io',
    coin: 'ETH',
    decimals: 18,
    blockchain: BlockchainEnum.Ethereum,
    icon: 'ethereumRegular',
    rpcUrls: ['https://mainnet.optimism.io'],
  },
  main: {
    chainId: 'main',
    title: 'Waves',
    etherscanApiUrl: null,
    explorerUrl: 'https://wavesexplorer.com',
    coin: 'WAVES',
    blockchain: BlockchainEnum.Waves,
    icon: 'wavesRegular',
  },
}

const devNetworks: Record<string, Network> = {
  3: {
    chainId: 3,
    title: 'Ropsten',
    explorerUrl: 'https://ropsten.etherscan.io',
    coin: 'ETH',
    decimals: 18,
    etherscanApiUrl: null,
    blockchain: BlockchainEnum.Ethereum,
    icon: 'ethereumRegular',
  },
  42: {
    chainId: 42,
    title: 'Kovan',
    explorerUrl: 'https://kovan.etherscan.io',
    coin: 'ETH',
    decimals: 18,
    etherscanApiUrl: null,
    blockchain: BlockchainEnum.Ethereum,
    icon: 'ethereumRegular',
  },
  4: {
    chainId: 4,
    title: 'Rinkeby',
    explorerUrl: 'https://rinkeby.etherscan.io',
    coin: 'ETH',
    decimals: 18,
    etherscanApiUrl: null,
    blockchain: BlockchainEnum.Ethereum,
    icon: 'ethereumRegular',
  },
  5: {
    chainId: 5,
    title: 'Goerli',
    explorerUrl: 'https://goerli.etherscan.io',
    coin: 'ETH',
    decimals: 18,
    etherscanApiUrl: null,
    blockchain: BlockchainEnum.Ethereum,
    icon: 'ethereumRegular',
  },
  97: {
    chainId: 97,
    title: 'Binance Smart Chain (testnet)',
    explorerUrl: 'https://testnet.bscscan.com',
    coin: 'BNB',
    decimals: 18,
    etherscanApiUrl: null,
    blockchain: BlockchainEnum.Ethereum,
    icon: 'bnbRegular',
    rpcUrls: [
      'https://data-seed-prebsc-1-s1.binance.org:8545/',
      'https://data-seed-prebsc-2-s1.binance.org:8545/',
      'https://data-seed-prebsc-1-s2.binance.org:8545/',
      'https://data-seed-prebsc-2-s2.binance.org:8545/',
      'https://data-seed-prebsc-1-s3.binance.org:8545/',
      'https://data-seed-prebsc-2-s3.binance.org:8545/',
    ],
  },
  1287: {
    chainId: 1287,
    title: 'Moonbase Alpha',
    explorerUrl: 'https://moonbase.moonscan.io',
    coin: 'DEV',
    decimals: 18,
    blockchain: BlockchainEnum.Ethereum,
    icon: 'moonriver',
    etherscanApiUrl: null,
    rpcUrls: ['https://rpc.testnet.moonbeam.network'],
  },
  43113: {
    chainId: 43113,
    title: 'Avalanche (testnet)',
    explorerUrl: 'https://testnet.snowtrace.io',
    coin: 'AVAX',
    decimals: 18,
    blockchain: BlockchainEnum.Ethereum,
    icon: 'avalanche',
    etherscanApiUrl: null,
    rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
  },
  1666700000: {
    chainId: 1666700000,
    title: 'Harmony Testnet',
    explorerUrl: 'https://explorer.pops.one',
    coin: 'ONE',
    etherscanApiUrl: null,
    decimals: 18,
    blockchain: BlockchainEnum.Ethereum,
    icon: 'ethereumRegular',
    rpcUrls: [
      'https://api.s0.b.hmny.io',
      'https://api.s1.b.hmny.io',
      'https://api.s2.b.hmny.io',
      'https://api.s3.b.hmny.io',
    ],
  },
}

export const networksConfig: Record<string, Network> = {
  ...prodNetworks,
  ...(config.IS_DEV ? devNetworks : {}),
}
