import {h, Component, ComponentChild} from 'preact';
import {autobind} from 'core-decorators';
import debounce from 'lodash/debounce';
import {sanitize} from 'dompurify';
import classNames from 'classnames';

import './geocoding-autocomplete.less';

import {fetchSuggestions, IHereSuggestion, fetchGeocodeDetails} from "../../services/here-resources";
import AutocompleteComponent from '../autocomplete/autocomplete';

interface IGeocodingAutocompleteProps {
    onSelectItem?: (selection: any) => void;
}

interface IGeocodingAutocompleteState {
    suggestions: IHereSuggestion[];
    searchTerm?: string;
    suggestionsLoading: boolean;
    selectedSuggestion: IHereSuggestion | null;
}

export default class GeocodingAutocomplete extends Component<IGeocodingAutocompleteProps, IGeocodingAutocompleteState> {

    private updateSuggestionsDebounced = debounce(async function (term: string, self: Component): Promise<boolean> {
        self.setState({
            suggestionsLoading: true
        });
        let suggestions = await fetchSuggestions({
            maxresults: 10,
            query: term,
            beginHighlight: '<b>',
            endHighlight: '</b>',
        });
        self.setState({
            suggestions,
            suggestionsLoading: false,
        });
        return true;
    }, 500, {
        leading: false,
        trailing: true,
        maxWait: 10000
    });

    private updateSelectedPlace(locationId: string) {
        fetchGeocodeDetails({locationId})
            .then((response: any) => {
                console.log(response);
            })
    }

    @autobind
    private onSelectSuggestion(suggestion: IHereSuggestion) {
        this.setState({
            selectedSuggestion: suggestion
        });
        if (suggestion && suggestion.locationId) {
            this.updateSelectedPlace(suggestion.locationId);
        }
    }

    private static iconByMatchLevel(matchLevel?: string) {
        if (!matchLevel) {
            return '';
        }
        return classNames({
            'fas fa-home': matchLevel === 'houseNumber',
            'fas fa-route': matchLevel === 'intersection',
            'fas fa-road': matchLevel === 'street',
            'fas fa-mail-bulk': matchLevel === 'postalCode',
            'fas fa-location-arrow': matchLevel === 'district' || matchLevel === 'county' || matchLevel === 'state' || matchLevel === 'country',
            'fas fa-city': matchLevel === 'city',
        });
    }

    private static renderSuggestion(suggestion: IHereSuggestion) {
        return <div class="dg-autocomplete-suggesttion">
            <div class="dg-autocomplete-suggesttion-match-level">
                <i class={GeocodingAutocomplete.iconByMatchLevel(suggestion.matchLevel)}></i>
            </div>
            <div class="dg-autocomplete-suggesttion-label"
                 dangerouslySetInnerHTML={{__html: suggestion.label ? sanitize(suggestion.label) : ''}}/>
        </div>;
    }

    constructor(props: IGeocodingAutocompleteProps) {
        super(props);

        this.state = {
            searchTerm: '',
            suggestions: [],
            suggestionsLoading: false,
            selectedSuggestion: null,
        };
    }

    public render(
        props: preact.RenderableProps<IGeocodingAutocompleteProps>,
        state: Readonly<IGeocodingAutocompleteState>,
        context?: any,
    ): ComponentChild {

        return <div class="dg-geocoding-autocomplete">
            <form className="pure-form">
                <fieldset>
                    <legend>Search</legend>
                    <AutocompleteComponent class="pure-input-1" value={state.searchTerm}
                                           onInput={this.onSearchTermChange} suggestions={state.suggestions}
                                           suggestionComponent={GeocodingAutocomplete.renderSuggestion}
                                           loading={state.suggestionsLoading}
                                           onSelectSuggestion={this.onSelectSuggestion}
                                           placeholder="Enter 2 or more letters to search place"/>
                </fieldset>
            </form>
        </div>;
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

        return this.updateSuggestionsDebounced(searchTerm, this);
    }

}
