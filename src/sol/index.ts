import { Buffer } from 'buffer'

import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { Connection, PublicKey } from '@solana/web3.js'

import { solanaNFTToCollectible } from 'sol/helpers'
import { SolanaNFTType } from 'sol/types'
import { Nullable } from 'utils/typeUtils'
import { Collectible, CollectibleState } from 'utils/types'

type SolanaNFTMetadata = { type: SolanaNFTType; url: string }

const SOLANA_CLUSTER_ENDPOINT = 'https://api.mainnet-beta.solana.com'
const METADATA_PROGRAM_ID_PUBLIC_KEY = new PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
)

export type SolanaClientProps = {
  rpcEndpoint?: string
}

export class SolanaClient {
  readonly endpoint: string = SOLANA_CLUSTER_ENDPOINT
  private readonly connection: Nullable<Connection> = null
  constructor(props?: SolanaClientProps) {
    this.endpoint = props?.rpcEndpoint ?? this.endpoint
    try {
      this.connection = new Connection(this.endpoint!, 'confirmed')
    } catch (e) {
      console.error('Could not create Solana RPC connection', e)
      this.connection = null
    }
  }

  /**
   * for each given wallet:
   * - get and parse its token accounts to get the mint addresses
   * - filter out tokens whose decimal places are not 0
   * - find the metadata PDAs for the mint addresses
   * - get the account infos for the PDAs if they exist
   * - get the metadata urls from the account infos and fetch the metadatas
   * - transform the nft metadatas to Audius-domain collectibles
   */
  public getAllCollectibles = async (
    wallets: string[]
  ): Promise<CollectibleState> => {
    try {
      if (this.connection === null) throw new Error('No connection')
      const connection = this.connection

      const tokenAccountsByOwnerAddress = await Promise.all(
        wallets.map(async (address) =>
          connection.getParsedTokenAccountsByOwner(new PublicKey(address), {
            programId: TOKEN_PROGRAM_ID
          })
        )
      )

      const potentialNFTsByOwnerAddress = tokenAccountsByOwnerAddress
        .map((ta) => ta.value)
        // value is an array of parsed token info
        .map((value) => {
          const mintAddresses = value
            .map((v) => ({
              mint: v.account.data.parsed.info.mint,
              tokenAmount: v.account.data.parsed.info.tokenAmount
            }))
            .filter(({ tokenAmount }) => {
              // Filter out the token if we don't have any balance
              const ownsNFT = tokenAmount.amount !== '0'
              // Filter out the tokens that don't have 0 decimal places.
              // NFTs really should have 0
              const hasNoDecimals = tokenAmount.decimals === 0
              return ownsNFT && hasNoDecimals
            })
            .map(({ mint }) => mint)
          return { mintAddresses }
        })

      const nfts = await Promise.all(
        potentialNFTsByOwnerAddress.map(async ({ mintAddresses }) => {
          const programAddresses = await Promise.all(
            mintAddresses.map(
              async (mintAddress) =>
                (
                  await PublicKey.findProgramAddress(
                    [
                      Buffer.from('metadata'),
                      METADATA_PROGRAM_ID_PUBLIC_KEY.toBytes(),
                      new PublicKey(mintAddress).toBytes()
                    ],
                    METADATA_PROGRAM_ID_PUBLIC_KEY
                  )
                )[0]
            )
          )

          const accountInfos = await connection.getMultipleAccountsInfo(
            programAddresses
          )
          const nonNullInfos = accountInfos?.filter(Boolean) ?? []

          const metadataUrls = nonNullInfos
            .map((x) => this._utf8ArrayToNFTType(x!.data))
            .filter(Boolean) as SolanaNFTMetadata[]

          const results = await Promise.all(
            metadataUrls.map(async (item) =>
              fetch(item!.url)
                .then((res) => res.json())
                .catch(() => null)
            )
          )

          const metadatas = results.filter(Boolean).map((metadata, i) => ({
            metadata,
            type: metadataUrls[i].type
          }))

          return metadatas.filter((r) => !!r.metadata && Object.keys(r.metadata).length > 0)
        })
      )

      const solanaCollectibles = await Promise.all(
        nfts.map(async (nftsForAddress, i) => {
          const collectibles = await Promise.all(
            nftsForAddress.map(
              async (nft) =>
                await solanaNFTToCollectible(nft.metadata, wallets[i], nft.type)
            )
          )
          return collectibles.filter(Boolean) as Collectible[]
        })
      )

      return solanaCollectibles.reduce(
        (result, collectibles, i) => ({
          ...result,
          [wallets[i]]: collectibles
        }),
        {} as CollectibleState
      )
    } catch (e) {
      console.error('Unable to get collectibles', e)
      return Promise.resolve({})
    }
  }

  /**
   * Decode bytes to get url for nft metadata
   * Check urls based on nft standard e.g. metaplex, or nft collection e.g. solamander, or known domains e.g. ipfs
   * This is because there may be multiple different collections of nfts on e.g. metaplex (arweave), also
   * a given nft collection can have nfts living in different domains e.g. solamander on cloudfront or arweave or etc., also
   * nfts may live in ipfs or other places
   */
  private _utf8ArrayToNFTType = (
    array: Uint8Array
  ): Nullable<SolanaNFTMetadata> => {
    const text = new TextDecoder().decode(array)

    // for the sake of simplicty/readability/understandability, we check the decoded url
    // one by one against metaplex, star atlas, and others
    return (
      this._metaplex(text) ||
      this._starAtlas(text) ||
      this._jsonExtension(text) ||
      this._ipfs(text) ||
      this._metaplexMints(text)
    )
  }

  private _metaplex = (text: string): Nullable<SolanaNFTMetadata> => {
    const query = 'https://'
    const startIndex = text.indexOf(query)
    if (startIndex === -1) return null

    // metaplex standard nfts live in arweave, see link below
    // https://github.com/metaplex-foundation/metaplex/blob/81023eb3e52c31b605e1dcf2eb1e7425153600cd/js/packages/web/src/contexts/meta/processMetaData.ts#L29
    const isMetaplex = text.includes('arweave')
    const foundNFTUrl = startIndex > -1 && isMetaplex
    if (!foundNFTUrl) return null

    const suffix = '/'
    const suffixIndex = text.indexOf(suffix, startIndex + query.length)
    if (suffixIndex === -1) return null

    const hashLength = 43
    const endIndex = suffixIndex + suffix.length + hashLength
    const url = text.substring(startIndex, endIndex)
    return {
      type: 'METAPLEX',
      url
    }
  }

  private _starAtlas = (text: string): Nullable<SolanaNFTMetadata> => {
    const query = 'https://'
    const startIndex = text.indexOf(query)
    if (startIndex === -1) return null

    // star atlas nfts live in https://galaxy.staratlas.com/nfts/...
    const isStarAtlas = text.includes('staratlas')
    const foundNFTUrl = startIndex > -1 && isStarAtlas
    if (!foundNFTUrl) return null

    const suffix = '/nfts/'
    const suffixIndex = text.indexOf(suffix, startIndex + query.length)
    if (suffixIndex === -1) return null

    const hashLength = 44
    const endIndex = suffixIndex + suffix.length + hashLength
    const url = text.substring(startIndex, endIndex)
    return {
      type: 'STAR_ATLAS',
      url
    }
  }

  private _jsonExtension = (text: string): Nullable<SolanaNFTMetadata> => {
    // Look for 'https://<...>.json' and that will be the metadata location
    // examples:
    // https://d1b6hed00dtfsr.cloudfront.net/9086.json
    // https://cdn.piggygang.com/meta/3ad355d46a9cb2ee57049db4df57088f.json

    const query = 'https://'
    const startIndex = text.indexOf(query)
    if (startIndex === -1) return null

    const extension = '.json'
    const extensionIndex = text.indexOf(extension)
    const foundNFTUrl = startIndex > -1 && extensionIndex > -1
    if (!foundNFTUrl) return null

    const endIndex = extensionIndex + extension.length
    const url = text.substring(startIndex, endIndex)
    return {
      type: 'METAPLEX',
      url
    }
  }

  private _ipfs = (text: string): Nullable<SolanaNFTMetadata> => {
    // Look for 'https://ipfs.io/ipfs/<...alphanumeric...>' and that will be the metadata location
    // e.g. https://ipfs.io/ipfs/QmWJC47JYuvxYw63cRq81bBNGFXPjhQH8nXg71W5JeRMrC

    const query = 'https://'
    const startIndex = text.indexOf(query)
    if (startIndex === -1) return null

    const isIpfs = text.includes('ipfs')
    const foundNFTUrl = startIndex > -1 && isIpfs
    if (!foundNFTUrl) return null

    const suffix = '/ipfs/'
    const suffixIndex = text.indexOf(suffix, startIndex + query.length)
    if (suffixIndex === -1) return null

    let endIndex = suffixIndex + suffix.length
    while (/[a-zA-Z0-9]/.test(text.charAt(endIndex++))) {}

    const url = text.substring(startIndex, endIndex)
    return {
      type: 'METAPLEX',
      url
    }
  }

  private _metaplexMints = (text: string): Nullable<SolanaNFTMetadata> => {
    // Look for 'https://<any-url>/api/metaplex-mints/<...hash...>' or 'https://<any-url>/api/metaplex-mints/<anything>/<...hash...>' and that will be the metadata location
    const query = 'https://'
    const startIndex = text.indexOf(query)
    if (startIndex === -1) return null
    // e.g. https://solarians.click/api/metaplex-mints/HUQsxb5QFNY9eGwHafRAXZVnBhhdQXR9GeSSrgLnmEGh
    const defaultRegex = /https:\/\/(.*)\.(.*)\/api\/metaplex-mints\/[A-Za-z0-9_]{44}/gm
    // e.g. https://bitboat.me/api/metaplex-mints/boat/4uAV88PuEAM56X4S2zcEom1omKULmdA4mj5kMqtz6xwb
    const complexRegex = /https:\/\/(.*)\.(.*)\/api\/metaplex-mints\/(.*)\/[A-Za-z0-9_]{44}/gm
    const defaultResult = (text.match(defaultRegex) || text.match(complexRegex) || []).join('')

    if (defaultResult.length === 0) return null

    return {
      type: 'METAPLEX',
      url: defaultResult
    }
  }
}
