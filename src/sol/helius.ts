import { HeliusNFT } from './types'

const HELIUS_NUM_ASSETS_PER_PAGE_LIMIT = 1000

export type HeliusClientCtorProps = {
  apiEndpoint?: string
  apiKey?: string
  limit?: number
}

export class HeliusClient {
  private readonly apiUrl: string = 'https://mainnet.helius-rpc.com'
  private readonly apiKey: string = ''
  private readonly limit: number = HELIUS_NUM_ASSETS_PER_PAGE_LIMIT

  constructor(props?: HeliusClientCtorProps) {
    this.apiUrl = props?.apiEndpoint ?? this.apiUrl
    this.apiKey = props?.apiKey ?? this.apiKey
    this.limit = props?.limit ?? this.limit

    if (this.apiKey) {
      this.apiUrl = `${this.apiUrl}/?api_key=${this.apiKey}`
    }
  }

  async getNFTsForWallet(wallet: string): Promise<HeliusNFT[]> {
    let nfts: HeliusNFT[] = []
    try {
      let page = 1
      while (true) {
        const response = await fetch(this.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: 'test-drive', // todo: what should this be
            jsonrpc: '2.0',
            method: 'getAssetsByOwner',
            params: {
              ownerAddress: wallet,
              page,
              limit: this.limit,
              sortBy: {
                sortBy: 'id',
                sortDirection: 'asc'
              },
              displayOptions: {
                showUnverifiedCollections: false,
                showCollectionMetadata: true
              }
            }
          })
        })
        const { result } = await response.json()
        nfts = [...nfts, ...result.items]
        const isEmptyResult = result.items.length === 0
        const isResultLengthBelowLimit =
          result.items.length < this.limit
        if (isEmptyResult || isResultLengthBelowLimit) {
          break
        } else {
          page++
        }
      }
      return nfts
    } catch (e) {
      console.error(`HeliusClient | getNFTsForWallet | error for wallet ${wallet}: ${e}`)
      throw e
    }
  }
}
