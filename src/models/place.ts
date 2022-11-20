import {latLng, LatLng, latLngBounds, LatLngBounds} from "leaflet";
import {HereLocationType, IHereGeoBoundingBox, IHereGeoCoordinate, IHereSearchResult} from "../services/here-resources";
import {Nullable} from "../utils/nullable";
import {Record} from 'immutable';
import {HereCoords} from "./here-coords";
import { HereLookupResponse } from './here-lookup-response';
import { HereResultType } from './here-result-type';

export interface IPlaceInfo {
    locationId: string;
    placeType: HereLocationType;
    bounds: Nullable<[HereCoords, HereCoords]>;
    location: Nullable<HereCoords>;
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

    public static fromHereSearchResult(hereResult: HereLookupResponse): PlaceInfo {
        return new PlaceInfo({
            placeType: 'point',
            locationId: hereResult.id,
            location: hereResult.position ?
                {
                    lat: hereResult.position.lat,
                    lng: hereResult.position.lng,
                } :
                null,
            bounds: hereResult.mapView ? [
                {
                    lat: hereResult.mapView.north,
                    lng: hereResult.mapView.west,
                },
                {
                    lat: hereResult.mapView.south,
                    lng: hereResult.mapView.east,
                },
            ] : null,
            description: (hereResult.address && hereResult.address.label) || null,
            selected: false,
            title: hereResult.title || null,
        });
    }
    public toJSON(): IPlaceInfo {
        const result = super.toJSON();
        delete result.selected;
        return result;
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
