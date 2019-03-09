import { h, render } from 'preact';

import App from './app';

import 'purecss/build/pure.css';
import 'purecss/build/grids-responsive.css';
import './app.css';
import 'leaflet/dist/leaflet.css';

render(<App />, document.body);

// const loadEvent = 'DOMContentLoaded';
//
// function bootstrap(e) {
//     window.demoAudioApp = App;
//     document.removeEventListener(loadEvent, bootstrap);
// }
//
// document.addEventListener(loadEvent, bootstrap, {once: true});
