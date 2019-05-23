import {latLng, LatLng, latLngBounds, LatLngBounds} from "leaflet";
import {HereLocationType, IHereGeoBoundingBox, IHereGeoCoordinate, IHereSearchResult} from "../services/here-resources";
import {Nullable} from "../utils/nullable";

export class PlaceInfo {

    get locationId(): string {
        return this.$locationId;
    }

    get placeType(): Nullable<HereLocationType> {
        return this.$placeType;
    }

    get bounds(): Nullable<LatLngBounds> {
        return this.$bounds;
    }

    get location(): Nullable<LatLng> {
        return this.$location;
    }

    get label(): Nullable<string> {
        if (this.$title && this.$description) {
            return `${this.$title} (${this.$description})`;
        }
        if (this.$title || this.$description) {
            return this.$title || this.$description;
        }
        return null;
    }

    get title(): Nullable<string> {
        return this.$title;
    }

    get description(): Nullable<string> {
        return this.$description;
    }

    public static fromHereSearchResult(hereResult: IHereSearchResult): PlaceInfo {
        return new PlaceInfo(
            hereResult.Location.LocationId,
            hereCoordinateToLatLng(hereResult.Location.DisplayPosition),
            hereGeoBoundingBoxToLatLngBounds(hereResult.Location.MapView),
            hereResult.Location.LocationType,
            hereResult.Location.Name,
            hereResult.Location.Address && hereResult.Location.Address.Label,
        );
    }

    public Clone(): PlaceInfo {
        return new PlaceInfo(
            this.locationId,
            this.location,
            this.bounds,
            this.placeType,
            this.title,
            this.description,
            this.selected,
        );
    }

    constructor(
        private $locationId: string,
        private $location: Nullable<LatLng> = null,
        private $bounds: Nullable<LatLngBounds> = null,
        private $placeType: Nullable<HereLocationType> = 'point',
        private $title: Nullable<string> = null,
        private $description: Nullable<string> = null,
        public selected: boolean = false,
    ) {

    }
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
