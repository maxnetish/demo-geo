import { HereCategory } from './here-category';

export interface HereOpeningHours {
    /**
     * The list of place categories, this set of opening hours refers to.
     */
    categories?: HereCategory[];
    text: string[];
    isOpen?: boolean;
    structured: {
        /**
         * String with a modified iCalendar DATE-TIME value.
         * The date part is omitted, values starts with the
         * time section maker "T". Example: T132000.
         *
         * See https://datatracker.ietf.org/doc/html/rfc5545#section-3.3.5
         */
        start: string;
        /**
         * String with an iCalendar DURATION value. A closed day has the value PT00:00M.
         * See https://datatracker.ietf.org/doc/html/rfc5545#section-3.3.6
         */
        duration: string;
        /**
         * String with a RECUR rule. Note that, in contrast to the RFC, the assignment
         * operator is a colon : and not an equal sign =.
         * See https://datatracker.ietf.org/doc/html/rfc5545#section-3.3.10
         */
        recurrence: string;
    }[];
}
