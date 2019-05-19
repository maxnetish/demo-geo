export type HereResultType = 'areas' | 'houseNumber' | 'postalCode' | 'street' | 'intersection';

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

export interface IHereSuggestionRequest {
    query?: string;
    /**
     * Default 5. From 1 to 20.
     */
    maxresults?: number;
    /**
     * List of ISO3 country codes (FRA,BEL for example)
     */
    country?: string[];
    /**
     * rectangle to more relevant search in
     */
    mapview?: HereMapRectangle;
    /**
     * Circle to more relevant search in
     */
    prox?: HereMapCircle;
    /**
     * marker of beginning position to highlight
     */
    beginHighlight?: string;
    /**
     * marker of end position to highlight
     */
    endHighlight?: string;
    /**
     * Preferref language as 2-letter ISO code ("it" for example)
     */
    language?: string;
    resultType?: HereResultType;
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

export interface IHereSearchResult {
    Relevance?: number;
    Distance?: number;
    Direction?: number;
    MatchLevel?: 'country' | 'state' | 'county' | 'city' | 'district' | 'street' | 'intersection' | 'houseNumber' | 'postalCode' | 'landmark';
    MatchQuality?: IHereLocationMatchQuality;
    MatchType?: 'pointAddress' | 'interpolated';
    MatchCode?: 'exact' | 'ambiguous' | 'upHierarchy' | 'ambiguousUpHierarchy';
    ParsedRequest?: IHereParsedRequest;
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
    AdditionalData?: IHereKeyValuePair[]
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
export function fetchSuggestions(request: IHereSuggestionRequest): Promise<IHereSuggestion[]> {
    const query = serializeToQuery(request);
    return fetch(`/autocomplete.geocoder.api.here.com/6.2/suggest.json?${query}`, {
        cache: 'default',
        // credentials: 'same-origin',
        method: 'GET',
        // mode: "cors"
    })
        .then((res) => res.json())
        .then((d) => d.suggestions);
}

export function fetchGeocodeDetails(request: { locationId: string }): Promise<any> {
    const query = `locationid=${request.locationId}`;
    return fetch(`/geocoder.api.here.com/6.2/geocode.json?${query}`, {
        cache: "default",
        method: 'GET'
    })
        .then((res) => res.json());
}
