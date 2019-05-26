import {Component, h, Ref} from 'preact';
import {List} from 'immutable';

import LeafletMap from './components/leaflet-map/leaflet-map';
import SelectTileProvider from './components/select-tile-provider/select-tile-provider';
import Geocoding from './components/geocoding/geocoding';

import {autobind} from 'core-decorators';
import {IHereSearchResult} from "./services/here-resources";
import {
    IPlaceInfo,
    PlaceInfo,
} from "./models/place";
import PlaceInfoComponent from "./components/place-info/place-info";
import ExpanderComponent from "./components/expander/expander";

interface IAppState {
    provider: string;
    places: List<PlaceInfo>;
}

const localStorageKey = 'dg-app-state';

export default class App extends Component<{}, IAppState> {

    componentWillUnmount(): void {
        window.removeEventListener('storage', this.storageEventHandler);
    }

    componentDidMount(): void {
        this.updateStateFromSerializedState(window.localStorage.getItem(localStorageKey));
        window.addEventListener('storage', this.storageEventHandler);
    }

    private leafletMapComponentRef: LeafletMap;

    constructor() {
        super();

        this.state = {
            provider: 'OpenStreetMap.Mapnik',
            places: List(),
        };
    }

    public render(props: {}, {provider, places}: IAppState, ctx: any) {
        return <div class="pure-g">
            <div class="pure-u-1 pure-u-md-1-4">
                <div class=" dg-left-pane-ct">
                    <SelectTileProvider onChange={this.selectProviderEventHandler} provider={provider}/>
                    <Geocoding onSelectItem={this.selectPlaceInGeocodingEventHandler}/>
                    {places.size ? <div>
                        <ExpanderComponent expanded={true}
                                           header="Selected places">
                            <ul class="dg-list-unstyled">
                                {places.map((place: PlaceInfo, ind: number) => <li>
                                    <PlaceInfoComponent
                                        place={place}
                                        onSelectClick={() => this.selectPlaceInListEventHandler(ind)}
                                        onRemoveClick={() => this.removePlaceInListHandler(ind)}/>
                                </li>).toArray()}
                            </ul>
                        </ExpanderComponent>
                    </div> : null}
                </div>
            </div>
            <div class="pure-u-1 pure-u-md-3-4">
                <div class="dg-map-ct">
                    <LeafletMap provider={provider}
                                ref={(c) => this.leafletMapComponentRef = c}/>
                </div>
            </div>
        </div>;
    }

    @autobind
    private selectProviderEventHandler({code}: { code: string }) {
        this.setState({provider: code});
    }

    /**
     * Actually add place into list
     * @param item
     */
    @autobind
    private selectPlaceInGeocodingEventHandler(item: IHereSearchResult) {
        const placeInfo = PlaceInfo.fromHereSearchResult(item);
        const places = this.state.places.withMutations((list) => {
            list.push(placeInfo);
            for (const ind of list.keys()) {
                if (ind === list.size - 1) {
                    list.setIn([ind, 'selected'], true);
                } else {
                    list.setIn([ind, 'selected'], false);
                }
            }
        });
        this.toggleMapMarker(places.find((p: PlaceInfo) => !!p.selected));
        this.setState({
            places,
        }, () => {
            this.updateLocalStorageFromState();
        });
    }

    private toggleMapMarker(place?: PlaceInfo) {
        if (place && place.selected) {
            this.leafletMapComponentRef.showPlace(place);
        } else {
            this.leafletMapComponentRef.showPlace({bounds: null, location: null});
        }
    }

    private selectPlaceInListEventHandler(indexOfSelectedToggle: number) {
        const places = this.state.places.withMutations((list: List<PlaceInfo>) => {
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

    private removePlaceInListHandler(indexToRemove: number) {
        const places = this.state.places.remove(indexToRemove);
        this.setState({
            places,
        }, () => {
            this.updateLocalStorageFromState();
        });
    }

    private updateLocalStorageFromState() {
        window.localStorage.setItem(localStorageKey, JSON.stringify({places: this.state.places}));
    }

    private updateStateFromSerializedState(stateSerialized: string | null) {
        let places: List<PlaceInfo>;
        if (!stateSerialized) {
            places = this.state.places.clear();
            this.toggleMapMarker();
        } else {
            const placesDeserialized = (JSON.parse(stateSerialized) as { places: IPlaceInfo[] }).places;
            const seletedPlace = this.state.places.find(p => !!p.selected);
            const selectedLocationId = seletedPlace ? seletedPlace.locationId : null;
            places = List<PlaceInfo>(placesDeserialized.map((p: IPlaceInfo) => {
                p.selected = p.locationId === selectedLocationId;
                return new PlaceInfo(p);
            }));

        }
        this.setState({
            places,
        });
    }

    @autobind
    private storageEventHandler(e: StorageEvent): void {
        if (e.key === localStorageKey) {
            this.updateStateFromSerializedState(e.newValue);
        }
    }

}
