// import dayjs from 'dayjs'

import { allSettled } from 'utils/allSettled'
import { Collectible, CollectibleState } from 'utils/types'

import {
  assetToCollectible,
  getAssetIdentifier,
  isAssetValid
  // isNotFromNullAddress,
  // transferEventToCollectible
} from './helpers'
import { OpenSeaClient } from './opensea'
import {
  OpenSeaCollection,
  // OpenSeaEvent,
  // OpenSeaEventExtended,
  OpenSeaNft,
  OpenSeaNftExtended,
  OpenSeaNftMetadata
} from './types'

export class EthereumCollectiblesProvider {
  private readonly openSeaClient: OpenSeaClient

  constructor(openSeaClient: OpenSeaClient) {
    this.openSeaClient = openSeaClient
  }

  private async getNftsForMultipleWallets(wallets: string[]): Promise<OpenSeaNft[]> {
    return allSettled(
      wallets.map((wallet) => this.openSeaClient.getNftsForWallet(wallet))
    ).then((results: PromiseSettledResult<OpenSeaNft[]>[]) =>
      results
        .map((result, i) => ({ result, wallet: wallets[i] }))
        .filter(({ result }) => result.status === 'fulfilled')
        .map(
          ({ result, wallet }) =>
            (result as PromiseFulfilledResult<OpenSeaNft[]>).value?.map(
              (nft) => ({ ...nft, wallet })
            ) || []
        )
        .flat()
    )
  }

  private async addNftMetadata(nft: OpenSeaNft): Promise<OpenSeaNftExtended> {
    let metadata: OpenSeaNftMetadata = {}
    try {
      const res = await fetch(nft.metadata_url)
      metadata = await res.json()
    } catch (e) {
      console.error(`EthereumCollectiblesProvider | addNftMetadata | error: ${e}`)
    }
    return { ...nft, ...metadata }
  }

  async getCollectionMetadatas(
    addresses: string[]
  ): Promise<{ [address: string]: OpenSeaCollection }> {
    const collections = await Promise.all(
      addresses.map((address) => {
        try {
          return this.openSeaClient.getCollectionMetadata(address)
        } catch (e) {
          console.error(`EthereumCollectiblesProvider | getCollectionMetadatas | error for address ${address}: ${e}`)
          return null
        }
      })
    )
    return collections.reduce((acc, curr, i) => {
      acc[addresses[i]] = curr
      return acc
    }, {})
  }

  async getCollectionMetadatasForCollectibles(
    collectibles: Collectible[]
  ): Promise<Collectible[]> {
    // Build a set of collections to fetch metadata for
    // and fetch them all at once, making sure to not fetch
    // the same collection metadata multiple times.
    const collectionSet = new Set<string>()
    const idToCollectionMap = collectibles.reduce((acc, curr) => {
      // Believe it or not, sometimes, rarely, the type of collection is an object
      // that looks like { name: string, family: string }
      // and sometimes it's a string. I don't know why.
      // Wonder if worth changing the 'collection' type and chasing down all the
      // type errors that would cause just for this irregularity. Probably not for now.
      const collection = curr.collectionSlug
      if (collection) {
        collectionSet.add(collection)
        acc[curr.id] = collection
      }
      return acc
    }, {})
    const collectionMetadatasMap = await this.getCollectionMetadatas(
      Array.from(collectionSet)
    )
    return collectibles.map((collectible) => {
      const collection = idToCollectionMap[collectible.id]
      const collectionMetadata = collection
        ? collectionMetadatasMap[collection]
        : null
      if (collectionMetadata) {
        return {
          ...collectible,
          collectionName: collectionMetadata?.name ?? null,
          collectionImageUrl: collectionMetadata?.image_url ?? null
        }
      }
      return collectible
    })
  }

  async getCollectibles(wallets: string[]): Promise<CollectibleState> {
    return this.getNftsForMultipleWallets(wallets)
      .then(async (nfts) => {
        const assets = await Promise.all(
          nfts.map(async (nft) => this.addNftMetadata(nft))
        )
        const validAssets = assets.filter((asset) => asset && isAssetValid(asset))

        // For assets, build a set of collections to fetch metadata for
        // and fetch them all at once, making sure to not fetch
        // the same collection metadata multiple times.
        const assetCollectionSet = new Set<string>()
        const idToAssetCollectionMap = validAssets.reduce((acc, curr) => {
          // Believe it or not, sometimes, rarely, the type of collection is an object
          // that looks like { name: string, family: string }
          // and sometimes it's a string. I don't know why.
          // Wonder if worth changing the 'collection' type and chasing down all the
          // type errors that would cause just for this irregularity. Probably not for now.
          const collection =
            typeof curr.collection === 'object'
              ? (curr.collection as unknown as any).name ?? ''
              : curr.collection
          assetCollectionSet.add(collection)
          const id = getAssetIdentifier(curr)
          acc[id] = collection
          return acc
        }, {})
        const assetCollectionMetadatasMap = await this.getCollectionMetadatas(
          Array.from(assetCollectionSet)
        )
        validAssets.forEach((asset) => {
          const id = getAssetIdentifier(asset)
          const collection = idToAssetCollectionMap[id]
          const collectionMetadata = assetCollectionMetadatasMap[collection]
          if (collectionMetadata) {
            asset.collectionMetadata = collectionMetadata
          }
        })

        const collectibles = await Promise.all(
          validAssets.map(async (asset) => await assetToCollectible(asset))
        )

        const result = collectibles.reduce(
          (result, collectible) => {
            if (result[collectible.wallet]) {
              result[collectible.wallet].push(collectible)
            } else {
              result[collectible.wallet] = [collectible]
            }
            return result
          },
          {}
        )
        return result
      })
  }
}
