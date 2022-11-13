/**
 * HERE Geocoding & Search API  v7
 * See https://developer.here.com/documentation/geocoding-search-api/api-reference-swagger.html
 */
export interface HereAddress {
    label?: string;
    countryCode?: string;
    countryName?: string;
    stateCode?: string;
    state?: string;
    countyCode?: string;
    county?: string;
    city?: string;
    district?: string;
    subdistrict?: string;
    street?: string;
    block?: string;
    subblock?: string;
    postalCode?: string;
    houseNumber?: string;
    building?: string;
}
