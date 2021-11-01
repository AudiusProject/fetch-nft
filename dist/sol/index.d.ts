import { CollectibleState } from 'utils/types';
export declare type SolanaClientProps = {
    rpcEndpoint?: string;
};
export declare class SolanaClient {
    readonly endpoint: string;
    private connection;
    constructor(props?: SolanaClientProps);
    /**
     * for each given wallet:
     * - get and parse its token accounts to get the mint addresses
     * - filter out tokens whose decimal places are not 0
     * - find the metadata PDAs for the mint addresses
     * - get the account infos for the PDAs if they exist
     * - get the metadata urls from the account infos and fetch the metadatas
     * - transform the nft metadatas to Audius-domain collectibles
     */
    getAllCollectibles: (wallets: string[]) => Promise<CollectibleState>;
    /**
     * Decode bytes to get url for nft metadata
     * Check urls based on nft standard e.g. metaplex, or nft collection e.g. solamander, or known domains e.g. ipfs
     * This is because there may be multiple different collections of nfts on e.g. metaplex (arweave), also
     * a given nft collection can have nfts living in different domains e.g. solamander on cloudfront or arweave or etc., also
     * nfts may live in ipfs or other places
     */
    private _utf8ArrayToNFTType;
    private _metaplex;
    private _starAtlas;
    private _jsonExtension;
    private _ipfs;
}
