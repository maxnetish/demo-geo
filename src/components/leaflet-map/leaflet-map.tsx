import {h, Component} from 'preact';

import * as L from 'leaflet';
import 'leaflet-providers';

interface ILeafletMapProps {
    provider: string;
    onMapReady?: (map: L.Map) => void;
}

export default class LeafletMap extends Component<ILeafletMapProps, {}> {

    private static initMap(): L.Map {
        return L.map('dg-leaflet-map-place')
            .locate({setView: true, maxZoom: 14});
    }

    private tileLayer: L.TileLayer | null = null;
    private leafletMap: L.Map | null = null;

    constructor(props: ILeafletMapProps) {
        super(props);
    }

    public componentDidMount() {
        this.leafletMap = LeafletMap.initMap();
        this.updateTileLayer(this.props.provider);
        if (this.props.onMapReady) {
            this.props.onMapReady(this.leafletMap);
        }
    }

    public componentDidUpdate(previousProps: ILeafletMapProps, previousState: {}, previousContext: any) {
        if (this.props.provider !== previousProps.provider) {
            this.updateTileLayer(this.props.provider);
        }
    }

    public updateTileLayer(providerCode: string | null) {
        this.leafletMap = this.leafletMap || LeafletMap.initMap();
        if (this.tileLayer) {
            this.leafletMap.removeLayer(this.tileLayer);
        }
        if (providerCode) {
            this.tileLayer = L.tileLayer.provider(providerCode);
            this.leafletMap.addLayer(this.tileLayer);
        } else {
            this.tileLayer = null;
        }
    }

    public render() {
        return <div class="dg-map-ct" id="dg-leaflet-map-place"></div>;
    }
}
