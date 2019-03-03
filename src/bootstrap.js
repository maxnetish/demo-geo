import App from './app';

import 'purecss/build/pure.css';
import 'purecss/build/grids-responsive.css';
import './app.css';
import 'leaflet/dist/leaflet.css';



const loadEvent = 'DOMContentLoaded';

function bootstrap(e) {
    window.demoAudioApp = new App();
    document.removeEventListener(loadEvent, bootstrap);
}

document.addEventListener(loadEvent, bootstrap, {once: true});
