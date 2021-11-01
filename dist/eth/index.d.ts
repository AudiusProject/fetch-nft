import { CollectibleState } from 'utils/types';
export declare type OpenSeaClientProps = {
    apiEndpoint?: string;
    apiKey?: string;
    assetLimit?: number;
};
export declare class OpenSeaClient {
    readonly url: string;
    readonly apiKey: string;
    readonly assetLimit: number;
    constructor(props?: OpenSeaClientProps);
    private getTransferredCollectiblesForWallet;
    private getTransferredCollectiblesForMultipleWallets;
    private getCreatedCollectiblesForWallet;
    private getCreatedCollectiblesForMultipleWallets;
    private getCollectiblesForWallet;
    private getCollectiblesForMultipleWallets;
    getAllCollectibles: (wallets: string[]) => Promise<CollectibleState>;
}
