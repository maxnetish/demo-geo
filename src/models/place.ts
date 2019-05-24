import {latLng, LatLng, latLngBounds, LatLngBounds} from "leaflet";
import {HereLocationType, IHereGeoBoundingBox, IHereGeoCoordinate, IHereSearchResult} from "../services/here-resources";
import {Nullable} from "../utils/nullable";

export interface IPlaceInfo {
    locationId: string;
    placeType: HereLocationType;
    bounds: Nullable<LatLngBounds>;
    location: Nullable<LatLng>;
    title: Nullable<string>;
    description: Nullable<string>;
    selected: boolean;
}

export function placeInfoToPlain(place: IPlaceInfo): any {
    const plainObj = {
        locationId: place.locationId,
        placeType: place.placeType,
        bounds: place.bounds ? [{
            lat: place.bounds.getSouthWest().lat,
            lng: place.bounds.getSouthWest().lng,
        }, {
            lat: place.bounds.getNorthEast().lat,
            lng: place.bounds.getNorthEast().lng,
        }] : null,
        location: place.location ? {lat: place.location.lat, lng: place.location.lng} : null,
        title: place.title,
        description: place.description,
    };
    return plainObj;
}

export function placeInfoFromPlain(plainInfoPlain: any): IPlaceInfo {
    if (!plainInfoPlain) {
        throw new Error('Cannot deserialize PlaceInfo');
    }

    return {
        locationId: plainInfoPlain.locationId,
        placeType: plainInfoPlain.placeType || 'point',
        bounds: latLngBounds(plainInfoPlain.bounds) || null,
        location: latLng(plainInfoPlain.location) || null,
        title: plainInfoPlain.title || null,
        description: plainInfoPlain.description || null,
        selected: false,
    };
}

export function hereSearchResultToPlaceInfo(hereResult: IHereSearchResult): IPlaceInfo {
    return {
        placeType: hereResult.Location.LocationType || 'point',
        locationId: hereResult.Location.LocationId,
        location: hereCoordinateToLatLng(hereResult.Location.DisplayPosition),
        bounds: hereGeoBoundingBoxToLatLngBounds(hereResult.Location.MapView),
        description: (hereResult.Location.Address && hereResult.Location.Address.Label) || null,
        selected: false,
        title: hereResult.Location.Name || null,
    };
}

export function hereGeoBoundingBoxToLatLngBounds(boundingBox?: IHereGeoBoundingBox): Nullable<LatLngBounds> {
    if (!boundingBox) {
        return null;
    }
    return latLngBounds(
        latLng(
            boundingBox.BottomRight.Latitude,
            boundingBox.BottomRight.Longitude,
        ),
        latLng(
            boundingBox.TopLeft.Latitude,
            boundingBox.TopLeft.Longitude,
        ),
    );
}

export function hereCoordinateToLatLng(coords?: IHereGeoCoordinate): Nullable<LatLng> {
    if (!coords) {
        return null;
    }
    return latLng(coords.Latitude, coords.Longitude);
}
