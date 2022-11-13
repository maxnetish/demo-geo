import {IPromiseWithAbortController} from "../utils/abortable-promise";
import { HereAutocompleteRequest } from '../models/here-autocomplete-request';
import { HereAutocompleteResponse } from '../models/here-autocomplete-response';

// export type HereResultType = 'areas' | 'houseNumber' | 'postalCode' | 'street' | 'intersection';

export interface IHereSuggestion {
    label?: string;
    language?: string;
    countryCode?: string;
    locationId?: string;
    address?: {
        [key: string]: string;
    };
    distance?: number;
    matchLevel?: string;
}

export interface ILatLng {
    lat: number | null;
    lng: number | null;
}

export interface ISerializeToQuery {
    query: string;
}

export function instanceOfISerializeToQuery(obj: any): obj is ISerializeToQuery {
    return obj && typeof obj === 'object' && 'query' in obj;
}

export class HereCoordinate implements ISerializeToQuery {

    public lat: number | null;
    public lng: number | null;

    public get query(): string {
        if (this.lat && this.lng) {
            return `{this.lat},{this.lng}`;
        }
        return '';
    }

    constructor({lat = null, lng = null}: ILatLng = {lat: null, lng: null}) {
        this.lat = lat;
        this.lng = lng;
    }
}

export class HereMapRectangle implements ISerializeToQuery {
    public topLeft: HereCoordinate;
    public bottomRight: HereCoordinate;

    constructor({topLeft, bottomRight}: { topLeft: HereCoordinate, bottomRight: HereCoordinate }) {
        this.topLeft = topLeft;
        this.bottomRight = bottomRight;
    }

    public get query(): string {
        return `${this.topLeft.query};${this.bottomRight.query}`;
    }
}

export class HereMapCircle implements ISerializeToQuery {
    public center: HereCoordinate;
    public radius: number | null;

    constructor({center, radius = null}: { center: HereCoordinate, radius: number | null }) {
        this.center = center;
        this.radius = radius;
    }

    public get query(): string {
        if (this.radius) {
            return `${this.center.query},${this.radius}`;
        }
        return this.center.query;
    }
}

export interface IHereGeocodeRequest {
    additionaldata?: HereRequestAdditionalData;
    addressattributes?: HereAddressAttribute | HereAddressAttribute[];
    bbox?: HereMapRectangle;
    city?: string;
    country?: string | string[];
    countryfocus?: string;
    county?: string;
    district?: string;
    housenumber?: string;
    language?: string;
    locationattributes?: HereLocationAttributes | HereLocationAttributes[];
    locationid?: string;
    mapview?: HereMapRectangle;
    maxresults?: number;
    pageinformation?: string;
    politicalview?: HerePoliticalView;
    postalcode?: string;
    prox?: HereMapCircle;
    responseattributes?: HereResponseAttributes | HereResponseAttributes[];
    searchtext?: string;
    state?: string;
    street?: string;
    strictlanguagemode?: boolean;
}

export type HereResponseAttributes = 'performedSearch' | 'matchQuality' | 'matchType' | 'matchCode' | 'parsedRequest';

export type HerePoliticalView =
    'ARE'
    | 'ARG'
    | 'EGY'
    | 'GRC'
    | 'IND'
    | 'ISR'
    | 'KEN'
    | 'MAR'
    | 'PAK'
    | 'RUS'
    | 'TUR'
    | 'VNM';

export type HereLocationAttributes =
    'address'
    | 'mapReference'
    | 'mapView'
    | 'addressDetails'
    | 'streetDetails'
    | 'additionalData'
    | 'adminIds'
    | 'linkInfo'
    | 'adminInfo'
    | 'timeZone'
    | 'addressNamesBilingual'
    | 'related'
    | 'nearByAddress';

export type HereAddressAttribute =
    'country'
    | 'state'
    | 'county'
    | 'city'
    | 'district'
    | 'subdistrict'
    | 'street'
    | 'houseNumber'
    | 'postalCode'
    | 'addressLines'
    | 'additionalData';

export class HereRequestAdditionalData implements ISerializeToQuery, Iterable<IHereKeyValuePair> {
    private list: IHereKeyValuePair[];

    constructor(...pairs: IHereKeyValuePair[]) {
        this.list = pairs;
    }

    public get query(): string {
        return this.list
            .map((pair) => {
                return `${pair.key},${pair.value}`;
            })
            .join(';');
    }

    public [Symbol.iterator](): Iterator<IHereKeyValuePair> {
        const len = this.list.length;
        let currentInd = 0;
        const self = this;

        return {
            next(value?: any): IteratorResult<IHereKeyValuePair> {
                if (currentInd < len) {
                    return {
                        value: self.list[currentInd++],
                        done: false,
                    };
                }
                return {
                    value: {
                        key: '',
                        value: '',
                    },
                    done: true,
                };
            },
        };
    }
}

export interface IHereGeocodeResponse {
    MetaInfo: IHereSearchResponseMetaInfo;
    View: IHereSearchResultsView[];
}

export interface IHereSearchResultsView {
    ViewId: number;
    PerformedSearch?: object;
    Result?: IHereSearchResult[];
}

export type HereMatchLevel =
    'country'
    | 'state'
    | 'county'
    | 'city'
    | 'district'
    | 'street'
    | 'intersection'
    | 'houseNumber'
    | 'postalCode'
    | 'landmark';

export type HereMatchType = 'pointAddress' | 'interpolated';

export type HereMatchCode = 'exact' | 'ambiguous' | 'upHierarchy' | 'ambiguousUpHierarchy';

export interface IHereSearchResult {
    Relevance?: number;
    Distance?: number;
    Direction?: number;
    MatchLevel?: HereMatchLevel;
    MatchQuality?: IHereLocationMatchQuality;
    MatchType?: HereMatchType;
    MatchCode?: HereMatchCode;
    ParsedRequest?: IHereParsedRequest;
    Location: IHereLocation;
    AdditionalData?: IHereKeyValuePair[];
}

export type HereLocationType =
    'area'
    | 'address'
    | 'trail'
    | 'park'
    | 'lake'
    | 'mountainPeak'
    | 'volcano'
    | 'river'
    | 'golfCourse'
    | 'industrialComplex'
    | 'island'
    | 'woodland'
    | 'cemetery'
    | 'canalWaterChannel'
    | 'bayHarbor'
    | 'airport'
    | 'hospital'
    | 'sportsComplex'
    | 'shoppingCenter'
    | 'universityCollege'
    | 'nativeAmericanReservation'
    | 'railroad'
    | 'militaryBase'
    | 'parkingLot'
    | 'parkingGarage'
    | 'anymalPark'
    | 'beach'
    | 'distanceMarker'
    | 'point';

export interface IHereLocation {
    LocationId: string;
    LocationType?: HereLocationType;
    Name?: string;
    DisplayPosition?: IHereGeoCoordinate;
    NavigationPosition?: IHereGeoCoordinate;
    MapView?: IHereGeoBoundingBox;
    // api docs is mist: 'Well-Known Text' and that's all
    Shape?: any;
    Address?: IHereAddress;
    AddressDetails?: IHereAddressDetails;
    AddressNames?: IHereAddressNames;
    MapReference?: IHereMapReference;
    LinkInfo?: IHereLinkInfo;
    Related?: IHereRelatedLocation[];
    AdditionalData?: IHereKeyValuePair[];
}

export type HereRelatedLocationType = 'nearByDistanceMarker' | 'microPointAddress' | 'nearByAddress';

export interface IHereRelatedLocation {
    Type?: HereRelatedLocationType;
    MatchType?: HereMatchType;
    RouteDistance?: number;
    Direction?: string;
    Location?: IHereLocation;
}

// See https://developer.here.com/documentation/geocoder/topics/resource-type-speed-category.html
export type HereSpeedCategroy = 'SC1' | 'SC2' | 'SC3' | 'SC4' | 'SC5' | 'SC6' | 'SC7' | 'SC8';

export type HereLinkFlag =
    'ControlledAccess'
    | 'MultiDigitized'
    | 'Frontage'
    | 'Paved'
    | 'Ramp'
    | 'Private'
    | 'Tollway'
    | 'PoiAccess'
    | 'FourWheelDrive'
    | 'ParkingLotRoad'
    | 'CarpoolRoad'
    | 'Reversible'
    | 'ExpressLane';

export type HereAccessFlag =
    'Automobiles'
    | 'Buses'
    | 'Taxis'
    | 'Carpools'
    | 'Pedestrians'
    | 'Trucks'
    | 'Deliveries'
    | 'EmergencyVehicle'
    | 'ThroughTraffic'
    | 'Motorcycles';

export interface IHereLinkInfo {
    FunctionalClass?: string;
    TravelDirection?: string;
    SpeedCategory?: HereSpeedCategroy;
    SpeedLimit?: string;
    LinkFlags?: HereLinkFlag[];
    AccessFlags?: HereAccessFlag[];
}

export type HereSideOfStreet = 'left' | 'right' | 'neither';

export interface IHereMapReference {
    ReferenceId?: string;
    MapVersion?: string;
    MapReleaseDate?: string;
    MapId?: string;
    Spot?: number;
    SideOfStreet?: HereSideOfStreet;
    CountryId?: string;
    StateId?: string;
    CountyId?: string;
    CityId?: string;
    DistrictId?: string;
    RoadLinkId?: string;
    BuildingId?: string;
    AddressId?: string;
}

export interface IHereAddressNames {
    Country?: IHereKeyValuePair[];
    State?: IHereKeyValuePair[];
    County?: IHereKeyValuePair[];
    City?: IHereKeyValuePair[];
    Dstrict?: IHereKeyValuePair[];
    Subdistrict?: IHereKeyValuePair[];
    Street?: IHereKeyValuePair[];
}

export interface IHereAddressDetails {
    CountryCode: string;
    Country?: string;
    State?: string;
    County?: string;
    City?: string;
    District?: string;
    Street?: string;
    StreetDetails?: IHereStreetDetails;
    HouseNumber?: string;
    PostalCode?: string;
    Building?: string;
}

export interface IHereStreetDetails {
    BaseName?: string;
    StreetType?: string;
    StreetTypeBefore?: boolean;
    StreetTypeAttached?: boolean;
    Prefix?: string;
    Suffix?: string;
    Direction?: string;
}

export interface IHereAddress {
    Label?: string;
    Country?: string;
    State?: string;
    County?: string;
    City?: string;
    District?: string;
    Subdistrict?: string;
    Street?: string;
    HouseNumber?: string;
    PostalCode?: string;
    Building?: string;
    DistanceMarker?: IHereDistanceMarker;
    AddressLine?: string[];
    AdditionalData?: IHereKeyValuePair[];
}

export interface IHereDistanceMarker {
    Value?: string;
    Offset?: number;
    Unit?: string;
    DirectionOnSign?: string;
}

export interface IHereGeoBoundingBox {
    TopLeft: IHereGeoCoordinate;
    BottomRight: IHereGeoCoordinate;
}

export interface IHereGeoCoordinate {
    Latitude: number;
    Longitude: number;
    Altitude?: number;
}

export interface IHereParsedRequest {
    Name?: string;
    Label?: string;
    Country?: string;
    State?: string;
    County?: string;
    City?: string;
    District?: string;
    Subdistrict?: string;
    Street?: string;
    HouseNumber?: string;
    PostalCode?: string;
    Building?: string;
    AddressLine?: string;
    AdditionalData?: IHereKeyValuePair[];
}

export interface IHereLocationMatchQuality {
    Country?: number;
    State?: number;
    County?: number;
    City?: number;
    District?: number;
    Subdistrict?: number;
    Street?: number;
    HouseNumber?: number;
    PostalCode?: number;
    Building?: number;
}

export interface IHereSearchResponseMetaInfo {
    RequestId?: string;
    Timestamp: string;
    NextPageInformation?: string;
    PreviousPageInformation?: string;
    AdditionalData?: IHereKeyValuePair[];
}

export interface IHereKeyValuePair {
    key: string;
    value: string;
}

function serializeToQuery<T>(req: T): string {
    const resultAsArray: string[] = [];

    if (req) {
        for (const propName in req) {
            if (req.hasOwnProperty(propName) && req[propName]) {
                const propValue = req[propName];
                let propValueAsString: string | null = null;
                if (instanceOfISerializeToQuery(propValue)) {
                    propValueAsString = (propValue as ISerializeToQuery).query;
                } else if (Array.isArray(propValue) && propValue.length) {
                    propValueAsString = propValue.join(',');
                } else if (propValue) {
                    propValueAsString = `${propValue}`;
                }
                if (propValueAsString) {
                    resultAsArray.push(`${propName}=${propValueAsString}`);
                }
            }
        }
    }

    return resultAsArray.join('&');
}

function generalFetchErrHandler(res: Response): Response {
    if (res.ok) {
        return res;
    }
    throw new Error(`Fetch failed with status ${res.status} ${res.statusText}`);
}

function parseJsonBody(res: Response): Promise<any> {
    return res.json();
}


/**
 * Nginx proxy should add app_id and app_code to query
 * like:
 *
 * location ~ ^/(?<apiservice>(autocomplete.geocoder.api.here.com))/(?<pathservice>.*)$  {
 *			set $token "";
 *			if ($is_args) {
 *				set $token "&";
 *			}
 *			set $args "${args}${token}app_id=APP_ID_HERE&app_code=APP_CODE_HERE"; # update args with $token
 *
 *			resolver 8.8.8.8;
 *           proxy_pass https://$apiservice/$pathservice$is_args$args;
 *           proxy_set_header Host $host;
 *			proxy_redirect off;
 *
 *       }
 *
 * @param request
 */
export function fetchAutocomplete(
    request: HereAutocompleteRequest,
): IPromiseWithAbortController<HereAutocompleteResponse> {
    const query = serializeToQuery(request);
    const abortController = new AbortController();

    return {
        promise: fetch(`/autocomplete.search.hereapi.com/v1/autocomplete?${query}`, {
            cache: 'default',
            // credentials: 'same-origin',
            method: 'GET',
            // mode: "cors"
            signal: abortController.signal,
        })
            .then(generalFetchErrHandler)
            .then(parseJsonBody),
        abortController,
    };
}

export function fetchGeocodeDetails(request: IHereGeocodeRequest): IPromiseWithAbortController<IHereGeocodeResponse> {
    const query = serializeToQuery(request);
    const abortController = new AbortController();
    return {
        promise: fetch(`/geocoder.cit.api.here.com/6.2/geocode.json?${query}`, {
            cache: "default",
            method: 'GET',
            signal: abortController.signal,
        })
            .then(generalFetchErrHandler)
            .then(parseJsonBody)
            .then((d) => d.Response),
        abortController,
    };
}
