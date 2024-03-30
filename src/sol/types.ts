import { Metadata } from '@metaplex-foundation/mpl-token-metadata'

import { Nullable } from 'utils/typeUtils'

/* Metaplex types */

type MetaplexNFTCreator = {
  address: string
  verified: boolean
  share: number
}

export type MetaplexNFTPropertiesFile = {
  type: string
  uri: string
}

type MetaplexNFTProperties = {
  files: (string | MetaplexNFTPropertiesFile)[]
  creators: MetaplexNFTCreator[]
  category?: string
}

// may live outside arweave and still have this format
// examples:
// https://cdn.piggygang.com/meta/3ad355d46a9cb2ee57049db4df57088f.json
// https://d1b6hed00dtfsr.cloudfront.net/9086.json
// Also, some nft metadatas are minimal, hence all the many nullable properties
// e.g. https://ipfs.io/ipfs/QmS2BZecgTM5jy1PWzFbxcP6jDsLoq5EbGNmmwCPbi7YNH/6177.json
export type MetaplexNFT = {
  name: string
  description: Nullable<string>
  symbol: Nullable<string>
  image: string
  animation_url: Nullable<string>
  external_url: Nullable<string>
  properties: Nullable<MetaplexNFTProperties>
}

/* Star Atlas types */

// example: https://galaxy.staratlas.com/nfts/2iMhgB4pbdKvwJHVyitpvX5z1NBNypFonUgaSAt9dtDt
export type StarAtlasNFT = {
  _id: string
  name: string
  description: string
  symbol: string
  image: string
  media: {
    thumbnailUrl: string // may be empty string
  }
  deactivated: boolean
  createdAt: string
  solanaChainMetadata: Metadata
}

export type Blocklist = {
  blocklist: string[] // list of urls
  nftBlocklist: string[] // list of nft ids
  stringFilters: {
    nameContains: string[]
    symbolContains: string[]
  }
  contentHash: string
}

/* Helius DAS API types */

export type HeliusCollection = {
  address: string
  name: string
  imageUrl: string
  externalLink: string
}

export type HeliusNFT = {
  interface: string
  id: string
  content: {
    $schema: string
    json_uri: string
    files: {
      uri: string
      mime: string
    }[]
    metadata: {
      description: string
      name: string
      symbol: string
      token_standard: string
    }
    links: {
      image: string
      animation_url: string
      external_url: string
    }
  }
  compression: {
    compressed: boolean
  }
  grouping: {
    group_key: string
    group_value: string
    collection_metadata?: {
      name: string
      symbol: string
      image: string
      description: string
      external_url: string
    }
  }[]
  creators: {
    address: string
    verified: boolean
    share: number
  }[]
  ownership: {
    owner: string
  }
  token_standard: string
  name: string
  description: string
  image_url: string
  metadata_url: string
  opensea_url: string
  // Audius added fields
  wallet: string
}

/* Generic */

export enum SolanaNFTType {
  HELIUS = 'HELIUS',
  METAPLEX = 'METAPLEX',
  STAR_ATLAS = 'STAR_ATLAS'
}

export type SolanaNFT = HeliusNFT | MetaplexNFT | StarAtlasNFT
