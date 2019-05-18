import {h, Component, ComponentChild} from 'preact';
import {autobind} from 'core-decorators';

import {fetchSuggestions, IHereSuggestion} from "../../services/here-resources";

interface IGeocodingAutocompleteProps {
    onSelectItem?: (selection: any) => void;
}

interface IGeocodingAutocompleteState {
    suggestions: IHereSuggestion[];
    searchTerm?: string;
}

export default class GeocodingAutocomplete extends Component<IGeocodingAutocompleteProps, IGeocodingAutocompleteState> {

    constructor(props: IGeocodingAutocompleteProps) {
        super(props);

        this.state = {
            searchTerm: '',
            suggestions: [],
        };
    }

    public render(
        props: preact.RenderableProps<IGeocodingAutocompleteProps>,
        state: Readonly<IGeocodingAutocompleteState>,
        context?: any,
    ): ComponentChild {

        return <div>
            <form className="pure-form">
                <fieldset>
                    <legend>Search</legend>
                    <input class="pure-input-1"
                           value={state.searchTerm}
                           onInput={this.onSearchTermChange}
                           list="suggestions-datalist"/>
                    <datalist id="suggestions-datalist">
                        {
                            state.suggestions.map((sugg: IHereSuggestion) => <option value={sugg.label}/>)
                        }
                    </datalist>
                </fieldset>
            </form>
        </div>;
    }

    @autobind
    private async onSearchTermChange(e: Event): Promise<number> {
        const searchTerm = (e.target as HTMLInputElement).value;
        this.setState({searchTerm});

        if(searchTerm.length < 5) {
            return 0;
        }

        const suggestions = await fetchSuggestions({
            maxresults: 10,
            query: searchTerm,
        });

        this.setState({
            suggestions
        });

        return suggestions.length;
    }

}
