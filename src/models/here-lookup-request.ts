/**
 * https://developer.here.com/documentation/geocoding-search-api/api-reference-swagger.html
 */
export interface HereLookupRequest {
    /**
     * Example: id=here:pds:place:276u33db-8097f3194e4b411081b761ea9a366776
     * Location ID, which is the ID of a result item
     */
    id: string;
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
    show?: Array<'countryInfo' | 'phonemes' | 'streetInfo' | 'tz'>;
}
