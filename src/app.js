import L from 'leaflet';
import 'leaflet-providers';

console.info('App instantiates');

// Saratov
const defaultCoords = {
    lat: 51.53288217644661,
    lng: 46.01614952087403
};

let tileLayer = null;
const map = L.map('dg-leaflet-map-place')
    .locate({setView: true, maxZoom: 14})
    .on('moveend zoomend viewreset', e => {
        const targetMap = e.target;
        const center = targetMap.getCenter();
        const zoom = targetMap.getZoom();
        const centerElm = document.querySelector('[bind-to="center"]');
        const zoomElm = document.querySelector('[bind-to="zoom"]');
        if (centerElm) {
            centerElm.innerHTML = `Lat: ${center.lat}; Lng: ${center.lng}`;
        }
        if (zoomElm) {
            zoomElm.innerHTML = `Zoom: ${zoom}`;
        }
    });

const tileProvidersToDisplay = [];
for (let providerKey in L.TileLayer.Provider.providers) {
    let providerInfo = L.TileLayer.Provider.providers[providerKey];
    if (providerInfo.variants) {
        for (let variantKey in providerInfo.variants) {
            tileProvidersToDisplay.push(`${providerKey}.${variantKey}`);
        }
    } else {
        tileProvidersToDisplay.push(providerKey);
    }
}
const selectOptions = tileProvidersToDisplay.reduce((accum, currentVal) => `${accum}<option value="${currentVal}">${currentVal}</option>`, '<option value="" selected>-- Select provider of map tiles --</option>');
const selectProviderElm = document.getElementById('dg-select-leaflet-provider');
selectProviderElm.innerHTML = selectOptions;
selectProviderElm.addEventListener('change', e => {
    if(tileLayer) {
        map.removeLayer(tileLayer);
    }
    if (e.target.value) {
        tileLayer = L.tileLayer.provider(e.target.value);
        map.addLayer(tileLayer);
    } else {
        tileLayer = null;
    }
});

export default {
    map,
    tileLayer
};

/*
export default {
    constructor() {

        this.leafletMap = App.L.map('dg-leaflet-map-place')
            .setView([51.53288217644661, 46.01614952087403], 13)
            .on('moveend zoomend viewreset', this.onMapLocationChanged, this);

        // window.L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png', {
        //     attribution: '<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>'
        // })
        //     .addTo(this.leafletMap);

        this.onMapLocationChanged({target: this.leafletMap});
    }

    static get L() {
        return window.L;
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
*/



