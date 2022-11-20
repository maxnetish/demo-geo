import { HereEvStationConnector } from './here-ev-station-connector';

export interface HereEvStationInfo {
    connectors?: HereEvStationConnector[];
    totalNumberOfConnectors?: number;
}
