export as namespace VueGeoselect

export = VueGeoselect

declare class VueGeoselect {
  public geodata: Plugin
  public leaflet: Plugin
}

declare namespace VueGeoselect {
  export type Dictionary<T> = { [key: string]: T }

  export type LocationIdentifier = string | number

  export interface Geodata {
    country: LocationIdentifier
    state: LocationIdentifier
    city: LocationIdentifier
    fetchListData(params?: Geodata.Requests.Params): Promise<any>
    fetchLocationDetails(params?: Geodata.Requests.Params): Promise<any>
    fetchCountries(params?: Geodata.Requests.Params): Promise<any>
    fetchStates(params?: Geodata.Requests.Params): Promise<any>
    fetchCities(params?: Geodata.Requests.Params): Promise<any>
  }

  export namespace Geodata {
    export namespace Requests {
      export type Params = List.Params | Rest.Params

      export namespace List {
        export type Type = 'getCountries' | 'getStates' | 'getCities' | 'confCity'

        export type Option = 'order-alpha'

        export interface Params {
          type: Type
          addClasses: Option | Option[]
          countryId: string | number
          stateId: string | number
          cityId: string | number
        }
      }
      export namespace Rest {
        export interface Params {
          country?: string
          state?: string
          city?: string
          orderby?: string
          limit?: number
        }
      }
    }

    export interface Endpoint {
      path: string
      params: Requests.List.Params | Requests.Rest.Params
    }

    export interface Options {
      baseUrl: string
      endpoints: Dictionary<Endpoint>
    }
  }

  export namespace Leaflet {
    export namespace Map {
      type LatLng = {
        lat: number
        lng: number
      }
      export interface Marker {
        latlng: LatLng
        options: Dictionary<any>
      }
      export interface Options {
        latlng: LatLng
        zoom: number
        markers: Marker[]
      }
    }
  }
}
