import {
    h,
    Component,
    ComponentChild,
    Attributes,
    FunctionalComponent,
    VNode,
    RenderableProps,
    ComponentChildren,
    Ref,
} from 'preact';
import {autobind} from 'core-decorators';
import classNames from 'classnames';

import './autocomplete.less';

interface IAutocompleteProps<TofSuggestion> {
    onSelectSuggestion?: (suggestion: TofSuggestion) => void;
    suggestions?: TofSuggestion[];
    suggestionComponent?: (suggestion: TofSuggestion) => VNode<TofSuggestion>;
    loading?: boolean;
    class?: string;
    value?: string;
    placeholder?: string;
    onInput?: (e: Event) => void;
}

interface IAutocompleteState {
    dropdownOpen: boolean,
}

export default class AutocompleteComponent<TofSuggestion>
    extends Component<IAutocompleteProps<TofSuggestion>, IAutocompleteState> {

    public render(
        props: RenderableProps<IAutocompleteProps<TofSuggestion>>,
        state: Readonly<IAutocompleteState>,
        context?: any,
    ): VNode<any> | object | string | number | boolean | null {
        const {
            onSelectSuggestion,
            suggestions = [],
            suggestionComponent,
            loading = false,
            'class': passedClass = '',
            ...otherProps
        } = props;

        return <div class="dg-autocomplete-component">
            <div class="dg-autocomplete-component_input-wrapper">
                <input class={classNames(passedClass, 'dg-autocomplete-component_input')}
                       onFocus={this.onInputFocus} {...otherProps}/>
                {this.renderCaret()}
            </div>
            <div class={classNames({
                'dg-autocomplete-component_dropdown card card-3': true,
                'has': !!suggestions.length && state.dropdownOpen,
            })}>
                <ul class="dg-autocomplete-component_dropdown-list">
                    {suggestions.map((suggestion: TofSuggestion) => <li
                        onClick={() => this.onSuggestionClick(suggestion)}
                        class="dg-autocomplete-component_dropdown-list-item">
                        {suggestionComponent ?
                            suggestionComponent(suggestion) :
                            this.defaultSuggestionComponent(suggestion)}
                    </li>)}
                </ul>
            </div>
        </div>;
    }

    @autobind
    private onInputFocus(e: FocusEvent) {
        this.setState({
            dropdownOpen: true,
        });
    }

    @autobind
    private renderCaret() {
        const {loading, suggestions = []} = this.props;
        const hasSuggestions = !!suggestions.length;

        if (!loading && !hasSuggestions) {
            return null;
        }
        const iconClass = classNames({
            'dg-autocomplete-component_input-indicator': true,
            'far fa-compass fa-spin': loading,
            'fas fa-caret-down': hasSuggestions && !loading,
        });
        return <i class={iconClass}></i>;
    }

    @autobind
    private defaultSuggestionComponent(suggestion: TofSuggestion): VNode {
        return <div>{suggestion.toString()}</div>;
    }

    @autobind
    private onSuggestionClick(suggestion: TofSuggestion) {
        this.setState({
            dropdownOpen: false,
        });
        if (this.props.onSelectSuggestion) {
            this.props.onSelectSuggestion(suggestion);
        }
    }
}

