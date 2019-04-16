import {h, Component} from 'preact';

import SelectTileProvider from './components/select-tile-provider/select-tile-provider';
import LeafletMap from './components/leaflet-map/leaflet-map';

export default class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            provider: 'OpenStreetMap.Mapnik'
        }
    }

    onSelectProvider = ({code}) => {
        this.setState({provider: code});
    };

    render(props, {provider}, ctx) {
        return <div class="pure-g">
            <div class="pure-u-1 pure-u-md-1-4">
                <SelectTileProvider onChange={this.onSelectProvider} provider={provider}/>
            </div>
            <div class="pure-u-1 pure-u-md-3-4">
                <LeafletMap provider={provider}/>
            </div>
        </div>
    }
}



