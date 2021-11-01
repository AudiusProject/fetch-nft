import { Nullable } from 'utils/typeUtils';
export declare enum SolanaNFTType {
    METAPLEX = "METAPLEX",
    STAR_ATLAS = "STAR_ATLAS"
}
declare type MetaplexNFTCreator = {
    address: string;
    verified: boolean;
    share: number;
};
export declare type MetaplexNFTPropertiesFile = {
    type: string;
    uri: string;
};
declare type MetaplexNFTProperties = {
    category: string;
    files: (string | MetaplexNFTPropertiesFile)[];
    creators: MetaplexNFTCreator[];
};
export declare type MetaplexNFT = {
    name: string;
    description: Nullable<string>;
    symbol: Nullable<string>;
    image: string;
    animation_url: Nullable<string>;
    external_url: Nullable<string>;
    properties: Nullable<MetaplexNFTProperties>;
};
export declare type StarAtlasNFT = {
    _id: string;
    name: string;
    description: string;
    symbol: string;
    image: string;
    media: {
        thumbnailUrl: string;
    };
    deactivated: boolean;
    createdAt: string;
};
export declare type SolanaNFT = MetaplexNFT | StarAtlasNFT;
export {};
