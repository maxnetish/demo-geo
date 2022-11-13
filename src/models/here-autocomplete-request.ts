/**
 * HERE Geocoding & Search API  v7
 * See https://developer.here.com/documentation/geocoding-search-api/api-reference-swagger.html
 */
import { HereLocalityTypes } from './here-locality-types';

export interface HereAutocompleteRequest {
    /**
     * Required.
     * Enter a free-text query.
     */
    q: string;
    /**
     * Specify the center of the search context expressed as coordinates
     * Format: {latitude},{longitude}
     * Type: {decimal},{decimal}
     * Example: -13.163068,-72.545128 (Machu Picchu Mountain, Peru)
     */
    at?: [number, number];
    /**
     * Search within a geographic area. This is a hard filter. Results will be returned
     * if they are located within the specified area.
     *  ISO 3166-1 alpha-3 country codes, comma-separated.
     *  Like: countryCode:CAN,MEX,USA
     */
    in?: string[];
    /**
     * Default: 5
     * Maximum number of results to be returned.
     */
    limit?: number;
    /**
     * One or more of "area", "city", "postalCode".
     * * city - restricting results to result type locality and locality type city
     * * postalCode - restricting results to result type locality and locality type postalCode
     * * area - restricting results to result types: locality or administrativeArea including all the sub-types
     */
    types?: HereLocalityTypes[];
    /**
     * Select the preferred response language for result rendering from a list
     * of BCP47 compliant Language Codes. The autocomplete endpoint tries to detect
     * the query language based on matching name variants and then chooses the same
     * language for the response.
     */
    lang?: string[];
    /**
     * Toggle the political view.
     *
     * This parameter accepts single ISO 3166-1 alpha-3 country code.
     * The country codes are to be provided in all uppercase.
     * Exampple: "RUS" expressing the Russian view on Crimea
     */
    politicalView?: string;
    /**
     * Select additional fields to be rendered in the response. Please note that some
     * of the fields involve additional webservice calls and can increase the overall
     * response time.
     */
    show?: Array<'streetInfo'>;
}
