import {Component, h, Ref} from 'preact';

import LeafletMap from './components/leaflet-map/leaflet-map';
import SelectTileProvider from './components/select-tile-provider/select-tile-provider';
import Geocoding from './components/geocoding/geocoding';

import {autobind} from 'core-decorators';
import {IHereSearchResult} from "./services/here-resources";
import {latLng, Map, latLngBounds, LatLngBounds, LatLng} from "leaflet";
import {hereCoordinateToLatLng, hereGeoBoundingBoxToLatLngBounds} from "./utils/geo-convert-utils";

interface IAppState {
    provider: string;
}

export default class App extends Component<{}, IAppState> {

    private leafletMapComponentRef: LeafletMap;

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
                    <Geocoding onSelectItem={this.onSelectPlaceInGeocoding}/>
                </div>
            </div>
            <div class="pure-u-1 pure-u-md-3-4">
                <LeafletMap provider={provider}
                            ref={(c) => this.leafletMapComponentRef = c}/>
            </div>
        </div>;
    }

    @autobind
    private onSelectPlaceInGeocoding(item: IHereSearchResult) {
        let bounds: LatLngBounds | null = null;
        let coords: LatLng | null = null;
        if (!this.leafletMapComponentRef) {
            return;
        }
        if (item.Location && item.Location.MapView) {
            item.Location.Shape
            bounds = hereGeoBoundingBoxToLatLngBounds(item.Location.MapView);
        }
        if (item.Location && item.Location.DisplayPosition) {
            coords = hereCoordinateToLatLng(item.Location.DisplayPosition);
        }
        this.leafletMapComponentRef.showPlace({bounds, coords});
    }
}
