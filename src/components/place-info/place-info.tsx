import {h, Component, ComponentChild} from 'preact';
import {autobind} from 'core-decorators';
import {PlaceInfo} from "../../models/place";
import {HereLocationType} from "../../services/here-resources";
import classNames from 'classnames';
import {Nullable} from "../../utils/nullable";

import './place-card.less';

interface IPlaceInfoComponentProps {
    place: PlaceInfo;
    onRemoveClick?: (placeInfo: PlaceInfo) => void;
    onSelectClick?: (placeInfo: PlaceInfo) => void;
}

const defaultLocationType: HereLocationType = 'point';

const iconsByLocationType: Map<HereLocationType, string> = new Map<HereLocationType, string>([
    [defaultLocationType, 'fas fa-map-marker-alt'],
    ['area', 'fas fa-location-arrow'],
    ['park', 'fas fa-tree'],
    ['lake', 'fas fa-water'],
    ['mountainPeak', 'fas fa-mountain'],
    ['volcano', 'fas fa-mountain'],
    ['river', 'fas fa-water'],
    ['industrialComplex', 'fas fa-industry'],
    ['island', 'fas fa-water'],
    ['woodland', 'fas fa-tree'],
    ['cemetery', 'fas fa-praying-hands'],
    ['canalWaterChannel', 'fas fa-water'],
    ['bayHarbor', 'fas fa-water'],
    ['airport', 'fas fa-plane'],
    ['hospital', 'fas fa-hospital'],
    ['sportsComplex', 'fas fa-quidditch'],
    ['shoppingCenter', 'fas fa-shopping-cart'],
    ['universityCollege', 'fas fa-university'],
    ['militaryBase', 'fas fa-fighter-jet'],
    ['beach', 'fas fa-umbrella-beach'],
]);

function rendertPlaceIcon(locationType?: Nullable<HereLocationType>) {
    locationType = locationType || defaultLocationType;
    const iconClass = iconsByLocationType.get(locationType) || iconsByLocationType.get(defaultLocationType);

    return <i class={classNames(iconClass, 'fa-fw')}></i>;
}

export default class PlaceInfoComponent extends Component<IPlaceInfoComponentProps, {}> {
    public render(
        props: preact.RenderableProps<IPlaceInfoComponentProps>,
        state?: Readonly<{}>,
        context?: any,
    ): preact.ComponentChild {
        const {place} = props;
        return <div class={classNames({'place-card place-card__selected-border': true, 'selected': place.selected})}>
            <div class="place-card__icon-ct" onClick={this.onSelectClick}>
                {rendertPlaceIcon(place.placeType)}
            </div>
            <div class="place-card__text-ct" onClick={this.onSelectClick}>
                <div>
                    {place.title || place.description}
                </div>
                {place.title && place.description ? <small>
                    {place.description}
                </small> : null}
            </div>
            <div class="place-card__actions-ct">
                <button class="pure-button place-card__remove-btn" onClick={this.onRemoveClick}
                        title="Remove place">
                    <i class="far fa-minus-square"></i>
                </button>
            </div>
        </div>;
    }

    public shouldComponentUpdate(
        nextProps: Readonly<IPlaceInfoComponentProps>,
        nextState: Readonly<{}>,
        nextContext: any,
    ): boolean {
        return this.props.place.selected !== nextProps.place.selected ||
            this.props.place.locationId !== nextProps.place.locationId;
    }

    @autobind
    private onRemoveClick(e: Event) {
        if (this.props.onRemoveClick) {
            this.props.onRemoveClick(this.props.place);
        }
    }

    @autobind
    private onSelectClick(e: Event) {
        if (this.props.onSelectClick) {
            this.props.onSelectClick(this.props.place);
        }
    }
}
