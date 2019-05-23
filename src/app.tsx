import {Component, h, Ref} from 'preact';

import LeafletMap from './components/leaflet-map/leaflet-map';
import SelectTileProvider from './components/select-tile-provider/select-tile-provider';
import Geocoding from './components/geocoding/geocoding';

import {autobind} from 'core-decorators';
import {IHereSearchResult} from "./services/here-resources";
import {latLng, Map, latLngBounds, LatLngBounds, LatLng} from "leaflet";
import {PlaceInfo} from "./models/place";
import PlaceInfoComponent from "./components/place-info/place-info";

interface IAppState {
    provider: string;
    places: PlaceInfo[];
}

export default class App extends Component<{}, IAppState> {

    private leafletMapComponentRef: LeafletMap;

    constructor() {
        super();

        this.state = {
            provider: 'OpenStreetMap.Mapnik',
            places: [],
        };
    }

    public render(props: {}, {provider, places}: IAppState, ctx: any) {
        return <div class="pure-g">
            <div class="pure-u-1 pure-u-md-1-4">
                <div class=" dg-left-pane-ct">
                    <SelectTileProvider onChange={this.onSelectProvider} provider={provider}/>
                    <Geocoding onSelectItem={this.onSelectPlaceInGeocoding}/>
                    {places.length ? <div>
                        <header>Selected places</header>
                        <ul class="dg-list-unstyled">
                            {places.map((place) => <li><PlaceInfoComponent place={place}
                                                                           onSelectClick={this.onSelectPlaceInList}/>
                            </li>)}
                        </ul>
                    </div> : null}
                </div>
            </div>
            <div class="pure-u-1 pure-u-md-3-4">
                <LeafletMap provider={provider}
                            ref={(c) => this.leafletMapComponentRef = c}/>
            </div>
        </div>;
    }

    @autobind
    private onSelectProvider({code}: { code: string }) {
        this.setState({provider: code});
    }

    @autobind
    private onSelectPlaceInGeocoding(item: IHereSearchResult) {
        const places = this.state.places.slice();
        places.push(PlaceInfo.fromHereSearchResult(item));
        this.setState({
            places,
        });
    }

    @autobind
    private onSelectPlaceInList(item: PlaceInfo) {
        const newPlaces = this.state.places.map((placeInfo) => {
            const newPlaceInfo = placeInfo.Clone();
            if (placeInfo.locationId === item.locationId && !newPlaceInfo.selected) {
                newPlaceInfo.selected = true;
                if (newPlaceInfo.selected) {
                    this.leafletMapComponentRef.showPlace({bounds: newPlaceInfo.bounds, coords: newPlaceInfo.location});
                }
            } else {
                newPlaceInfo.selected = false;
            }
            return newPlaceInfo;
        });
        this.setState({
            places: newPlaces,
        });
    }
}
