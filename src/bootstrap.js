import { h, render } from 'preact';

import App from './app';

import 'purecss/build/pure.css';
import 'purecss/build/grids-responsive.css';
import './app.css';
import 'leaflet/dist/leaflet.css';

render(<App />, document.body);
