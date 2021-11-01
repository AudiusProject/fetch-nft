import { Buffer } from 'buffer';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey, Connection } from '@solana/web3.js';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

var Chain;
(function (Chain) {
    Chain["ETH"] = "eth";
    Chain["SOL"] = "sol";
})(Chain || (Chain = {}));
var CollectibleMediaType;
(function (CollectibleMediaType) {
    CollectibleMediaType["IMAGE"] = "IMAGE";
    CollectibleMediaType["VIDEO"] = "VIDEO";
    CollectibleMediaType["GIF"] = "GIF";
    CollectibleMediaType["THREE_D"] = "THREE_D";
})(CollectibleMediaType || (CollectibleMediaType = {}));

/**
 * extensions based on OpenSea metadata standards
 * https://docs.opensea.io/docs/metadata-standards
 */
var OPENSEA_AUDIO_EXTENSIONS = ['mp3', 'wav', 'oga'];
var OPENSEA_VIDEO_EXTENSIONS = [
    'gltf',
    'glb',
    'webm',
    'mp4',
    'm4v',
    'ogv',
    'ogg',
    'mov'
];
var SUPPORTED_VIDEO_EXTENSIONS = ['webm', 'mp4', 'ogv', 'ogg', 'mov'];
var SUPPORTED_3D_EXTENSIONS = ['gltf', 'glb'];
var NON_IMAGE_EXTENSIONS = __spreadArray(__spreadArray([], OPENSEA_VIDEO_EXTENSIONS, true), OPENSEA_AUDIO_EXTENSIONS, true);
var NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
var isAssetImage = function (asset) {
    return [
        asset.image_url,
        asset.image_original_url,
        asset.image_preview_url,
        asset.image_thumbnail_url
    ].some(function (url) { return url && NON_IMAGE_EXTENSIONS.every(function (ext) { return !url.endsWith(ext); }); });
};
var areUrlExtensionsSupportedForType = function (asset, extensions) {
    var animation_url = asset.animation_url, animation_original_url = asset.animation_original_url, image_url = asset.image_url, image_original_url = asset.image_original_url, image_preview_url = asset.image_preview_url, image_thumbnail_url = asset.image_thumbnail_url;
    return [
        animation_url || '',
        animation_original_url || '',
        image_url,
        image_original_url,
        image_preview_url,
        image_thumbnail_url
    ].some(function (url) { return url && extensions.some(function (ext) { return url.endsWith(ext); }); });
};
var isAssetVideo = function (asset) {
    return areUrlExtensionsSupportedForType(asset, SUPPORTED_VIDEO_EXTENSIONS);
};
var isAssetThreeDAndIncludesImage = function (asset) {
    return (areUrlExtensionsSupportedForType(asset, SUPPORTED_3D_EXTENSIONS) &&
        isAssetImage(asset));
};
var isAssetGif = function (asset) {
    var _a, _b, _c, _d;
    return !!(((_a = asset.image_url) === null || _a === void 0 ? void 0 : _a.endsWith('.gif')) ||
        ((_b = asset.image_original_url) === null || _b === void 0 ? void 0 : _b.endsWith('.gif')) ||
        ((_c = asset.image_preview_url) === null || _c === void 0 ? void 0 : _c.endsWith('.gif')) ||
        ((_d = asset.image_thumbnail_url) === null || _d === void 0 ? void 0 : _d.endsWith('.gif')));
};
var isAssetValid = function (asset) {
    return (isAssetGif(asset) ||
        isAssetThreeDAndIncludesImage(asset) ||
        isAssetVideo(asset) ||
        isAssetImage(asset));
};
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
var assetToCollectible = function (asset) { return __awaiter(void 0, void 0, void 0, function () {
    var mediaType, frameUrl, imageUrl, videoUrl, threeDUrl, gifUrl, animation_url, animation_original_url, imageUrls, res, hasGifFrame, res, isVideo, res, isGif, isVideo, e_1;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    return __generator(this, function (_m) {
        switch (_m.label) {
            case 0:
                frameUrl = null;
                imageUrl = null;
                videoUrl = null;
                threeDUrl = null;
                gifUrl = null;
                animation_url = asset.animation_url, animation_original_url = asset.animation_original_url;
                imageUrls = [
                    asset.image_url,
                    asset.image_original_url,
                    asset.image_preview_url,
                    asset.image_thumbnail_url
                ];
                _m.label = 1;
            case 1:
                _m.trys.push([1, 10, , 11]);
                if (!isAssetGif(asset)) return [3 /*break*/, 2];
                mediaType = CollectibleMediaType.GIF;
                // frame url for the gif is computed later in the collectibles page
                frameUrl = null;
                gifUrl = imageUrls.find(function (url) { return url === null || url === void 0 ? void 0 : url.endsWith('.gif'); });
                return [3 /*break*/, 9];
            case 2:
                if (!isAssetThreeDAndIncludesImage(asset)) return [3 /*break*/, 4];
                mediaType = CollectibleMediaType.THREE_D;
                threeDUrl = __spreadArray([animation_url, animation_original_url], imageUrls, true).find(function (url) { return url && SUPPORTED_3D_EXTENSIONS.some(function (ext) { return url.endsWith(ext); }); });
                frameUrl = imageUrls.find(function (url) { return url && NON_IMAGE_EXTENSIONS.every(function (ext) { return !url.endsWith(ext); }); });
                return [4 /*yield*/, fetch(frameUrl, { method: 'HEAD' })];
            case 3:
                res = _m.sent();
                hasGifFrame = (_a = res.headers.get('Content-Type')) === null || _a === void 0 ? void 0 : _a.includes('gif');
                if (hasGifFrame) {
                    gifUrl = frameUrl;
                    // frame url for the gif is computed later in the collectibles page
                    frameUrl = null;
                }
                return [3 /*break*/, 9];
            case 4:
                if (!isAssetVideo(asset)) return [3 /*break*/, 7];
                mediaType = CollectibleMediaType.VIDEO;
                frameUrl =
                    (_b = imageUrls.find(function (url) { return url && NON_IMAGE_EXTENSIONS.every(function (ext) { return !url.endsWith(ext); }); })) !== null && _b !== void 0 ? _b : null;
                if (!frameUrl) return [3 /*break*/, 6];
                return [4 /*yield*/, fetch(frameUrl, { method: 'HEAD' })];
            case 5:
                res = _m.sent();
                isVideo = (_c = res.headers.get('Content-Type')) === null || _c === void 0 ? void 0 : _c.includes('video');
                if (isVideo) {
                    frameUrl = null;
                }
                _m.label = 6;
            case 6:
                videoUrl = __spreadArray([animation_url, animation_original_url], imageUrls, true).find(function (url) { return url && SUPPORTED_VIDEO_EXTENSIONS.some(function (ext) { return url.endsWith(ext); }); });
                return [3 /*break*/, 9];
            case 7:
                mediaType = CollectibleMediaType.IMAGE;
                frameUrl = imageUrls.find(function (url) { return !!url; });
                return [4 /*yield*/, fetch(frameUrl, { method: 'HEAD' })];
            case 8:
                res = _m.sent();
                isGif = (_d = res.headers.get('Content-Type')) === null || _d === void 0 ? void 0 : _d.includes('gif');
                isVideo = (_e = res.headers.get('Content-Type')) === null || _e === void 0 ? void 0 : _e.includes('video');
                if (isGif) {
                    mediaType = CollectibleMediaType.GIF;
                    gifUrl = frameUrl;
                    // frame url for the gif is computed later in the collectibles page
                    frameUrl = null;
                }
                else if (isVideo) {
                    mediaType = CollectibleMediaType.VIDEO;
                    frameUrl = null;
                    videoUrl = imageUrls.find(function (url) { return !!url; });
                }
                else {
                    imageUrl = imageUrls.find(function (url) { return !!url; });
                }
                _m.label = 9;
            case 9: return [3 /*break*/, 11];
            case 10:
                e_1 = _m.sent();
                console.error('Error processing collectible', e_1);
                mediaType = CollectibleMediaType.IMAGE;
                frameUrl = imageUrls.find(function (url) { return !!url; });
                imageUrl = frameUrl;
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/, {
                    id: asset.token_id + ":::" + ((_g = (_f = asset.asset_contract) === null || _f === void 0 ? void 0 : _f.address) !== null && _g !== void 0 ? _g : ''),
                    tokenId: asset.token_id,
                    name: (_j = (asset.name || ((_h = asset === null || asset === void 0 ? void 0 : asset.asset_contract) === null || _h === void 0 ? void 0 : _h.name))) !== null && _j !== void 0 ? _j : '',
                    description: asset.description,
                    mediaType: mediaType,
                    frameUrl: frameUrl,
                    imageUrl: imageUrl,
                    videoUrl: videoUrl,
                    threeDUrl: threeDUrl,
                    gifUrl: gifUrl,
                    isOwned: true,
                    dateCreated: null,
                    dateLastTransferred: null,
                    externalLink: asset.external_link,
                    permaLink: asset.permalink,
                    assetContractAddress: (_l = (_k = asset.asset_contract) === null || _k === void 0 ? void 0 : _k.address) !== null && _l !== void 0 ? _l : null,
                    chain: Chain.ETH,
                    wallet: asset.wallet
                }];
        }
    });
}); };
var creationEventToCollectible = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var asset, created_date, collectible;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                asset = event.asset, created_date = event.created_date;
                return [4 /*yield*/, assetToCollectible(asset)];
            case 1:
                collectible = _a.sent();
                return [2 /*return*/, __assign(__assign({}, collectible), { dateCreated: created_date, isOwned: false })];
        }
    });
}); };
var transferEventToCollectible = function (event, isOwned) {
    if (isOwned === void 0) { isOwned = true; }
    return __awaiter(void 0, void 0, void 0, function () {
        var asset, created_date, collectible;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    asset = event.asset, created_date = event.created_date;
                    return [4 /*yield*/, assetToCollectible(asset)];
                case 1:
                    collectible = _a.sent();
                    return [2 /*return*/, __assign(__assign({}, collectible), { isOwned: isOwned, dateLastTransferred: created_date })];
            }
        });
    });
};
var isFromNullAddress = function (event) {
    return event.from_account.address === NULL_ADDRESS;
};

var OPENSEA_API_URL = 'https://api.opensea.io/api/v1';
var parseAssetEventResults = function (results, wallets) {
    return results
        .map(function (result, i) { return ({ result: result, wallet: wallets[i] }); })
        .filter(function (_a) {
        var result = _a.result;
        return result.status === 'fulfilled';
    })
        .map(function (_a) {
        var _b;
        var result = _a.result, wallet = _a.wallet;
        return ((_b = result.value.asset_events) === null || _b === void 0 ? void 0 : _b.map(function (event) { return (__assign(__assign({}, event), { asset: __assign(__assign({}, event.asset), { wallet: wallet }), wallet: wallet })); })) || [];
    })
        .flat();
};
var parseAssetResults = function (results, wallets) {
    return results
        .map(function (result, i) { return ({ result: result, wallet: wallets[i] }); })
        .filter(function (_a) {
        var result = _a.result;
        return result.status === 'fulfilled';
    })
        .map(function (_a) {
        var _b;
        var result = _a.result, wallet = _a.wallet;
        return ((_b = result.value.assets) === null || _b === void 0 ? void 0 : _b.map(function (asset) { return (__assign(__assign({}, asset), { wallet: wallet })); })) || [];
    })
        .flat();
};
var OpenSeaClient = /** @class */ (function () {
    function OpenSeaClient(props) {
        var _this = this;
        var _a, _b, _c;
        this.url = OPENSEA_API_URL;
        this.apiKey = '';
        this.assetLimit = 50;
        this.getTransferredCollectiblesForWallet = function (wallet, limit) {
            if (limit === void 0) { limit = _this.assetLimit; }
            return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, fetch(this.url + "/events?account_address=" + wallet + "&limit=" + limit + "&event_type=transfer&only_opensea=false").then(function (r) { return r.json(); })];
                });
            });
        };
        this.getTransferredCollectiblesForMultipleWallets = function (wallets, limit) {
            if (limit === void 0) { limit = _this.assetLimit; }
            return __awaiter(_this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, Promise.allSettled(wallets.map(function (wallet) { return _this.getTransferredCollectiblesForWallet(wallet, limit); })).then(function (results) { return parseAssetEventResults(results, wallets); })];
                });
            });
        };
        this.getCreatedCollectiblesForWallet = function (wallet, limit) {
            if (limit === void 0) { limit = _this.assetLimit; }
            return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, fetch(this.url + "/events?account_address=" + wallet + "&limit=" + limit + "&event_type=created&only_opensea=false").then(function (r) { return r.json(); })];
                });
            });
        };
        this.getCreatedCollectiblesForMultipleWallets = function (wallets, limit) {
            if (limit === void 0) { limit = _this.assetLimit; }
            return __awaiter(_this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, Promise.allSettled(wallets.map(function (wallet) { return _this.getCreatedCollectiblesForWallet(wallet, limit); })).then(function (results) { return parseAssetEventResults(results, wallets); })];
                });
            });
        };
        this.getCollectiblesForWallet = function (wallet, limit) {
            if (limit === void 0) { limit = _this.assetLimit; }
            return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, fetch(this.url + "/assets?owner=" + wallet + "&limit=" + limit).then(function (r) { return r.json(); })];
                });
            });
        };
        this.getCollectiblesForMultipleWallets = function (wallets, limit) {
            if (limit === void 0) { limit = _this.assetLimit; }
            return __awaiter(_this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, Promise.allSettled(wallets.map(function (wallet) { return _this.getCollectiblesForWallet(wallet, limit); })).then(function (results) { return parseAssetResults(results, wallets); })];
                });
            });
        };
        this.getAllCollectibles = function (wallets) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, Promise.all([
                        this.getCollectiblesForMultipleWallets(wallets),
                        this.getCreatedCollectiblesForMultipleWallets(wallets),
                        this.getTransferredCollectiblesForMultipleWallets(wallets)
                    ]).then(function (_a) {
                        var assets = _a[0], creationEvents = _a[1], transferEvents = _a[2];
                        return __awaiter(_this, void 0, void 0, function () {
                            var filteredAssets, collectibles, collectiblesMap, ownedCollectibleKeySet, firstOwnershipTransferEvents, latestTransferEventsMap;
                            var _this = this;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        filteredAssets = assets.filter(function (asset) { return asset && isAssetValid(asset); });
                                        return [4 /*yield*/, Promise.all(filteredAssets.map(function (asset) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, assetToCollectible(asset)];
                                                    case 1: return [2 /*return*/, _a.sent()];
                                                }
                                            }); }); }))];
                                    case 1:
                                        collectibles = _b.sent();
                                        collectiblesMap = collectibles.reduce(function (acc, curr) {
                                            var _a;
                                            return (__assign(__assign({}, acc), (_a = {}, _a[curr.id] = curr, _a)));
                                        }, {});
                                        ownedCollectibleKeySet = new Set(Object.keys(collectiblesMap));
                                        firstOwnershipTransferEvents = transferEvents
                                            .filter(function (event) {
                                            return (event === null || event === void 0 ? void 0 : event.asset) &&
                                                isAssetValid(event.asset) &&
                                                isFromNullAddress(event);
                                        })
                                            .reduce(function (acc, curr) {
                                            var _a;
                                            var _b;
                                            var _c = curr.asset, token_id = _c.token_id, asset_contract = _c.asset_contract;
                                            var id = token_id + ":::" + ((_b = asset_contract === null || asset_contract === void 0 ? void 0 : asset_contract.address) !== null && _b !== void 0 ? _b : '');
                                            if (acc[id] &&
                                                acc[id].created_date.localeCompare(curr.created_date) > 0) {
                                                return acc;
                                            }
                                            return __assign(__assign({}, acc), (_a = {}, _a[id] = curr, _a));
                                        }, {});
                                        return [4 /*yield*/, Promise.all(Object.entries(firstOwnershipTransferEvents).map(function (entry) { return __awaiter(_this, void 0, void 0, function () {
                                                var id, event, _a, _b;
                                                return __generator(this, function (_c) {
                                                    switch (_c.label) {
                                                        case 0:
                                                            id = entry[0], event = entry[1];
                                                            if (!ownedCollectibleKeySet.has(id)) return [3 /*break*/, 1];
                                                            collectiblesMap[id] = __assign(__assign({}, collectiblesMap[id]), { dateLastTransferred: event.created_date });
                                                            return [3 /*break*/, 3];
                                                        case 1:
                                                            ownedCollectibleKeySet.add(id);
                                                            _a = collectiblesMap;
                                                            _b = id;
                                                            return [4 /*yield*/, transferEventToCollectible(event, false)];
                                                        case 2:
                                                            _a[_b] = _c.sent();
                                                            _c.label = 3;
                                                        case 3: return [2 /*return*/, event];
                                                    }
                                                });
                                            }); }))
                                            // Handle created events
                                        ];
                                    case 2:
                                        _b.sent();
                                        // Handle created events
                                        return [4 /*yield*/, Promise.all(creationEvents
                                                .filter(function (event) { return (event === null || event === void 0 ? void 0 : event.asset) && isAssetValid(event.asset); })
                                                .map(function (event) { return __awaiter(_this, void 0, void 0, function () {
                                                var _a, token_id, asset_contract, id, _b, _c;
                                                var _d;
                                                return __generator(this, function (_e) {
                                                    switch (_e.label) {
                                                        case 0:
                                                            _a = event.asset, token_id = _a.token_id, asset_contract = _a.asset_contract;
                                                            id = token_id + ":::" + ((_d = asset_contract === null || asset_contract === void 0 ? void 0 : asset_contract.address) !== null && _d !== void 0 ? _d : '');
                                                            if (!!ownedCollectibleKeySet.has(id)) return [3 /*break*/, 2];
                                                            _b = collectiblesMap;
                                                            _c = id;
                                                            return [4 /*yield*/, creationEventToCollectible(event)];
                                                        case 1:
                                                            _b[_c] = _e.sent();
                                                            ownedCollectibleKeySet.add(id);
                                                            _e.label = 2;
                                                        case 2: return [2 /*return*/, event];
                                                    }
                                                });
                                            }); }))
                                            // Handle transfers
                                        ];
                                    case 3:
                                        // Handle created events
                                        _b.sent();
                                        latestTransferEventsMap = transferEvents
                                            .filter(function (event) {
                                            return (event === null || event === void 0 ? void 0 : event.asset) &&
                                                isAssetValid(event.asset) &&
                                                !isFromNullAddress(event);
                                        })
                                            .reduce(function (acc, curr) {
                                            var _a;
                                            var _b;
                                            var _c = curr.asset, token_id = _c.token_id, asset_contract = _c.asset_contract;
                                            var id = token_id + ":::" + ((_b = asset_contract === null || asset_contract === void 0 ? void 0 : asset_contract.address) !== null && _b !== void 0 ? _b : '');
                                            if (acc[id] &&
                                                acc[id].created_date.localeCompare(curr.created_date) > 0) {
                                                return acc;
                                            }
                                            return __assign(__assign({}, acc), (_a = {}, _a[id] = curr, _a));
                                        }, {});
                                        return [4 /*yield*/, Promise.all(Object.values(latestTransferEventsMap).map(function (event) { return __awaiter(_this, void 0, void 0, function () {
                                                var _a, token_id, asset_contract, id, _b, _c;
                                                var _d;
                                                return __generator(this, function (_e) {
                                                    switch (_e.label) {
                                                        case 0:
                                                            _a = event.asset, token_id = _a.token_id, asset_contract = _a.asset_contract;
                                                            id = token_id + ":::" + ((_d = asset_contract === null || asset_contract === void 0 ? void 0 : asset_contract.address) !== null && _d !== void 0 ? _d : '');
                                                            if (!ownedCollectibleKeySet.has(id)) return [3 /*break*/, 1];
                                                            collectiblesMap[id] = __assign(__assign({}, collectiblesMap[id]), { dateLastTransferred: event.created_date });
                                                            return [3 /*break*/, 3];
                                                        case 1:
                                                            if (!wallets.includes(event.to_account.address)) return [3 /*break*/, 3];
                                                            ownedCollectibleKeySet.add(id);
                                                            _b = collectiblesMap;
                                                            _c = id;
                                                            return [4 /*yield*/, transferEventToCollectible(event)];
                                                        case 2:
                                                            _b[_c] = _e.sent();
                                                            _e.label = 3;
                                                        case 3: return [2 /*return*/, event];
                                                    }
                                                });
                                            }); }))];
                                    case 4:
                                        _b.sent();
                                        return [2 /*return*/, Object.values(collectiblesMap).reduce(function (result, collectible) {
                                                var _a;
                                                return (__assign(__assign({}, result), (_a = {}, _a[collectible.wallet] = (result[collectible.wallet] || []).concat([
                                                    collectible
                                                ]), _a)));
                                            }, {})];
                                }
                            });
                        });
                    })];
            });
        }); };
        this.url = (_a = props === null || props === void 0 ? void 0 : props.apiEndpoint) !== null && _a !== void 0 ? _a : this.url;
        this.apiKey = (_b = props === null || props === void 0 ? void 0 : props.apiKey) !== null && _b !== void 0 ? _b : this.apiKey;
        this.assetLimit = (_c = props === null || props === void 0 ? void 0 : props.assetLimit) !== null && _c !== void 0 ? _c : this.assetLimit;
    }
    return OpenSeaClient;
}());

var SolanaNFTType;
(function (SolanaNFTType) {
    SolanaNFTType["METAPLEX"] = "METAPLEX";
    SolanaNFTType["STAR_ATLAS"] = "STAR_ATLAS";
})(SolanaNFTType || (SolanaNFTType = {}));

/**
 * NFT is a gif if it has a file with MIME type image/gif
 * if it's a gif, we compute an image frame from the gif
 */
var nftGif = function (nft) { return __awaiter(void 0, void 0, void 0, function () {
    var gifFile, url;
    var _a, _b;
    return __generator(this, function (_c) {
        gifFile = ((_b = (_a = nft.properties) === null || _a === void 0 ? void 0 : _a.files) !== null && _b !== void 0 ? _b : []).find(function (file) { return typeof file === 'object' && file.type === 'image/gif'; });
        if (gifFile) {
            url = gifFile.uri;
            return [2 /*return*/, {
                    collectibleMediaType: CollectibleMediaType.GIF,
                    url: url,
                    frameUrl: null
                }];
        }
        return [2 /*return*/, null];
    });
}); };
/**
 * NFT is a 3D object if:
 * - its category is vr, or
 * - it has an animation url that ends in glb, or
 * - it has a file whose type is glb, or
 *
 * if the 3D has a poster/thumbnail, it would be:
 * - either in the image property, or
 * - the properties files with a type of image
 */
var nftThreeDWithFrame = function (nft) { return __awaiter(void 0, void 0, void 0, function () {
    var files, objFile, objUrl, is3DObject, frameUrl, imageFile, url;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
        files = (_b = (_a = nft.properties) === null || _a === void 0 ? void 0 : _a.files) !== null && _b !== void 0 ? _b : [];
        objFile = files.find(function (file) { return typeof file === 'object' && file.type.includes('glb'); });
        objUrl = files.find(function (file) { return typeof file === 'string' && file.endsWith('glb'); });
        is3DObject = ((_c = nft.properties) === null || _c === void 0 ? void 0 : _c.category) === 'vr' ||
            ((_d = nft.animation_url) === null || _d === void 0 ? void 0 : _d.endsWith('glb')) ||
            objFile ||
            objUrl;
        if (is3DObject) {
            frameUrl = void 0;
            if (!nft.image.endsWith('glb')) {
                frameUrl = nft.image;
            }
            else {
                imageFile = files === null || files === void 0 ? void 0 : files.find(function (file) { return typeof file === 'object' && file.type.includes('image'); });
                if (imageFile) {
                    frameUrl = imageFile.uri;
                }
            }
            if (frameUrl) {
                url = void 0;
                if (nft.animation_url && nft.animation_url.endsWith('glb')) {
                    url = nft.animation_url;
                }
                else if (objFile) {
                    url = objFile.uri;
                }
                else if (objUrl) {
                    url = objUrl;
                }
                else {
                    return [2 /*return*/, null];
                }
                return [2 /*return*/, {
                        collectibleMediaType: CollectibleMediaType.THREE_D,
                        url: url,
                        frameUrl: frameUrl
                    }];
            }
        }
        return [2 /*return*/, null];
    });
}); };
/**
 * NFT is a video if:
 * - its category is video, or
 * - it has an animation url that does not end in glb, or
 * - it has a file whose type is video, or
 * - it has a file whose url includes watch.videodelivery.net
 *
 * if the video has a poster/thumbnail, it would be in the image property
 * otherwise, we later use the first video frame as the thumbnail
 */
var nftVideo = function (nft) { return __awaiter(void 0, void 0, void 0, function () {
    var files, videoFile, videoUrl, isVideo, url;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        files = (_b = (_a = nft.properties) === null || _a === void 0 ? void 0 : _a.files) !== null && _b !== void 0 ? _b : [];
        videoFile = files.find(function (file) {
            return typeof file === 'object' &&
                file.type.includes('video') &&
                !file.type.endsWith('glb');
        });
        videoUrl = files.find(function (file) {
            return typeof file === 'string' &&
                // https://github.com/metaplex-foundation/metaplex/blob/397ceff70b3524aa0543540584c7200c79b198a0/js/packages/web/src/components/ArtContent/index.tsx#L107
                file.startsWith('https://watch.videodelivery.net/');
        });
        isVideo = ((_c = nft.properties) === null || _c === void 0 ? void 0 : _c.category) === 'video' ||
            (nft.animation_url && !nft.animation_url.endsWith('glb')) ||
            videoFile ||
            videoUrl;
        if (isVideo) {
            url = void 0;
            if (nft.animation_url && !nft.animation_url.endsWith('glb')) {
                url = nft.animation_url;
            }
            else if (videoFile) {
                url = videoFile.uri;
            }
            else if (videoUrl) {
                url = videoUrl;
            }
            else if (files.length) {
                // if there is only one file, then that's the video
                // otherwise, the second file is the video (the other files are image/audio files)
                // https://github.com/metaplex-foundation/metaplex/blob/397ceff70b3524aa0543540584c7200c79b198a0/js/packages/web/src/components/ArtContent/index.tsx#L103
                if (files.length === 1) {
                    url = typeof files[0] === 'object' ? files[0].uri : files[0];
                }
                else {
                    url = typeof files[1] === 'object' ? files[1].uri : files[1];
                }
            }
            else {
                return [2 /*return*/, null];
            }
            return [2 /*return*/, {
                    collectibleMediaType: CollectibleMediaType.VIDEO,
                    url: url,
                    frameUrl: nft.image || null
                }];
        }
        return [2 /*return*/, null];
    });
}); };
/**
 * NFT is an image if:
 * - its category is image, or
 * - it has a file whose type is image, or
 * - it has an image property
 */
var nftImage = function (nft) { return __awaiter(void 0, void 0, void 0, function () {
    var files, imageFile, isImage, url;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        files = (_b = (_a = nft.properties) === null || _a === void 0 ? void 0 : _a.files) !== null && _b !== void 0 ? _b : [];
        imageFile = files.find(function (file) { return typeof file === 'object' && file.type.includes('image'); });
        isImage = ((_c = nft.properties) === null || _c === void 0 ? void 0 : _c.category) === 'image' || nft.image.length || imageFile;
        if (isImage) {
            url = void 0;
            if (nft.image.length) {
                url = nft.image;
            }
            else if (imageFile) {
                url = imageFile.uri;
            }
            else if (files.length) {
                if (files.length === 1) {
                    url = typeof files[0] === 'object' ? files[0].uri : files[0];
                }
                else {
                    url = typeof files[1] === 'object' ? files[1].uri : files[1];
                }
            }
            else {
                return [2 /*return*/, null];
            }
            return [2 /*return*/, {
                    collectibleMediaType: CollectibleMediaType.IMAGE,
                    url: url,
                    frameUrl: url
                }];
        }
        return [2 /*return*/, null];
    });
}); };
/**
 * If not easily discoverable tha nft is gif/video/image, we check whether it has files
 * if it does not, then we discard the nft
 * otherwise, we fetch the content type of the first file and check its MIME type:
 * - if gif, we also compute an image frame from it
 * - if video, we later use the first video frame as the thumbnail
 * - if image, the image url is also the frame url
 */
var nftComputedMedia = function (nft) { return __awaiter(void 0, void 0, void 0, function () {
    var files, url, headResponse, contentType;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                files = (_b = (_a = nft.properties) === null || _a === void 0 ? void 0 : _a.files) !== null && _b !== void 0 ? _b : [];
                if (!files.length) {
                    return [2 /*return*/, null];
                }
                url = typeof files[0] === 'object' ? files[0].uri : files[0];
                return [4 /*yield*/, fetch(url, { method: 'HEAD' })];
            case 1:
                headResponse = _c.sent();
                contentType = headResponse.headers.get('Content-Type');
                if (contentType === null || contentType === void 0 ? void 0 : contentType.includes('gif')) {
                    // frame url for the gif is computed later in the collectibles page
                    return [2 /*return*/, {
                            collectibleMediaType: CollectibleMediaType.GIF,
                            url: url,
                            frameUrl: null
                        }];
                }
                if (contentType === null || contentType === void 0 ? void 0 : contentType.includes('video')) {
                    return [2 /*return*/, {
                            collectibleMediaType: CollectibleMediaType.VIDEO,
                            url: url,
                            frameUrl: null
                        }];
                }
                if (contentType === null || contentType === void 0 ? void 0 : contentType.includes('image')) {
                    return [2 /*return*/, {
                            collectibleMediaType: CollectibleMediaType.IMAGE,
                            url: url,
                            frameUrl: url
                        }];
                }
                return [2 /*return*/, null];
        }
    });
}); };
var metaplexNFTToCollectible = function (nft, address) { return __awaiter(void 0, void 0, void 0, function () {
    var identifier, collectible, _a, url, frameUrl, collectibleMediaType, _b, _c, _d, _e;
    var _f, _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                identifier = [nft.symbol, nft.name, nft.image]
                    .filter(Boolean)
                    .join(':::');
                collectible = {
                    id: identifier,
                    tokenId: identifier,
                    name: nft.name,
                    description: nft.description,
                    externalLink: nft.external_url,
                    isOwned: true,
                    chain: Chain.SOL
                };
                if (((_g = (_f = nft.properties) === null || _f === void 0 ? void 0 : _f.creators) !== null && _g !== void 0 ? _g : []).some(function (creator) { return creator.address === address; })) {
                    collectible.isOwned = false;
                }
                return [4 /*yield*/, nftGif(nft)];
            case 1:
                _e = (_h.sent());
                if (_e) return [3 /*break*/, 3];
                return [4 /*yield*/, nftThreeDWithFrame(nft)];
            case 2:
                _e = (_h.sent());
                _h.label = 3;
            case 3:
                _d = _e;
                if (_d) return [3 /*break*/, 5];
                return [4 /*yield*/, nftVideo(nft)];
            case 4:
                _d = (_h.sent());
                _h.label = 5;
            case 5:
                _c = _d;
                if (_c) return [3 /*break*/, 7];
                return [4 /*yield*/, nftImage(nft)];
            case 6:
                _c = (_h.sent());
                _h.label = 7;
            case 7:
                _b = _c;
                if (_b) return [3 /*break*/, 9];
                return [4 /*yield*/, nftComputedMedia(nft)];
            case 8:
                _b = (_h.sent());
                _h.label = 9;
            case 9:
                _a = (_b), url = _a.url, frameUrl = _a.frameUrl, collectibleMediaType = _a.collectibleMediaType;
                collectible.frameUrl = frameUrl;
                collectible.mediaType = collectibleMediaType;
                if (collectibleMediaType === CollectibleMediaType.GIF) {
                    collectible.gifUrl = url;
                }
                else if (collectibleMediaType === CollectibleMediaType.THREE_D) {
                    collectible.threeDUrl = url;
                }
                else if (collectibleMediaType === CollectibleMediaType.VIDEO) {
                    collectible.videoUrl = url;
                }
                else if (collectibleMediaType === CollectibleMediaType.IMAGE) {
                    collectible.imageUrl = url;
                }
                return [2 /*return*/, collectible];
        }
    });
}); };
var starAtlasNFTToCollectible = function (nft) { return __awaiter(void 0, void 0, void 0, function () {
    var identifier, collectible, is3DObj, hasImageFrame;
    var _a, _b, _c, _d, _e, _f;
    return __generator(this, function (_g) {
        identifier = [nft._id, nft.symbol, nft.name, nft.image]
            .filter(Boolean)
            .join(':::');
        collectible = {
            id: identifier,
            tokenId: nft._id,
            name: nft.name,
            description: nft.description,
            isOwned: true,
            chain: Chain.SOL
        };
        is3DObj = [nft.image, (_a = nft.media) === null || _a === void 0 ? void 0 : _a.thumbnailUrl]
            .filter(Boolean)
            .some(function (item) { return ['glb', 'gltf'].some(function (extension) { return item.endsWith(extension); }); });
        hasImageFrame = [nft.image, (_b = nft.media) === null || _b === void 0 ? void 0 : _b.thumbnailUrl]
            .filter(Boolean)
            .some(function (item) { return ['glb', 'gltf'].every(function (extension) { return !item.endsWith(extension); }); });
        if (is3DObj && hasImageFrame) {
            collectible.mediaType = CollectibleMediaType.THREE_D;
            collectible.threeDUrl = ['glb', 'gltf'].some(function (extension) {
                return nft.image.endsWith(extension);
            })
                ? nft.image
                : (_c = nft.media) === null || _c === void 0 ? void 0 : _c.thumbnailUrl;
            collectible.frameUrl = ['glb', 'gltf'].every(function (extension) { return !nft.image.endsWith(extension); })
                ? nft.image
                : (_d = nft.media) === null || _d === void 0 ? void 0 : _d.thumbnailUrl;
        }
        else {
            collectible.mediaType = CollectibleMediaType.IMAGE;
            collectible.imageUrl = nft.image;
            collectible.frameUrl = ((_f = (_e = nft.media) === null || _e === void 0 ? void 0 : _e.thumbnailUrl) === null || _f === void 0 ? void 0 : _f.length)
                ? nft.media.thumbnailUrl
                : nft.image;
        }
        collectible.dateCreated = nft.createdAt;
        return [2 /*return*/, collectible];
    });
}); };
var solanaNFTToCollectible = function (nft, address, type) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (type) {
            case SolanaNFTType.METAPLEX:
                return [2 /*return*/, metaplexNFTToCollectible(nft, address)];
            case SolanaNFTType.STAR_ATLAS:
                return [2 /*return*/, starAtlasNFTToCollectible(nft)];
            default:
                return [2 /*return*/, null];
        }
    });
}); };

var SOLANA_CLUSTER_ENDPOINT = 'https://api.mainnet-beta.solana.com';
var METADATA_PROGRAM_ID_PUBLIC_KEY = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
var SolanaClient = /** @class */ (function () {
    function SolanaClient(props) {
        var _this = this;
        var _a;
        this.endpoint = SOLANA_CLUSTER_ENDPOINT;
        this.connection = null;
        /**
         * for each given wallet:
         * - get and parse its token accounts to get the mint addresses
         * - filter out tokens whose decimal places are not 0
         * - find the metadata PDAs for the mint addresses
         * - get the account infos for the PDAs if they exist
         * - get the metadata urls from the account infos and fetch the metadatas
         * - transform the nft metadatas to Audius-domain collectibles
         */
        this.getAllCollectibles = function (wallets) { return __awaiter(_this, void 0, void 0, function () {
            var connection_1, tokenAccountsByOwnerAddress, potentialNFTsByOwnerAddress, nfts, solanaCollectibles, e_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (this.connection === null)
                            throw new Error('No connection');
                        connection_1 = this.connection;
                        return [4 /*yield*/, Promise.all(wallets.map(function (address) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, connection_1.getParsedTokenAccountsByOwner(new PublicKey(address), {
                                            programId: TOKEN_PROGRAM_ID
                                        })];
                                });
                            }); }))];
                    case 1:
                        tokenAccountsByOwnerAddress = _a.sent();
                        potentialNFTsByOwnerAddress = tokenAccountsByOwnerAddress
                            .map(function (ta) { return ta.value; })
                            // value is an array of parsed token info
                            .map(function (value) {
                            var mintAddresses = value
                                .map(function (v) { return ({
                                mint: v.account.data.parsed.info.mint,
                                tokenAmount: v.account.data.parsed.info.tokenAmount
                            }); })
                                .filter(function (_a) {
                                var tokenAmount = _a.tokenAmount;
                                // Filter out the token if we don't have any balance
                                var ownsNFT = tokenAmount.amount !== '0';
                                // Filter out the tokens that don't have 0 decimal places.
                                // NFTs really should have 0
                                var hasNoDecimals = tokenAmount.decimals === 0;
                                return ownsNFT && hasNoDecimals;
                            })
                                .map(function (_a) {
                                var mint = _a.mint;
                                return mint;
                            });
                            return { mintAddresses: mintAddresses };
                        });
                        return [4 /*yield*/, Promise.all(potentialNFTsByOwnerAddress.map(function (_a) {
                                var mintAddresses = _a.mintAddresses;
                                return __awaiter(_this, void 0, void 0, function () {
                                    var programAddresses, accountInfos, nonNullInfos, metadataUrls, results, metadatas;
                                    var _this = this;
                                    var _b;
                                    return __generator(this, function (_c) {
                                        switch (_c.label) {
                                            case 0: return [4 /*yield*/, Promise.all(mintAddresses.map(function (mintAddress) { return __awaiter(_this, void 0, void 0, function () {
                                                    return __generator(this, function (_a) {
                                                        switch (_a.label) {
                                                            case 0: return [4 /*yield*/, PublicKey.findProgramAddress([
                                                                    Buffer.from('metadata'),
                                                                    METADATA_PROGRAM_ID_PUBLIC_KEY.toBytes(),
                                                                    new PublicKey(mintAddress).toBytes()
                                                                ], METADATA_PROGRAM_ID_PUBLIC_KEY)];
                                                            case 1: return [2 /*return*/, (_a.sent())[0]];
                                                        }
                                                    });
                                                }); }))];
                                            case 1:
                                                programAddresses = _c.sent();
                                                return [4 /*yield*/, connection_1.getMultipleAccountsInfo(programAddresses)];
                                            case 2:
                                                accountInfos = _c.sent();
                                                nonNullInfos = (_b = accountInfos === null || accountInfos === void 0 ? void 0 : accountInfos.filter(Boolean)) !== null && _b !== void 0 ? _b : [];
                                                metadataUrls = nonNullInfos
                                                    .map(function (x) { return _this._utf8ArrayToNFTType(x.data); })
                                                    .filter(Boolean);
                                                return [4 /*yield*/, Promise.all(metadataUrls.map(function (item) { return __awaiter(_this, void 0, void 0, function () {
                                                        return __generator(this, function (_a) {
                                                            return [2 /*return*/, fetch(item.url)
                                                                    .then(function (res) { return res.json(); })
                                                                    .catch(function () { return null; })];
                                                        });
                                                    }); }))];
                                            case 3:
                                                results = _c.sent();
                                                metadatas = results.filter(Boolean).map(function (metadata, i) { return ({
                                                    metadata: metadata,
                                                    type: metadataUrls[i].type
                                                }); });
                                                return [2 /*return*/, metadatas.filter(function (r) { return !!r.metadata; })];
                                        }
                                    });
                                });
                            }))];
                    case 2:
                        nfts = _a.sent();
                        return [4 /*yield*/, Promise.all(nfts.map(function (nftsForAddress, i) { return __awaiter(_this, void 0, void 0, function () {
                                var collectibles;
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, Promise.all(nftsForAddress.map(function (nft) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, solanaNFTToCollectible(nft.metadata, wallets[i], nft.type)];
                                                    case 1: return [2 /*return*/, _a.sent()];
                                                }
                                            }); }); }))];
                                        case 1:
                                            collectibles = _a.sent();
                                            return [2 /*return*/, collectibles.filter(Boolean)];
                                    }
                                });
                            }); }))];
                    case 3:
                        solanaCollectibles = _a.sent();
                        return [2 /*return*/, solanaCollectibles.reduce(function (result, collectibles, i) {
                                var _a;
                                return (__assign(__assign({}, result), (_a = {}, _a[wallets[i]] = collectibles, _a)));
                            }, {})];
                    case 4:
                        e_1 = _a.sent();
                        console.error('Unable to get collectibles', e_1);
                        return [2 /*return*/, Promise.resolve({})];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        /**
         * Decode bytes to get url for nft metadata
         * Check urls based on nft standard e.g. metaplex, or nft collection e.g. solamander, or known domains e.g. ipfs
         * This is because there may be multiple different collections of nfts on e.g. metaplex (arweave), also
         * a given nft collection can have nfts living in different domains e.g. solamander on cloudfront or arweave or etc., also
         * nfts may live in ipfs or other places
         */
        this._utf8ArrayToNFTType = function (array) {
            var text = new TextDecoder().decode(array);
            // for the sake of simplicty/readability/understandability, we check the decoded url
            // one by one against metaplex, star atlas, and others
            return (_this._metaplex(text) ||
                _this._starAtlas(text) ||
                _this._jsonExtension(text) ||
                _this._ipfs(text));
        };
        this._metaplex = function (text) {
            var query = 'https://';
            var startIndex = text.indexOf(query);
            if (startIndex === -1)
                return null;
            // metaplex standard nfts live in arweave, see link below
            // https://github.com/metaplex-foundation/metaplex/blob/81023eb3e52c31b605e1dcf2eb1e7425153600cd/js/packages/web/src/contexts/meta/processMetaData.ts#L29
            var isMetaplex = text.includes('arweave');
            var foundNFTUrl = startIndex > -1 && isMetaplex;
            if (!foundNFTUrl)
                return null;
            var suffix = '/';
            var suffixIndex = text.indexOf(suffix, startIndex + query.length);
            if (suffixIndex === -1)
                return null;
            var hashLength = 43;
            var endIndex = suffixIndex + suffix.length + hashLength;
            var url = text.substring(startIndex, endIndex);
            return {
                type: SolanaNFTType.METAPLEX,
                url: url
            };
        };
        this._starAtlas = function (text) {
            var query = 'https://';
            var startIndex = text.indexOf(query);
            if (startIndex === -1)
                return null;
            // star atlas nfts live in https://galaxy.staratlas.com/nfts/...
            var isStarAtlas = text.includes('staratlas');
            var foundNFTUrl = startIndex > -1 && isStarAtlas;
            if (!foundNFTUrl)
                return null;
            var suffix = '/nfts/';
            var suffixIndex = text.indexOf(suffix, startIndex + query.length);
            if (suffixIndex === -1)
                return null;
            var hashLength = 44;
            var endIndex = suffixIndex + suffix.length + hashLength;
            var url = text.substring(startIndex, endIndex);
            return {
                type: SolanaNFTType.STAR_ATLAS,
                url: url
            };
        };
        this._jsonExtension = function (text) {
            // Look for 'https://<...>.json' and that will be the metadata location
            // examples:
            // https://d1b6hed00dtfsr.cloudfront.net/9086.json
            // https://cdn.piggygang.com/meta/3ad355d46a9cb2ee57049db4df57088f.json
            var query = 'https://';
            var startIndex = text.indexOf(query);
            if (startIndex === -1)
                return null;
            var extension = '.json';
            var extensionIndex = text.indexOf(extension);
            var foundNFTUrl = startIndex > -1 && extensionIndex > -1;
            if (!foundNFTUrl)
                return null;
            var endIndex = extensionIndex + extension.length;
            var url = text.substring(startIndex, endIndex);
            return {
                type: SolanaNFTType.METAPLEX,
                url: url
            };
        };
        this._ipfs = function (text) {
            // Look for 'https://ipfs.io/ipfs/<...alphanumeric...>' and that will be the metadata location
            // e.g. https://ipfs.io/ipfs/QmWJC47JYuvxYw63cRq81bBNGFXPjhQH8nXg71W5JeRMrC
            var query = 'https://';
            var startIndex = text.indexOf(query);
            if (startIndex === -1)
                return null;
            var isIpfs = text.includes('ipfs');
            var foundNFTUrl = startIndex > -1 && isIpfs;
            if (!foundNFTUrl)
                return null;
            var suffix = '/ipfs/';
            var suffixIndex = text.indexOf(suffix, startIndex + query.length);
            if (suffixIndex === -1)
                return null;
            var endIndex = suffixIndex + suffix.length;
            while (/[a-zA-Z0-9]/.test(text.charAt(endIndex++))) { }
            var url = text.substring(startIndex, endIndex);
            return {
                type: SolanaNFTType.METAPLEX,
                url: url
            };
        };
        this.endpoint = (_a = props === null || props === void 0 ? void 0 : props.rpcEndpoint) !== null && _a !== void 0 ? _a : this.endpoint;
        try {
            this.connection = new Connection(this.endpoint, 'confirmed');
        }
        catch (e) {
            console.error('Could not create Solana RPC connection', e);
            this.connection = null;
        }
    }
    return SolanaClient;
}());

var FetchNFTClient = /** @class */ (function () {
    function FetchNFTClient(props) {
        var _this = this;
        var _a, _b;
        this.getEthereumCollectibles = function (wallets) { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!wallets.length) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.ethClient.getAllCollectibles(wallets)];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = {};
                        _b.label = 3;
                    case 3: return [2 /*return*/, (_a)];
                }
            });
        }); };
        this.getSolanaCollectibles = function (wallets) { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!wallets.length) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.solClient.getAllCollectibles(wallets)];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = {};
                        _b.label = 3;
                    case 3: return [2 /*return*/, (_a)];
                }
            });
        }); };
        this.getCollectibles = function (args) { return __awaiter(_this, void 0, void 0, function () {
            var _a, ethCollectibles, solCollectibles, e_1;
            var _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Promise.all([
                                this.getEthereumCollectibles((_b = args.ethWallets) !== null && _b !== void 0 ? _b : []),
                                this.getSolanaCollectibles((_c = args.solWallets) !== null && _c !== void 0 ? _c : [])
                            ])];
                    case 1:
                        _a = _d.sent(), ethCollectibles = _a[0], solCollectibles = _a[1];
                        return [2 /*return*/, { ethCollectibles: ethCollectibles, solCollectibles: solCollectibles }];
                    case 2:
                        e_1 = _d.sent();
                        console.error(e_1.message);
                        return [2 /*return*/, e_1];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.ethClient = new OpenSeaClient((_a = props === null || props === void 0 ? void 0 : props.openSeaConfig) !== null && _a !== void 0 ? _a : {});
        this.solClient = new SolanaClient((_b = props === null || props === void 0 ? void 0 : props.solanaConfig) !== null && _b !== void 0 ? _b : {});
    }
    return FetchNFTClient;
}());

export { FetchNFTClient };
//# sourceMappingURL=index.es.js.map
