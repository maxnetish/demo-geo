import {Component, h, Ref} from 'preact';
import {List} from 'immutable';

import LeafletMap from './components/leaflet-map/leaflet-map';
import SelectTileProvider from './components/select-tile-provider/select-tile-provider';
import Geocoding from './components/geocoding/geocoding';

import {autobind} from 'core-decorators';
import {IHereSearchResult} from "./services/here-resources";
import {
    IPlaceInfo,
    hereSearchResultToPlaceInfo,
    placeInfoToPlain,
    placeInfoFromPlain,
} from "./models/place";
import PlaceInfoComponent from "./components/place-info/place-info";

interface IAppState {
    provider: string;
    places: List<IPlaceInfo>;
}

const localStorageKey = 'dg-app-state';

export default class App extends Component<{}, IAppState> {

    private leafletMapComponentRef: LeafletMap;

    constructor() {
        super();

        this.state = {
            provider: 'OpenStreetMap.Mapnik',
            places: List(),
        };

        this.updateStateFromLocalStorageEvent(window.localStorage.getItem(localStorageKey));
        window.addEventListener('storage', (e) => {
            if (e.key !== localStorageKey) {
                return;
            }
            this.updateStateFromLocalStorageEvent(e.newValue);
        });
    }

    public render(props: {}, {provider, places}: IAppState, ctx: any) {
        return <div class="pure-g">
            <div class="pure-u-1 pure-u-md-1-4">
                <div class=" dg-left-pane-ct">
                    <SelectTileProvider onChange={this.onSelectProvider} provider={provider}/>
                    <Geocoding onSelectItem={this.onSelectPlaceInGeocoding}/>
                    {places.size ? <div>
                        <header>Selected places</header>
                        <ul class="dg-list-unstyled">
                            {places.map((place: IPlaceInfo, ind: number) => <li>
                                <PlaceInfoComponent
                                    place={place}
                                    onSelectClick={() => this.onSelectPlaceInList(ind)}/>
                            </li>).toArray()}
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

    /**
     * Actually add place into list
     * @param item
     */
    @autobind
    private onSelectPlaceInGeocoding(item: IHereSearchResult) {
        const placeInfo = hereSearchResultToPlaceInfo(item);
        placeInfo.selected = true;
        this.toggleMapMarker(placeInfo);
        const places = this.state.places.withMutations((list) => {
            list.push(hereSearchResultToPlaceInfo(item));
            for (const ind of list.keys()) {
                if (ind === list.size - 1) {
                    list.setIn([ind, 'selected'], true);
                } else {
                    list.setIn([ind, 'selected'], false);
                }
            }
        });
        this.setState({
            places,
        }, () => {
            this.updateLocalStorageFromState();
        });
    }

    private toggleMapMarker(place?: IPlaceInfo) {
        if (place && place.selected) {
            this.leafletMapComponentRef.showPlace({bounds: place.bounds, coords: place.location});
        } else {
            this.leafletMapComponentRef.showPlace({bounds: null, coords: null});
        }
    }

    private onSelectPlaceInList(indexOfSelectedToggle: number) {
        const places = this.state.places.withMutations((list: List<IPlaceInfo>) => {
            for (const ind of list.keys()) {
                if (indexOfSelectedToggle === ind) {
                    list.setIn([ind, 'selected'], !list.getIn([ind, 'selected']));
                    this.toggleMapMarker(list.get(ind));
                } else {
                    list.setIn([ind, 'selected'], false);
                }
            }
        });
        this.setState({
            places,
        });
    }

    private updateLocalStorageFromState() {
        window.localStorage.setItem(localStorageKey, JSON.stringify({places: this.state.places.toArray().map((p) => placeInfoToPlain(p))}));
    }

    private updateStateFromLocalStorageEvent(stateSerialized: string | null) {
        let places: List<IPlaceInfo>;
        if (!stateSerialized) {
            places = this.state.places.clear();
        } else {
            const stateDeserialized = JSON.parse(stateSerialized);
            places = List<IPlaceInfo>(stateDeserialized.places.map((p: any) => placeInfoFromPlain(p)));
        }
        this.setState({
            places,
        });
    }

}
