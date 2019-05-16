import {h, Component} from 'preact';
import {autobind} from 'core-decorators';

import * as L from 'leaflet';
import 'leaflet-providers';

interface ISelectTileProviderProps {
    provider?: string;
    onChange?: ({code}: { code: string | null }) => void;
}

interface ISelectTileProviderState {
    tileProviders: L.TileLayer.Provider.ProvidersMap;
}

export default class SelectTileProvider extends Component<ISelectTileProviderProps, ISelectTileProviderState> {
    constructor(props: ISelectTileProviderProps) {
        super(props);

        this.state = {
            tileProviders: L.TileLayer.Provider.providers,
        };
    }

    @autobind
    public emitSelectionChange(code: string | null) {
        if (this.props.onChange) {
            this.props.onChange({code});
        }
    }

    @autobind
    public onSelectionChange(e: Event) {
        let selectedProviderCode = null;
        if (e.target) {
            selectedProviderCode = (e.target as HTMLSelectElement).value;
        }
        this.emitSelectionChange(selectedProviderCode);
    }

    public render({provider}: ISelectTileProviderProps, {tileProviders}: ISelectTileProviderState, ctx: any) {
        return <div>
            <form class="pure-form">
                <fieldset>
                    <legend>Tile provider</legend>
                    <select id="dg-select-leaflet-provider"
                            class="pure-input-1" value={provider}
                            onChange={this.onSelectionChange}>
                        <option value="">-- Select provider of map tiles --</option>
                        {
                            Object.keys(tileProviders)
                                .map((oneProviderKey: string) => {
                                    if (tileProviders[oneProviderKey].variants) {
                                        return <optgroup label={oneProviderKey}>
                                            {
                                                Object.keys(tileProviders[oneProviderKey].variants || {})
                                                    .map((oneVariantKey: string) => {
                                                        return <option
                                                            value={`${oneProviderKey}.${oneVariantKey}`}
                                                        >
                                                            {oneVariantKey}
                                                        </option>;
                                                    })
                                            }
                                        </optgroup>;
                                    }
                                    return <option value={oneProviderKey}>{oneProviderKey}</option>;
                                })
                        }
                    </select>
                </fieldset>
            </form>
        </div>;
    }
}
