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
import { FetchNFTClient } from "@audius/fetch-nft";

// Initialize fetch client
const fetchClient = new FetchNFTClient();

// Fetching all collectibles for the given wallets
fetchClient
  .getCollectibles({
    ethWallets: ["0x5A8443f456f490dceeAD0922B0Cc89AFd598cec9"],
    solWallets: ["GrWNH9qfwrvoCEoTm65hmnSh4z3CD96SfhtfQY6ZKUfY"],
  })
  .then((res) => console.log(res));
```

By default, fetch-nft uses the public Opensea API and the Solana mainnet RPC endpoint. To configure API keys and endpoints, see [Usage With Configs](#usage-with-configs).

# Fetch Client

FetchNFTClient is the primary interface for using the library. When initializing the client, you may optionally pass in configs for the OpenSea and Helius clients used internally.

```ts
type OpenSeaConfig = {
  apiEndpoint?: string;
  apiKey?: string;
  assetLimit?: number;
  eventLimit?: number;
};

type HeliusConfig = {
  apiEndpoint?: string;
  apiKey?: string;
  limit?: number;
};

type FetchNFTClientProps = {
  openSeaConfig?: OpenSeaConfig;
  heliusConfig?: HeliusConfig;
  solanaConfig?: {
    rpcEndpoint?: string;
    metadataProgramId?: string;
  };
};
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
  id: string;
  tokenId: string;
  name: Nullable<string>;
  description: Nullable<string>;
  mediaType: CollectibleMediaType;
  frameUrl: Nullable<string>;
  imageUrl: Nullable<string>;
  gifUrl: Nullable<string>;
  videoUrl: Nullable<string>;
  threeDUrl: Nullable<string>;
  animationUrl: Nullable<string>;
  hasAudio: boolean;
  isOwned: boolean;
  dateCreated: Nullable<string>;
  dateLastTransferred: Nullable<string>;
  externalLink: Nullable<string>;
  permaLink: Nullable<string>;
  chain: Chain;
  wallet: string;
  duration?: number;

  // ethereum nfts
  assetContractAddress: Nullable<string>;
  standard: Nullable<EthTokenStandard>;
  collectionSlug: Nullable<string>;
  collectionName: Nullable<string>;
  collectionImageUrl: Nullable<string>;

  // solana nfts
  solanaChainMetadata?: Nullable<Metadata>;
  heliusCollection?: Nullable<HeliusCollection>;
};
```

### CollectibleState

```ts
type CollectibleState = {
  [wallet: string]: Collectible[];
};
```

# Usage with Configs

```ts
import { FetchNFTClient } from '@audius/fetch-nft'

// OpenSea Config
const openSeaConfig = {
  apiEndpoint: '...',
  apiKey: '...',
  assetLimit: 10,
  eventLimit: 10
}

// Helius Config
const heliusConfig = {
  apiEndpoint: '...';
  apiKey: '...',
  limit: 10
}

const solanaConfig = {
  rpcEndpoint: '...',
  metadataProgramId: '...'
};

// Initialize fetch client with configs
const fetchClient = new FetchNFTClient({ openSeaConfig, heliusConfig, solanaConfig })

// Fetching Ethereum collectibles for the given wallets
fetchClient.getEthereumCollectibles([...]).then(res => console.log(res))

// Fetching Solana collectibles for the given wallets
fetchClient.getSolanaCollectibles([...]).then(res => console.log(res))
```

For more examples, see the [/examples](/examples) directory
