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

import './webcomponents/expander-webcomponent/expander-webcomponent';

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
    private searchPanelRef: HTMLElement;

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
                <div class=" dg-left-pane-ct" ref={(c) => this.searchPanelRef = c}>
                    <button type="button" class="pure-button dg-button-search-to-map" onClick={this.searchToMapHandler}>
                        <i class="fas fa-arrow-circle-down m-r-medium"></i>
                        To map
                    </button>
                    <SelectTileProvider onChange={this.selectProviderEventHandler} provider={provider}/>
                    <Geocoding onSelectItem={this.selectPlaceInGeocodingEventHandler}/>
                    {places.size ? <div>
                        <dg-expander title-text="Selected places" open class="dg-expander-light-component">
                            <ul slot="content" class="dg-list-unstyled">
                                {places.map((place: PlaceInfo, ind: number) => <li>
                                    <PlaceInfoComponent
                                        place={place}
                                        onSelectClick={() => this.selectPlaceInListEventHandler(ind)}
                                        onRemoveClick={() => this.removePlaceInListHandler(ind)}/>
                                </li>).toArray()}
                            </ul>
                        </dg-expander>
                    </div> : null}
                </div>
            </div>
            <div class="pure-u-1 pure-u-md-3-4 dg-map-ct">
                <button class="pure-button dg-button-map-to-search" type="button" onClick={this.mapToSearchHandler}>
                    <i class="fas fa-arrow-circle-up m-r-medium"></i>
                    To search
                </button>
                <LeafletMap provider={provider}
                            ref={(c) => this.leafletMapComponentRef = c}/>
            </div>
        </div>;
    }

    @autobind
    private selectProviderEventHandler({code}: { code: string }) {
        this.setState({provider: code});
    }

    @autobind
    searchToMapHandler() {
        console.log(this.leafletMapComponentRef);
        if (this.leafletMapComponentRef && this.leafletMapComponentRef.base) {
            this.leafletMapComponentRef.base.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest',
            });
        }
    }

    @autobind
    mapToSearchHandler() {
        if (this.searchPanelRef) {
            this.searchPanelRef.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest',
            });
        }
    }

    /**
     * Actually add place into list
     * @param item
     */
    @autobind
    private selectPlaceInGeocodingEventHandler(item: IHereSearchResult) {
        const placeInfo = PlaceInfo.fromHereSearchResult(item);
        this.setState((state: IAppState) => {
            const places = state.places.withMutations((list) => {
                list.push(placeInfo);
                for (const ind of list.keys()) {
                    if (ind === list.size - 1) {
                        list.setIn([ind, 'selected'], true);
                    } else {
                        list.setIn([ind, 'selected'], false);
                    }
                }
            });
            return {
                places,
            }
        }, () => {
            this.toggleMapMarker(this.state.places.find((p: PlaceInfo) => !!p.selected));
            this.searchToMapHandler();
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
        this.setState((state: IAppState) => {
            const places = state.places.withMutations((list: List<PlaceInfo>) => {
                for (const ind of list.keys()) {
                    if (indexOfSelectedToggle === ind) {
                        list.setIn([ind, 'selected'], !list.getIn([ind, 'selected']));
                    } else {
                        list.setIn([ind, 'selected'], false);
                    }
                }
            });
            return {
                places,
            };
        }, () => {
            this.toggleMapMarker(this.state.places.get(indexOfSelectedToggle));
            if (this.state.places.getIn([indexOfSelectedToggle, 'selected'])) {
                // not move to map if item DESELECTED
                this.searchToMapHandler();
            }
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
