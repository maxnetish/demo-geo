export enum HerePhonemeType {
    placeName = 'placeName',
    countryName = 'countryName',
    state = 'state',
    county = 'county',
    city = 'city',
    district = 'district',
    subdisctrict = 'subdistrict',
    street = 'street',
    block = 'block',
    subblock = 'subblock',
}

export interface HerePhonemeInfo {
    /**
     * The actual phonetic transcription in the NT-SAMPA format.
     */
    value: string;
    /**
     * The BCP 47 language code.
     */
    language?: string;
    /**
     * Whether or not it is the preferred phoneme.
     */
    preferred?: boolean;
}