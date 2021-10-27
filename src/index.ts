import { OpenSeaClient } from 'eth'
import { SolanaClient } from 'sol'
import { Collectible, CollectibleState } from 'utils/types'

const ethClient = new OpenSeaClient()
const solClient = new SolanaClient()

export const getEthereumCollectibles = async (wallets: string[]): Promise<CollectibleState> => (
  wallets.length ? await ethClient.getAllCollectibles(wallets) : {}
)
export const getSolanaCollectibles = async (wallets: string[]): Promise<CollectibleState> => (
  wallets.length ? await solClient.getAllCollectibles(wallets) : {}
)

type CollectiblesReturnType = {
  ethCollectibles: CollectibleState
  solCollectibles: CollectibleState
}

export const getCollectibles = async (args: {
  ethWallets?: string[]
  solWallets?: string[]
}): Promise<CollectiblesReturnType> => {
  try {
    const [ethCollectibles, solCollectibles] = await Promise.all([
      getEthereumCollectibles(args.ethWallets || []),
      getSolanaCollectibles(args.solWallets || [])
    ])
    return { ethCollectibles, solCollectibles }
  } catch (e) {
    console.error(e.message)
    return e
  }
}

export { Collectible, CollectibleState }
