import {latLng, LatLng, latLngBounds, LatLngBounds} from "leaflet";
import {HereLocationType, IHereGeoBoundingBox, IHereGeoCoordinate, IHereSearchResult} from "../services/here-resources";

export interface IPlaceInfo {
    location: LatLng;
    bounds: LatLngBounds | null;
    placeType: HereLocationType;
    label: string | null;
    locationId: string;
}

export function hereGeoBoundingBoxToLatLngBounds(boundingBox: IHereGeoBoundingBox): LatLngBounds {
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

export function hereCoordinateToLatLng(coords: IHereGeoCoordinate): LatLng {
    return latLng(coords.Latitude, coords.Longitude);
}

export function placeInfo(entity: IHereSearchResult): IPlaceInfo {
    let label: string = null;
    if (entity.Location && entity.Location.Name && entity.Location.Address) {
        label = `${entity.Location.Name} (${entity.Location.Address.Label})`;
    }
    if (entity.Location && entity.Location.Name && entity.Location.Address) {
        label = `${entity.Location.Address.Label}`;
    }

    return {
        bounds: (entity.Location && entity.Location.MapView) ?
            hereGeoBoundingBoxToLatLngBounds(entity.Location.MapView) :
            null,
        label,
        location: hereCoordinateToLatLng(entity.Location.DisplayPosition),
        locationId: entity.Location.LocationId,
        placeType: entity.Location.LocationType,
    };
}
