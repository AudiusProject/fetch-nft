import { Connection, PublicKey } from '@solana/web3.js'

import { allSettled } from 'utils/allSettled'
import { Nullable } from 'utils/typeUtils'
import { Collectible, CollectibleState } from 'utils/types'

import { HeliusClient } from './helius'
import { isHeliusNFTValid, solanaNFTToCollectible } from './helpers'
import { Blocklist, HeliusNFT, SolanaNFTType } from './types'

const RPC_ENDPOINT = 'https://api.mainnet-beta.solana.com'
const METADATA_PROGRAM_ID_PUBLIC_KEY = new PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
)

const BLOCKLIST_URL =
  'https://raw.githubusercontent.com/solflare-wallet/blocklist-automation/master/dist/blocklist.json'

type SolanaCollectiblesProviderCtorArgs = {
  heliusClient: HeliusClient
  rpcEndpoint?: string
  metadataProgramId?: string
}

export class SolanaCollectiblesProvider {
  private readonly heliusClient: HeliusClient
  private readonly rpcEndpoint: string = RPC_ENDPOINT
  private readonly metadataProgramIdPublicKey: PublicKey = METADATA_PROGRAM_ID_PUBLIC_KEY
  private readonly connection: Nullable<Connection> = null
  private blocklist: Nullable<Blocklist> = null

  constructor(props: SolanaCollectiblesProviderCtorArgs) {
    this.heliusClient = props.heliusClient
    this.rpcEndpoint = props.rpcEndpoint ?? this.rpcEndpoint
    this.metadataProgramIdPublicKey = props.metadataProgramId
      ? new PublicKey(props.metadataProgramId)
      : this.metadataProgramIdPublicKey
    try {
      this.connection = new Connection(this.rpcEndpoint, 'confirmed')
    } catch (e) {
      console.error('Could create Solana RPC connection', e)
      this.connection = null
    }
  }

  async getCollectibles(wallets: string[]): Promise<CollectibleState> {
    if (!this.blocklist) {
      try {
        const blocklistResponse = await fetch(BLOCKLIST_URL)
        this.blocklist = await blocklistResponse.json()
      } catch (e) {
        console.error('Could not fetch Solana nft blocklist', e)
      }
    }

    const nfts = await allSettled(
      wallets.map((wallet) => this.heliusClient.getNFTsForWallet(wallet))
    ).then((results: PromiseSettledResult<HeliusNFT[]>[]) =>
      results.map((result, i) => ({ result, wallet: wallets[i] }))
        .filter(
          (
            item
          ): item is {
            result: PromiseFulfilledResult<HeliusNFT[]>
            wallet: string
          } => {
            const { result, wallet } = item
            const fulfilled = 'value' in result
            if (!fulfilled) {
              console.error(
                `Unable to get Helius NFTs for wallet ${wallet}: ${result.reason}`
              )
            }
            return fulfilled
          }
        )
        .map(({ result, wallet }) => {
          const blocklist = this.blocklist
          if (blocklist) {
            return result.value
              .filter((nft) => isHeliusNFTValid(nft, blocklist))
              .map((nft) => ({ ...nft, wallet }))
          }
          return result.value.map((nft) => ({ ...nft, wallet }))
        })
    )

    const solanaCollectibles = await Promise.all(
      nfts.map(async (nftsForWallet: (HeliusNFT & { wallet: string })[]) => {
        if (nftsForWallet.length === 0) return []
        const wallet = nftsForWallet[0].wallet
        const mintAddresses = nftsForWallet.map((nft) => nft.id)
        const programAddresses = mintAddresses.map(
          (mintAddress) =>
            PublicKey.findProgramAddressSync(
              [
                Buffer.from('metadata'),
                this.metadataProgramIdPublicKey.toBytes(),
                new PublicKey(mintAddress).toBytes()
              ],
              this.metadataProgramIdPublicKey
            )[0]
        )
        const chainMetadatas = await Promise.all(
          programAddresses.map(async (address) => {
            try {
              if (!this.connection) return null
              const { Metadata } = await import(
                '@metaplex-foundation/mpl-token-metadata'
              )
              return Metadata.fromAccountAddress(this.connection, address)
            } catch (e) {
              return null
            }
          })
        )
        const collectibles = await Promise.all(
          nftsForWallet.map(
            async (nft, i) =>
              await solanaNFTToCollectible(
                nft,
                wallet,
                SolanaNFTType.HELIUS,
                chainMetadatas[i]
              )
          )
        )
        return collectibles.filter(Boolean) as Collectible[]
      })
    )

    const collectiblesMap = solanaCollectibles.reduce(
      (result, collectibles) => {
        if (collectibles.length === 0) return result
        result[collectibles[0].wallet] = collectibles
        return result
      },
      {}
    )

    return collectiblesMap
  }

  async getMetadataFromChain(mintAddress: string) {
    if (this.connection === null) return null

    try {
      const programAddress = (
        PublicKey.findProgramAddressSync(
          [
            Buffer.from('metadata'),
            this.metadataProgramIdPublicKey.toBytes(),
            new PublicKey(mintAddress).toBytes()
          ],
          this.metadataProgramIdPublicKey
        )
      )[0]

      const { Metadata } = await import(
        '@metaplex-foundation/mpl-token-metadata'
      )
      const metadata = await Metadata.fromAccountAddress(
        this.connection,
        programAddress
      )
      const response = await fetch(metadata.data.uri.replaceAll('\x00', ''))
      const result = (await response.json()) ?? {}
      const imageUrl = result?.image
      return {
        metadata,
        imageUrl
      }
    } catch (e) {
      console.error(`SolanaCollectiblesProvider | getCollectionMetadata | error for mint address ${mintAddress}: ${e}`)
      return null
    }
  }
}
