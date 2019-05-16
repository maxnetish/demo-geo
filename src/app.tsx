import {Component, h} from 'preact';

import LeafletMap from './components/leaflet-map/leaflet-map';
import SelectTileProvider from './components/select-tile-provider/select-tile-provider';

import {autobind} from 'core-decorators';

interface IAppState {
    provider: string;
}

export default class App extends Component<{}, IAppState> {

    constructor() {
        super();

        this.state = {
            provider: 'OpenStreetMap.Mapnik',
        };
    }

    @autobind
    public onSelectProvider({code}: { code: string }) {
        this.setState({provider: code});
    }

    public render(props: {}, {provider}: IAppState, ctx: any) {
        return <div class="pure-g">
            <div class="pure-u-1 pure-u-md-1-4">
                <div class=" dg-left-pane-ct">
                    <SelectTileProvider onChange={this.onSelectProvider} provider={provider}/>
                </div>
            </div>
            <div class="pure-u-1 pure-u-md-3-4">
                <LeafletMap provider={provider}/>
            </div>
        </div>;
    }
}
