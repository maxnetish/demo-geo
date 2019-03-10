import {h, Component} from 'preact';
import L from 'leaflet';
import 'leaflet-providers';

function findProviderInfo({code = null, providers = {}} = {}) {
    if (!code) {
        return {
            provider: null,
            variant: null
        };
    }

    const [providerKey, variantKey] = code.split('.');

    if (variantKey) {
        return {
            provider: providers[providerKey],
            variant: providers[providerKey].variants[variantKey]
        };
    }

    return {
        provider: providers[providerKey],
        variant: null
    };
}

export default class SelectTileProvider extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tileProviders: L.TileLayer.Provider.providers
        }
    }

    emitSelectionChange = code => {
        if (this.props.onChange) {
            this.props.onChange({code});
        }
    };

    onSelectionChange = (e) => {
        const selectedProviderCode = e.target.value;
        this.emitSelectionChange(selectedProviderCode);
    };

    render({provider}, {tileProviders}, ctx) {
        return <div>
            <form class="pure-form">
                <fieldset>
                    <legend>Tile provider</legend>
                    <select id="dg-select-leaflet-provider"
                            class="pure-input-1" value={provider}
                            onChange={this.onSelectionChange}>
                        <option value="">-- Select provider of map tiles --</option>
                        {
                            Object.keys(tileProviders).map(oneProviderKey => {
                                if (tileProviders[oneProviderKey].variants) {
                                    return <optgroup label={oneProviderKey}>
                                        {
                                            Object.keys(tileProviders[oneProviderKey].variants).map(oneVariantKey => {
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
};
