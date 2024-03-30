import { Metadata } from '@metaplex-foundation/mpl-token-metadata'

import { OpenSeaClient, OpenSeaClientCtorProps } from 'eth/opensea'
import { EthereumCollectiblesProvider } from 'eth/provider'
import { OpenSeaCollection } from 'eth/types'
import { HeliusClient, HeliusClientCtorProps } from 'sol/helius'
import { SolanaCollectiblesProvider } from 'sol/provider'
import { Nullable } from 'utils/typeUtils'
import { Collectible, CollectibleState } from 'utils/types'

import 'cross-fetch/polyfill'

type FetchNFTClientProps = {
  openSeaConfig?: OpenSeaClientCtorProps
  heliusConfig? : HeliusClientCtorProps
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

  public getEthereumCollectionMetadatas = async (addresses: []): Promise<{ [address: string]: OpenSeaCollection }> => {
    return this.ethCollectiblesProvider.getCollectionMetadatas(addresses)
  }

  public getEthereumCollectibles = async (
    wallets: string[]
  ): Promise<CollectibleState> => {
    return wallets.length
      ? this.ethCollectiblesProvider.getCollectibles(wallets)
      : {}
  }

  public getSolanaCollectionMetadata = async (mintAddress: string): Promise<Nullable<{ metadata: Metadata, imageUrl: string }>> => {
    return this.solCollectiblesProvider.getCollectionMetadata(mintAddress)
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
