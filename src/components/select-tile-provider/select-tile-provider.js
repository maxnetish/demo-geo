import {h, Component} from 'preact';
import L from 'leaflet';
import 'leaflet-providers';

function mapProviders(providers) {
    const tileProvidersToDisplay = [];
    for (let providerKey in providers) {
        let providerInfo = providers[providerKey];
        if (providerInfo.variants) {
            for (let variantKey in providerInfo.variants) {
                tileProvidersToDisplay.push(`${providerKey}.${variantKey}`);
            }
        } else {
            tileProvidersToDisplay.push(providerKey);
        }
    }
    return tileProvidersToDisplay;
}

function findProviderInfo({providerCode = null, providers = {}} = {}) {
    if (!providerCode) {
        return null;
    }

    const [providerKey, variantKey] = providerCode.split('.');

    if (variantKey) {
        return providers[providerKey].variants[variantKey];
    }

    return providers[providerKey];
}

export default class SelectTileProvider extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tileProviders: mapProviders(L.TileLayer.Provider.providers)
        }
    }

    emitSelectionChange = providerCode => {
        if (this.props.onChange) {
            this.props.onChange({
                providerCode: providerCode || null
            });
        }
    };

    onSelectionChange = (e) => {
        let selectedProviderCode = e.target.value;
        this.emitSelectionChange(selectedProviderCode)
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
                        {tileProviders.map(oneProvider => <option value={oneProvider}>{oneProvider}</option>)}
                    </select>
                    <legend>Selected provider</legend>

                </fieldset>
            </form>
        </div>;
    }
};
