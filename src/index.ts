import { OpenSeaClient, OpenSeaClientProps } from 'eth'
import { SolanaClient, SolanaClientProps } from 'sol'
import { Collectible, CollectibleState } from 'utils/types'

import 'cross-fetch/polyfill'

type FetchNFTClientProps = {
  openSeaConfig?: OpenSeaClientProps,
  solanaConfig?: SolanaClientProps
}

export class FetchNFTClient {
  private ethClient: OpenSeaClient
  private solClient: SolanaClient

  constructor(props?: FetchNFTClientProps) {
    this.ethClient = new OpenSeaClient(props?.openSeaConfig ?? {})
    this.solClient = new SolanaClient(props?.solanaConfig ?? {})
  }

  public getEthereumCollectibles = async (wallets: string[]): Promise<CollectibleState> => (
    wallets.length ? await this.ethClient.getAllCollectibles(wallets) : {}
  )

  public getSolanaCollectibles = async (wallets: string[]): Promise<CollectibleState> => (
    wallets.length ? await this.solClient.getAllCollectibles(wallets) : {}
  )

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
      console.error(e.message)
      return e
    }
  }
}

export { Collectible, CollectibleState }
