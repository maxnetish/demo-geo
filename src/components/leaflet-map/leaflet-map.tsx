import {h, Component} from 'preact';

import {Map, TileLayer, tileLayer, map, LatLngBounds, CircleMarker, circleMarker, LatLng} from 'leaflet';
import 'leaflet-providers';

interface ILeafletMapProps {
    provider: string;
}

export default class LeafletMap extends Component<ILeafletMapProps, {}> {

    private static initMap(): Map {
        return map('dg-leaflet-map-place')
            .locate({setView: true, maxZoom: 14});
    }

    private leafletMap: Map | null = null;
    private tileLayer: TileLayer | null = null;
    private placeMarker: CircleMarker | null = null;

    constructor(props: ILeafletMapProps) {
        super(props);
    }

    public componentDidMount() {
        this.leafletMap = LeafletMap.initMap();
        this.updateTileLayer(this.props.provider);
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
            this.tileLayer = tileLayer.provider(providerCode);
            this.leafletMap.addLayer(this.tileLayer);
        } else {
            this.tileLayer = null;
        }
    }

    public render() {
        return <div class="dg-map-ct" id="dg-leaflet-map-place"></div>;
    }

    public showPlace({bounds = null, coords = null}: { bounds: LatLngBounds | null, coords: LatLng | null }) {
        if (!this.leafletMap) {
            return;
        }
        if (bounds) {
            this.leafletMap.flyToBounds(bounds);
        }
        if (coords) {
            this.placeMarker = this.placeMarker || circleMarker(coords, {
                weight: 2,
                fill: false,
                radius: 50,
            });
            this.placeMarker.setLatLng(coords);
            this.placeMarker.addTo(this.leafletMap);
        } else if (this.placeMarker) {
            this.placeMarker.removeFrom(this.leafletMap);
        }
    }
}
