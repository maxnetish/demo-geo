import { HereCategory } from './here-category';

export enum HereContactType {
    phone = 'phone',
    mobile = 'mobile',
    tollFree = 'tollFree',
    fax = 'fax',
    www = 'www',
    email = 'email',
}

export interface HereContactInfo {
    /**
     * Optional label for the contact string, such as "Customer Service" or "Pharmacy Fax".
     */
    label?: string;
    /**
     * Contact information, as specified by the contact type.
     */
    value: string;
    /**
     * The list of place categories this contact refers to.
     */
    categories?: HereCategory[];
}
