import {h, Component} from 'preact';
import L from 'leaflet';
import 'leaflet-providers';

export default class LeafletMap extends Component {

    constructor(props) {
        super(props)

        this.tileLayer = null;
    }

    componentDidMount() {
        this.leafletMap = L.map('dg-leaflet-map-place')
            .locate({setView: true, maxZoom: 14});

        this.updateTileLayer(this.props.provider);
    }

    componentDidUpdate(previousProps, previousState, previousContext) {
        if (this.props.provider !== previousProps.provider) {
            this.updateTileLayer(this.props.provider);
        }
    }

    updateTileLayer(providerCode) {
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

    render({}, {}, ctx) {
        return <div class="dg-map-ct" id="dg-leaflet-map-place"></div>;
    }
};
