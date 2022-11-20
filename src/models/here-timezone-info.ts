export interface HereTimezoneInfo {
    /**
     * The name of the time zone as defined in the tz database. For example: "Europe/Berlin"
     */
    name: string;
    /**
     * The UTC offset for this time zone at request time. For example "+02:00"
     */
    utcOffset: string;
}
