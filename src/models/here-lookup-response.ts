import { HereResultType } from './here-result-type';
import { HereHouseNumberType } from './here-house-number-type';
import { HereAddressBlockType } from './here-address-block-type';
import { HereLocalityTypes } from './here-locality-types';
import { HereAdministrativeAreaType } from './here-administrative-area-type';
import { HereAddress } from './here-address';
import { HerePosition } from './here-coords';
import { HereBoundingBox } from './here-bounding-box';
import { HereCategory } from './here-category';
import { HereReferenceSupplierInfo } from './here-reference-supplier-info';
import { HereContactInfo, HereContactType } from './here-contact-info';
import { HereOpeningHours } from './here-opening-hours';
import { HereTimezoneInfo } from './here-timezone-info';
import { HereEvStationInfo } from './here-ev-station-info';
import { HerePhonemeInfo, HerePhonemeType } from './here-phoneme-info';
import { HereStreetInfo } from './here-street-info';
import { HereCountryInfo } from './here-country-info';

export interface HereLookupResponse {
    title: string;
    id: string;
    proliticalView?: string;
    resultType?: HereResultType;
    houseNumberType?: HereHouseNumberType;
    addressBlockType?: HereAddressBlockType;
    localityType?: HereLocalityTypes;
    administrativeAreaType?: HereAdministrativeAreaType;
    houseNumberFallback?: boolean;
    address: HereAddress;
    position: HerePosition;
    access?: HerePosition[];
    mapView?: HereBoundingBox;
    categories?: HereCategory;
    /**
     * The list of chains assigned to this place.
     */
    chains?: { id: string }[];
    references?: HereReferenceSupplierInfo[];
    foodTypes?: HereCategory[];
    contacts?: Partial<Record<HereContactType, HereContactInfo[]>>;
    openingHours?: HereOpeningHours[];
    /**
     * BETA - Provides time zone information for this place.
     * (rendered only if 'show=tz' is provided.)
     */
    timeZone?: HereTimezoneInfo;
    extended?: {
        /**
         * EV charging pool information
         */
        evStation?: HereEvStationInfo;
    };
    phonemes?: Partial<Record<HerePhonemeType, HerePhonemeInfo[]>>;
    /**
     * Street Details (only rendered if 'show=streetInfo' is provided.)
     */
    streetInfo?: HereStreetInfo[];
    /**
     * Country Details (only rendered if 'show=countryInfo' is provided.)
     */
    countryInfo?: HereCountryInfo;
}
