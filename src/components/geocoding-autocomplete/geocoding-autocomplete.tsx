import {h, Component, ComponentChild} from 'preact';
import {autobind} from 'core-decorators';

interface IGeocodingAutocompleteProps {
    onSelectItem?: (selection: any) => void;
}

interface IGeocodingAutocompleteState {
    suggestions: IHereSuggestion[];
    searchTerm?: string;
}

interface IHereSuggestion {
    label?: string;
    language?: string;
    countryCode?: string;
    locationId?: string;
    address?: {
        [key: string]: string;
    };
    distance?: number;
    matchLevel?: string;
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
    private onSearchTermChange(e: Event): void {
        const searchTerm = (e.target as HTMLInputElement).value;
        this.setState({searchTerm});

        if (searchTerm.length > 5) {
            fetch(`https://autocomplete.geocoder.api.here.com/6.2/suggest.json?app_id=${appId}&app_code=${appCode}&query=${searchTerm}&beginHighlight=<b>&endHighlight=</b>`, {
                cache: 'default',
                credentials: 'same-origin',
                method: 'GET',
                mode: 'cors',
            })
                .then((res) => res.json())
                .then((d) => {
                    this.setState({
                        suggestions: d.suggestions,
                    });
                });
        }
    }

}
