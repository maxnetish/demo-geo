import {IHereGeoBoundingBox, IHereGeoCoordinate} from "../services/here-resources";
import {LatLng, latLng, latLngBounds, LatLngBounds} from "leaflet";

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
