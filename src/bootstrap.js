import App from './app';

const loadEvent = 'DOMContentLoaded';

function bootstrap(e) {
    window.demoAudioApp = new App();
    document.removeEventListener(loadEvent, bootstrap);
}

document.addEventListener(loadEvent, bootstrap, {once: true});
