import { Metadata } from '@metaplex-foundation/mpl-token-metadata'

import { OpenSeaClient, OpenSeaConfig } from 'eth/opensea'
import { EthereumCollectiblesProvider } from 'eth/provider'
import { OpenSeaCollection } from 'eth/types'
import { HeliusClient, HeliusConfig } from 'sol/helius'
import { SolanaCollectiblesProvider } from 'sol/provider'
import { Nullable } from 'utils/typeUtils'
import { Collectible, CollectibleState } from 'utils/types'

import 'cross-fetch/polyfill'

type FetchNFTClientProps = {
  openSeaConfig?: OpenSeaConfig
  heliusConfig? : HeliusConfig
  solanaConfig?: {
    rpcEndpoint?: string
    metadataProgramId?: string
  }
}

export class FetchNFTClient {
  private readonly ethCollectiblesProvider: EthereumCollectiblesProvider
  private readonly solCollectiblesProvider: SolanaCollectiblesProvider

  constructor(props?: FetchNFTClientProps) {
    const openseaClient = new OpenSeaClient(props?.openSeaConfig)
    this.ethCollectiblesProvider = new EthereumCollectiblesProvider(openseaClient)
    const heliusClient = new HeliusClient(props?.heliusConfig)
    this.solCollectiblesProvider = new SolanaCollectiblesProvider({
      heliusClient,
      rpcEndpoint: props?.solanaConfig?.rpcEndpoint,
      metadataProgramId: props?.solanaConfig?.metadataProgramId
    })
  }

  public getEthereumCollectionMetadatas = async (addresses: string[]): Promise<{ [address: string]: OpenSeaCollection }> => {
    return this.ethCollectiblesProvider.getCollectionMetadatas(addresses)
  }

  public getEthereumCollectionMetadatasForCollectibles = async (collectibles: Collectible[]): Promise<Collectible[]> => {
    return this.ethCollectiblesProvider.getCollectionMetadatasForCollectibles(collectibles)
  }

  public getEthereumCollectibles = async (
    wallets: string[]
  ): Promise<CollectibleState> => {
    return wallets.length
      ? this.ethCollectiblesProvider.getCollectibles(wallets)
      : {}
  }

  public getSolanaMetadataFromChain = async (mintAddress: string): Promise<Nullable<{ metadata: Metadata, imageUrl: string }>> => {
    return this.solCollectiblesProvider.getMetadataFromChain(mintAddress)
  }

  public getSolanaCollectibles = async (
    wallets: string[]
  ): Promise<CollectibleState> => {
    return wallets.length
      ? this.solCollectiblesProvider.getCollectibles(wallets)
      : {}
  }

  public getCollectibles = async (args: {
    ethWallets?: string[]
    solWallets?: string[]
  }): Promise<{
    ethCollectibles: CollectibleState
    solCollectibles: CollectibleState
  }> => {
    try {
      const [ethCollectibles, solCollectibles] = await Promise.all([
        this.getEthereumCollectibles(args.ethWallets ?? []),
        this.getSolanaCollectibles(args.solWallets ?? [])
      ])
      return { ethCollectibles, solCollectibles }
    } catch (e) {
      console.error(`FetchNFTClient | getCollectibles | error: ${e}`)
      return e
    }
  }
}

export { Collectible, CollectibleState }
