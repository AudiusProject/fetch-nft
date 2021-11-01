import { SolanaNFT, SolanaNFTType } from 'sol/types';
import { Nullable } from 'utils/typeUtils';
import { Collectible } from 'utils/types';
export declare const solanaNFTToCollectible: (nft: SolanaNFT, address: string, type: SolanaNFTType) => Promise<Nullable<Collectible>>;
