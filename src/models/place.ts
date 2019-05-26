import {latLng, LatLng, latLngBounds, LatLngBounds} from "leaflet";
import {HereLocationType, IHereGeoBoundingBox, IHereGeoCoordinate, IHereSearchResult} from "../services/here-resources";
import {Nullable} from "../utils/nullable";
import {Record} from 'immutable';
import {ICoords} from "./coords";

export interface IPlaceInfo {
    locationId: string;
    placeType: HereLocationType;
    bounds: Nullable<[ICoords, ICoords]>;
    location: Nullable<ICoords>;
    title: Nullable<string>;
    description: Nullable<string>;
    selected?: boolean;
}

// export type PlaceInfoRecord = Record<IPlaceInfo> & Readonly<IPlaceInfo>;

const PlaceInfoRecord = Record<IPlaceInfo>({
    bounds: null,
    description: null,
    location: null,
    locationId: '',
    placeType: 'point',
    selected: false,
    title: null,
}, 'Geo place information');

export class PlaceInfo extends PlaceInfoRecord implements Readonly<IPlaceInfo> {
    toJSON(): IPlaceInfo {
        const result = super.toJSON();
        delete result.selected;
        return result;
    }

    public static fromHereSearchResult(hereResult: IHereSearchResult): PlaceInfo {
        return new PlaceInfo({
            placeType: hereResult.Location.LocationType || 'point',
            locationId: hereResult.Location.LocationId,
            location: hereResult.Location.DisplayPosition ?
                {
                    lat: hereResult.Location.DisplayPosition.Latitude,
                    lng: hereResult.Location.DisplayPosition.Longitude,
                } :
                null,
            bounds: hereResult.Location.MapView ? [
                {
                    lat: hereResult.Location.MapView.TopLeft.Latitude,
                    lng: hereResult.Location.MapView.TopLeft.Longitude
                },
                {
                    lat: hereResult.Location.MapView.BottomRight.Latitude,
                    lng: hereResult.Location.MapView.BottomRight.Longitude,
                }
            ] : null,
            description: (hereResult.Location.Address && hereResult.Location.Address.Label) || null,
            selected: false,
            title: hereResult.Location.Name || null,
        });
    }
}

/*
export function placeInfoToPlain(place: PlaceInfoRecord): Object {

    return {
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
}
*/

/*
export function placeInfoFromPlain(plainInfoPlain: Object): PlaceInfoRecord {
    if (!plainInfoPlain) {
        throw new Error('Cannot deserialize PlaceInfo');
    }

    // return PlaceInfoRecord({
    //     locationId: plainInfoPlain.locationId;
    // })

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
*/

/*
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
 */

/*
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
 */

/*
export function hereCoordinateToLatLng(coords?: IHereGeoCoordinate): Nullable<LatLng> {
    if (!coords) {
        return null;
    }
    return latLng(coords.Latitude, coords.Longitude);
}
 */
