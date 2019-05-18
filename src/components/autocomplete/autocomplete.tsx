import {h, Component, ComponentChild, Attributes, FunctionalComponent, VNode, RenderableProps} from 'preact';
import {autobind} from 'core-decorators';
import classNames from 'classnames';

import './autocomplete.less';

interface IAutocompleteProps<TofSuggestion> {
    onSelectSuggestion?: (suggestion: TofSuggestion) => void;
    suggestions?: TofSuggestion[];
    suggestionComponent?: (suggestion: TofSuggestion) => VNode<TofSuggestion>;
    loading?: boolean;
}

function defaultSuggestionComponent<TofSuggestion>(suggestion: TofSuggestion): VNode {
    return <div>{suggestion.toString()}</div>;
}

function renderCaret({loading = false, hasSuggestions = false}: { loading: boolean, hasSuggestions: boolean }) {
    if (!loading && !hasSuggestions) {
        return null;
    }
    const iconClass = classNames({
        'dg-autocomplete-component_input-indicator': true,
        'far fa-compass fa-spin': loading,
        'fas fa-caret-down': hasSuggestions && !loading
    });
    return <i class={iconClass}></i>;
}

export default function fn<TofSuggestion>({onSelectSuggestion, suggestions = [], suggestionComponent, loading = false, 'class': passedClass = '', ...otherProps}: RenderableProps<IAutocompleteProps<TofSuggestion>> & { [key: string]: any }): VNode {
    return <div class="dg-autocomplete-component">
        <div class="dg-autocomplete-component_input-wrapper">
            <input class={classNames(passedClass, 'dg-autocomplete-component_input')} {...otherProps}/>
            {renderCaret({loading, hasSuggestions: !!suggestions.length})}
        </div>
        <div class={classNames({'dg-autocomplete-component_dropdown card card-3': true, 'has': !!suggestions.length})}>
            <ul class="dg-autocomplete-component_dropdown-list">
                {suggestions.map((suggestion: TofSuggestion) => <li
                    class="dg-autocomplete-component_dropdown-list-item">{suggestionComponent ?
                    suggestionComponent(suggestion) : defaultSuggestionComponent(suggestion)}</li>)}
            </ul>
        </div>
        <div>Fooo</div>
    </div>;
}

