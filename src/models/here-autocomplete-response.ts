/**
 * HERE Geocoding & Search API  v7
 * See https://developer.here.com/documentation/geocoding-search-api/api-reference-swagger.html
 */
import { HereResultType } from './here-result-type';
import { HereHouseNumberType } from './here-house-number-type';
import { HereLocalityTypes } from './here-locality-types';
import { HereAdministrativeAreaType } from './here-administrative-area-type';
import { HereAddress } from './here-address';
import { HereHighlightRange } from './here-highlight-range';
import { HereStreetInfo } from './here-street-info';

/**
 * https://developer.here.com/documentation/geocoding-search-api/api-reference-swagger.html
 */
export interface HereAutocompleteResponse {
    items: {
        title: string;
        id: string;
        language?: string;
        politicalView?: string;
        resultType?: HereResultType;
        houseNumberType?: HereHouseNumberType;
        localityType?: HereLocalityTypes;
        administrativeAreaType?: HereAdministrativeAreaType;
        address: HereAddress;
        distance?: number;
        highlights?: {
            title?: HereHighlightRange[];
        };
        streetInfo?: HereStreetInfo[];
    }[];
}
