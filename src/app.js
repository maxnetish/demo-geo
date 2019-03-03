import 'leaflet';

export default class App {
    constructor() {
        console.info('App instantiates');

        this.leafletMap = window.L.map('dg-leaflet-map-place')
            .setView([51.53288217644661, 46.01614952087403], 13)
            .on('moveend zoomend viewreset', this.onMapLocationChanged, this);

        window.L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png', {
            attribution: '<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>'
        })
            .addTo(this.leafletMap);

        this.onMapLocationChanged({target: this.leafletMap});
    }

    onMapLocationChanged(e) {
        const map = e.target;
        const center = map.getCenter();
        const zoom = map.getZoom();
        const centerElm = document.querySelector('[bind-to="center"]');
        const zoomElm = document.querySelector('[bind-to="zoom"]');
        if (centerElm) {
            centerElm.innerHTML = `Lat: ${center.lat}; Lng: ${center.lng}`;
        }
        if (zoomElm) {
            zoomElm.innerHTML = `Zoom: ${zoom}`;
        }
    }

};



