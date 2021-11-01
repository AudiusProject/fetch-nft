import { OpenSeaClientProps } from 'eth';
import { SolanaClientProps } from 'sol';
import { Collectible, CollectibleState } from 'utils/types';
declare type FetchNFTClientProps = {
    openSeaConfig?: OpenSeaClientProps;
    solanaConfig?: SolanaClientProps;
};
export declare class FetchNFTClient {
    private ethClient;
    private solClient;
    constructor(props?: FetchNFTClientProps);
    getEthereumCollectibles: (wallets: string[]) => Promise<CollectibleState>;
    getSolanaCollectibles: (wallets: string[]) => Promise<CollectibleState>;
    getCollectibles: (args: {
        ethWallets?: string[];
        solWallets?: string[];
    }) => Promise<{
        ethCollectibles: CollectibleState;
        solCollectibles: CollectibleState;
    }>;
}
export { Collectible, CollectibleState };
