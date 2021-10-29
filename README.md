# @audius/fetch-nft
A utility to fetch and easily display Ethereum & Solana NFTs in a common format given any wallet

# Installation
### Using npm:
```bash
npm install @audius/fetch-nft
```

### Using yarn:
```bash
yarn add @audius/fetch-nft
```

# Main Functions
Getting Ethereum collectibles:
```ts
FetchNFTClient::getEthereumCollectibles(wallets?: string[]) => Promise<CollectibleState>
```

Getting Solana collectibles:
```ts
FetchNFTClient::getSolanaCollectibles(wallets?: string[]) => Promise<CollectibleState>
```

Getting all collectibles:
```ts
FetchNFTClient::getCollectibles({
  ethWallets?: string[],
  solWallets?: string[]
}) => Promise<{
  ethCollectibles: CollectibleState
  solCollectibles: CollectibleState
}>
```

# Output Types
## Collectible
```ts
type Collectible = {
  id: string
  tokenId: string
  name: string | null
  description: string | null
  mediaType: CollectibleMediaType
  frameUrl: string | null
  imageUrl: string | null
  gifUrl: string | null
  videoUrl: string | null
  threeDUrl: string | null
  isOwned: boolean
  dateCreated: string | null
  dateLastTransferred: string | null
  externalLink: string | null
  permaLink: string | null
  assetContractAddress: string | null
  chain: Chain
  wallet: string
}
```

## CollectibleState
```ts
type CollectibleState = {
  [wallet: string]: Collectible[]
}
```

# Basic Usage
```ts
import { FetchNFTClient } from '@audius/fetch-nft'

// Open Sea Config
const openSeaConfig = {
    apiEndpoint: '...',
    apiKey: '...',
    assetLimit: 50
}

// Solana Config
const solanaConfig = {
    rpcEndpoint: '...'
}

// Initialize fetch client with configs
const fetchClient = new FetchNFTClient({ openSeaConfig, solanaConfig })

// Fetching Ethereum collectibles for the given wallets
fetchClient.getEthereumCollectibles([...]).then(res => console.log(res))

// Fetching Solana collectibles for the given wallets
fetchClient.getSolanaCollectibles([...]).then(res => console.log(res))

// Fetching all collectibles for the given wallets
fetchClient.getCollectibles({ ethWallets: [...], solWallets: [...] }).then(res => console.log(res))
```
