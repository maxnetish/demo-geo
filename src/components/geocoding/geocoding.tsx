import {h, Component, ComponentChild} from 'preact';
import {autobind} from 'core-decorators';
import debounce from 'lodash/debounce';
import {sanitize} from 'dompurify';
import classNames from 'classnames';

import './geocoding.less';

import {
    fetchAutocomplete,
    IHereSuggestion,
    fetchGeocodeDetails,
    IHereGeocodeResponse, IHereSearchResult,
} from "../../services/here-resources";
import AutocompleteComponent from '../autocomplete/autocomplete';
import { HereAutocompleteResponse } from '../../models/here-autocomplete-response';

interface IGeocodingAutocompleteProps {
    onSelectItem?: (selection: IHereSearchResult) => void;
}

interface IGeocodingAutocompleteState {
    suggestions: HereAutocompleteResponse['items'];
    searchTerm?: string;
    suggestionsLoading: boolean;
    selectedSuggestion: IHereSuggestion | null;
    selectedPlaceLoading: boolean;
    selectedPlace: IHereSearchResult | null;
}

export default class Geocoding extends Component<IGeocodingAutocompleteProps, IGeocodingAutocompleteState> {

    private static iconByMatchLevel(matchLevel?: string) {
        if (!matchLevel) {
            return '';
        }
        return classNames({
            'fas fa-home': matchLevel === 'houseNumber',
            'fas fa-route': matchLevel === 'intersection',
            'fas fa-road': matchLevel === 'street',
            'fas fa-mail-bulk': matchLevel === 'postalCode',
            'fas fa-location-arrow': matchLevel === 'district' ||
                matchLevel === 'county' ||
                matchLevel === 'state' ||
                matchLevel === 'country',
            'fas fa-city': matchLevel === 'city',
        });
    }

    private static renderSuggestion(suggestion: HereAutocompleteResponse['items'][number]) {
        return <div class="dg-autocomplete-suggesttion">
            <div class="dg-autocomplete-suggesttion-match-level">
                <i class={Geocoding.iconByMatchLevel(suggestion.resultType)}></i>
            </div>
            <div class="dg-autocomplete-suggesttion-label">
                {suggestion.title}
            </div>
        </div>;
    }

    private fetchSuggestionsAbortController: AbortController | null = null;
    private fetchPlaceAbortController: AbortController | null = null;

    private updateSuggestionsDebounced = debounce(async (term: string): Promise<boolean> => {
        if (this.fetchSuggestionsAbortController) {
            this.fetchSuggestionsAbortController.abort();
        }
        try {
            this.setState({
                suggestionsLoading: true,
            });
            const promiseWithAborter = fetchAutocomplete({
                limit: 10,
                q: term,
            });
            this.fetchSuggestionsAbortController = promiseWithAborter.abortController;

            const suggestions = await promiseWithAborter.promise;
            // AbortController not needed anymore after request resolves
            this.fetchSuggestionsAbortController = null;
            this.setState({
                suggestions: suggestions.items,
                suggestionsLoading: false,
            });
            return true;
        } catch (err) {
            this.setState({
                suggestionsLoading: false,
            });
            if (err instanceof DOMException && (err as DOMException).code === DOMException.ABORT_ERR) {
                // request canceled with AbortController
                return false;
            }
            throw err;
        }
    }, 2000, {
        leading: false,
        trailing: true,
        maxWait: 10000,
    });

    constructor(props: IGeocodingAutocompleteProps) {
        super(props);

        this.state = {
            searchTerm: '',
            suggestions: [],
            suggestionsLoading: false,
            selectedSuggestion: null,
            selectedPlaceLoading: false,
            selectedPlace: null,
        };
    }

    public render(
        props: preact.RenderableProps<IGeocodingAutocompleteProps>,
        state: Readonly<IGeocodingAutocompleteState>,
        context?: any,
    ): ComponentChild {

        return <div class="dg-geocoding-autocomplete">
            <form className="pure-form" onSubmit={(e) => e.preventDefault()}>
                <fieldset>
                    <legend>Search</legend>
                    <AutocompleteComponent class="pure-input-1" value={state.searchTerm}
                                           onInput={this.onSearchTermChange} suggestions={state.suggestions}
                                           suggestionComponent={Geocoding.renderSuggestion}
                                           loading={state.suggestionsLoading}
                                           onSelectSuggestion={this.onSelectSuggestion}
                                           placeholder="Enter 2 or more letters to search place"/>
                </fieldset>
            </form>
        </div>;
    }

    private async updateSelectedPlace(locationId: string) {
        if (this.fetchPlaceAbortController) {
            this.fetchPlaceAbortController.abort();
        }
        try {
            const promiseWithAborter = fetchGeocodeDetails({locationid: locationId});
            this.fetchPlaceAbortController = promiseWithAborter.abortController;
            this.setState({
                selectedPlaceLoading: true,
                selectedPlace: null,
            });

            const geocodeResponse = await promiseWithAborter.promise;
            let selectedPlace = null;
            this.fetchPlaceAbortController = null;
            if (geocodeResponse &&
                geocodeResponse.View &&
                geocodeResponse.View.length &&
                geocodeResponse.View[0].Result &&
                geocodeResponse.View[0].Result.length) {
                selectedPlace = geocodeResponse.View[0].Result[0];
            }
            this.setState({
                selectedPlace,
                selectedPlaceLoading: false,
            });
            if (this.props.onSelectItem && selectedPlace) {
                this.props.onSelectItem(selectedPlace);
            }
            return true;
        } catch (err) {
            this.setState({
                selectedPlaceLoading: false,
            });
            if (err instanceof DOMException && (err as DOMException).code === DOMException.ABORT_ERR) {
                // request canceled with AbortController
                return false;
            }
            throw err;
        }
    }

    @autobind
    private onSelectSuggestion(suggestion: IHereSuggestion) {
        this.setState({
            selectedSuggestion: suggestion,
        });
        if (suggestion && suggestion.locationId) {
            this.updateSelectedPlace(suggestion.locationId);
        }
    }

    @autobind
    private async onSearchTermChange(e: Event): Promise<boolean> {
        const searchTerm = (e.target as HTMLInputElement).value;
        this.setState({searchTerm});

        if (searchTerm.length < 2) {
            this.updateSuggestionsDebounced.cancel();
            this.setState({suggestions: []});
            return false;
        }

        return this.updateSuggestionsDebounced(searchTerm);
    }

}
