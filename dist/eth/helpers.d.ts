import { OpenSeaAssetExtended, OpenSeaEvent, OpenSeaEventExtended } from 'eth/types';
import { Collectible } from 'utils/types';
export declare const isAssetValid: (asset: OpenSeaAssetExtended) => boolean;
/**
 * Returns a collectible given an asset object from the OpenSea API
 *
 * A lot of the work here is to determine whether a collectible is a gif, a video, or an image
 *
 * If the collectible is a gif, we set the gifUrl, and we process a frame from the gifUrl which we set as its frameUrl
 *
 * If the collectible is a video, we set the videoUrl, and we check whether the asset has an image
 * - if it has an image, we check whether the image url is an actual image or a video (sometimes OpenSea returns
 *   videos in the image url properties of the asset)
 *   - if it's an image, we set it as the frameUrl
 *   - otherwise, we unset the frameUrl
 * - if not, we do not set the frameUrl
 * Video collectibles that do not have a frameUrl will use the video paused at the first frame as the thumbnail
 * in the collectibles tab
 *
 * Otherwise, we consider the collectible to be an image, we get the image url and make sure that it is not
 * a gif or a video
 * - if it's a gif, we follow the above gif logic
 * - if it's a video, we unset the frameUrl and follow the above video logic
 * - otherwise, we set the frameUrl and the imageUrl
 *
 * @param asset
 */
export declare const assetToCollectible: (asset: OpenSeaAssetExtended) => Promise<Collectible>;
export declare const creationEventToCollectible: (event: OpenSeaEventExtended) => Promise<Collectible>;
export declare const transferEventToCollectible: (event: OpenSeaEventExtended, isOwned?: boolean) => Promise<Collectible>;
export declare const isFromNullAddress: (event: OpenSeaEvent) => boolean;
