import { HereReferenceSupplierType } from './here-reference-supplier-type';

export interface HereReferenceSupplierInfo {
    supplier: {
        id: HereReferenceSupplierType;
    };
    /**
     * Identifier of the place as provided by the supplier.
     */
    id: string;
}
