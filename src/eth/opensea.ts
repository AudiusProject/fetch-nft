import { OpenSeaCollection, OpenSeaEvent, OpenSeaNft } from './types'

const OPENSEA_API_URL = 'https://api.opensea.io'
const OPENSEA_NUM_ASSETS_LIMIT = 200
const OPENSEA_NUM_EVENTS_LIMIT = 50

export type OpenSeaClientCtorProps = {
  apiEndpoint?: string
  apiKey?: string
  assetLimit?: number
  eventLimit?: number
}

export class OpenSeaClient {
  private readonly apiUrl: string = OPENSEA_API_URL
  private readonly apiKey: string = ''
  private readonly assetLimit: number = OPENSEA_NUM_ASSETS_LIMIT
  private readonly eventLimit: number = OPENSEA_NUM_EVENTS_LIMIT

  private requestOptions

  constructor(props?: OpenSeaClientCtorProps) {
    this.apiUrl = props?.apiEndpoint ?? this.apiUrl
    this.apiKey = props?.apiKey ?? this.apiKey
    this.assetLimit = props?.assetLimit ?? this.assetLimit
    this.eventLimit = props?.eventLimit ?? this.eventLimit

    if (this.apiKey) {
      this.requestOptions = {
        headers: new Headers({ 'X-API-KEY': this.apiKey })
      }
    }
  }

  async getCollectionMetadata(
    collection: string
  ): Promise<OpenSeaCollection> {
    const url = `${this.apiUrl}/api/v2/collections/${collection}`
    try {
      const res = await fetch(
        url,
        this.requestOptions
      )
      return res.json()
    } catch (e) {
      console.error(`OpenSeaClient | getCollectionMetadata | error for collection ${collection} at url ${url}: ${e}`)
      throw e
    }
  }

  async getNftTransferEventsForWallet(
    wallet: string,
    limit = this.eventLimit
  ): Promise<OpenSeaEvent[]> {
    try {
      let res: Response
      let json: { next: string | undefined; asset_events: OpenSeaEvent[] }
      let events: OpenSeaEvent[]
      let next: string | undefined
      res = await fetch(
        `${this.apiUrl}/api/v2/events/accounts/${wallet}?limit=${limit}&event_type=transfer&chain=ethereum`,
        this.requestOptions
      )
      json = await res.json()
      next = json.next
      events = json.asset_events
      while (next) {
        res = await fetch(
          `${this.apiUrl}/api/v2/events/accounts/${wallet}?limit=${limit}&event_type=transfer&chain=ethereum&next=${next}`,
          this.requestOptions
        )
        json = await res.json()
        next = json.next
        events = [...events, ...json.asset_events]
      }
      return events.map((event) => ({ ...event, wallet }))
    } catch (e) {
      console.error(`OpenSeaClient | getNftTransferEventsForWallet | error for wallet ${wallet}: ${e}`)
      throw e
    }
  }

  async getNftsForWallet(
    wallet: string,
    limit = this.assetLimit
  ): Promise<OpenSeaNft[]> {
    try {
      let res: Response
      let json: { next: string | undefined; nfts: OpenSeaNft[] }
      let nfts: OpenSeaNft[]
      let next: string | undefined
      res = await fetch(
        `${this.apiUrl}/api/v2/chain/ethereum/account/${wallet}/nfts?limit=${limit}`,
        this.requestOptions
      )
      json = await res.json()
      next = json.next
      nfts = json.nfts
      while (next) {
        res = await fetch(
          `${this.apiUrl}/api/v2/chain/ethereum/account/${wallet}/nfts?limit=${limit}&next=${next}`,
          this.requestOptions
        )
        json = await res.json()
        next = json.next
        nfts = [...nfts, ...json.nfts]
      }
      return nfts.map((nft) => ({ ...nft, wallet }))
    } catch (e) {
      console.error(`OpenSeaClient | getNftsForWallet | error for wallet ${wallet}: ${e}`)
      throw e
    }
  }
}
