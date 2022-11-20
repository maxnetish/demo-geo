export interface HereEvStationConnector {
    /**
     * The EV charge point operator
     */
    supplierName?: string;
    /**
     * Id and name element pair representing the connector type in the EV
     * pool group. For more information on the current connector types, see
     * the connectorTypes values in the HERE EV Charge Points API.
     * https://developer.here.com/documentation/charging-stations/dev_guide/topics/resource-type-connector-types.html
     */
    connectorType?: {
        name: string;
        id: string;
    };
    /**
     * Details on type of power feed with respect to SAE J1772 standard.
     * See https://en.wikipedia.org/wiki/SAE_J1772#Charging
     *
     */
    powerFeedType?: {
        name: string;
        id: string;
    };
    /**
     * Maximum charge power (in kilowatt) of connectors in connectors group.
     */
    maxPowerLevel?: number;
    chargingPoint?: {
        numberOfConnectors?: number;
        /**
         * Charge mode of the connectors group. For more information, check
         * the IEC-61851-1 standard.
         * https://en.wikipedia.org/w/index.php?title=Charging_station&oldid=1013010605#IEC-61851-1_Charging_Modes
         */
        chargeMode: string;
        voltsRange?: string;
        phases?: number;
        ampsRange: string;
    };
}