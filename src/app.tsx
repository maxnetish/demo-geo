import {Component, h} from 'preact';
import * as L from 'leaflet';

import LeafletMap from './components/leaflet-map/leaflet-map';
import SelectTileProvider from './components/select-tile-provider/select-tile-provider';
import GeocodingAutocomplete from './components/geocoding-autocomplete/geocoding-autocomplete';

import {autobind} from 'core-decorators';
import {IHereSearchResult} from "./services/here-resources";
import {latLng} from "leaflet";

interface IAppState {
    provider: string;
}

export default class App extends Component<{}, IAppState> {

    private leafletMap: L.Map | null = null;

    constructor() {
        super();

        this.state = {
            provider: 'OpenStreetMap.Mapnik',
        };
    }

    @autobind
    public onSelectProvider({code}: { code: string }) {
        this.setState({provider: code});
    }

    public render(props: {}, {provider}: IAppState, ctx: any) {
        return <div class="pure-g">
            <div class="pure-u-1 pure-u-md-1-4">
                <div class=" dg-left-pane-ct">
                    <SelectTileProvider onChange={this.onSelectProvider} provider={provider}/>
                    <GeocodingAutocomplete onSelectItem={this.onSelectPlaceInGeocoding}/>
                </div>
            </div>
            <div class="pure-u-1 pure-u-md-3-4">
                <LeafletMap provider={provider} onMapReady={this.onMapReady}/>
            </div>
        </div>;
    }

    @autobind
    private onSelectPlaceInGeocoding(item: IHereSearchResult) {
        if (this.leafletMap && item.Location && item.Location.MapView) {
            this.leafletMap.flyToBounds(
                L.latLngBounds(
                    L.latLng(
                        item.Location.MapView.BottomRight.Latitude,
                        item.Location.MapView.BottomRight.Longitude,
                    ),
                    L.latLng(
                        item.Location.MapView.TopLeft.Latitude,
                        item.Location.MapView.TopLeft.Longitude,
                    ),
                ),
            );
        }
    }

    @autobind
    private onMapReady(map: L.Map) {
        this.leafletMap = map;
    }
}
