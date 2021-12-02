<p align="center">
  <p align="center">
    <b>@audius/fetch-nft</b>
  </p>
  <p align="center">
    🖼🎑🌠
  </p>
  <p align="center">
    A utility to fetch and easily display Ethereum & Solana NFTs in a common format given any wallet.
  </p>
  <p align="center">
    built with ❤️ from the team <a href="https://audius.org">@Audius</a>.
  </p>
</p>

<br/>
<br/>

# Installation

```bash
# install peer dependencies if not already in your project
npm install @solana/spl-token @solana/web3.js

npm install @audius/fetch-nft
```

# Basic Usage
```ts
import { FetchNFTClient } from '@audius/fetch-nft'

// Initialize fetch client
const fetchClient = new FetchNFTClient()

// Fetching all collectibles for the given wallets
fetchClient.getCollectibles({
  ethWallets: ['0x5A8443f456f490dceeAD0922B0Cc89AFd598cec9'],
  solWallets: ['GrWNH9qfwrvoCEoTm65hmnSh4z3CD96SfhtfQY6ZKUfY']
}).then(res => console.log(res))
```

By default, fetch-nft uses the public Opensea API and the Solana mainnet RPC endpoint. To configure API keys and endpoints, see [Usage With Configs](#usage-with-configs).

# Fetch Client
FetchNFTClient is the primary interface for using the library. When initializing the client, you may optionally pass in configs for the Open Sea and Solana clients used internally.

```ts
type OpenSeaClientProps = {
  apiEndpoint?: string
  apiKey?: string
  assetLimit?: number
  eventLimit?: number
}

type SolanaClientProps = {
  rpcEndpoint?: string
}

type FetchNFTClientProps = {
  openSeaConfig?: OpenSeaClientProps,
  solanaConfig?: SolanaClientProps
}
```

# Main Functions
Getting Ethereum collectibles:
```ts
FetchNFTClient::getEthereumCollectibles(wallets: string[]) => Promise<CollectibleState>
```

Getting Solana collectibles:
```ts
FetchNFTClient::getSolanaCollectibles(wallets: string[]) => Promise<CollectibleState>
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
### Collectible
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

### CollectibleState
```ts
type CollectibleState = {
  [wallet: string]: Collectible[]
}
```

# Usage with Configs
```ts
import { FetchNFTClient } from '@audius/fetch-nft'

// Open Sea Config
const openSeaConfig = {
    apiEndpoint: '...',
    apiKey: '...',
    assetLimit: 50,
    eventLimit: 300
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
```

For more examples, see the [/examples](/examples) directory
