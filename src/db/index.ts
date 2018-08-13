import Dexie from 'dexie'
import VueGeoselect from '../../types'

export interface SiteStateContract {
  id?: number
  lastUpdated: Date
}

export interface CountryContract {
  id?: number
  alpha2Code: string
  alpha3Code: string
  altSpellings: string[]
  area: number
  borders: string[]
  callingCodes: number[]
  capital: string
  cioc: string
  currencies: object[]
  demonym: string
  flag: string
  gini: number
  languages: string[]
  latlng: number[]
  name: string
  nativeName: string
  numericCode: number
  population: number
  region: number
  regionalBlocs: number
  subregion: number
  timezones: string[]
  topLevelDomain: string[]
  translations: { [key: string]: string }
}

export interface UserInfoContract {
  id?: number
  asn: string
  city: string
  continent_code: string
  country: string
  country_calling_code: string
  country_name: string
  currency: string
  in_eu: boolean
  ip: string
  languages: string
  latitude: number
  longitude: number
  org: string
  postal: string
  region: string
  region_code: string
  timezone: string
  utc_offset: string
}

export class UserInfo implements UserInfoContract {
  id: number
  asn: string
  city: string
  continent_code: string
  country: string
  country_calling_code: string
  country_name: string
  currency: string
  in_eu: boolean
  ip: string
  languages: string
  latitude: number
  longitude: number
  org: string
  postal: string
  region: string
  region_code: string
  timezone: string
  utc_offset: string

  constructor(asn: string, city: string, continent_code: string, country: string, country_calling_code: string, country_name: string, currency: string, in_eu: boolean, ip: string, languages: string, latitude: number, longitude: number, org: string, postal: string, region: string, region_code: string, timezone: string, utc_offset: string, id?: number) {
    this.asn = asn
    this.city = city
    this.continent_code = continent_code
    this.country = country
    this.country_calling_code = country_calling_code
    this.country_name = country_name
    this.currency = currency
    this.in_eu = in_eu
    this.ip = ip
    this.languages = languages
    this.latitude = latitude
    this.longitude = longitude
    this.org = org
    this.postal = postal
    this.region = region
    this.region_code = region_code
    this.timezone = timezone
    this.utc_offset = utc_offset
    if (id) this.id = id
  }

  save() {
    return db.transaction('rw', db.userInfo, async () => {
      this.id = await db.userInfo.put(this)
    })
  }
}

export class SiteState implements SiteStateContract {
  id: number
  lastUpdated: Date

  constructor(lastUpdated: Date, id?: number) {
    this.lastUpdated = lastUpdated
    if (id) this.id = id
  }

  save() {
    return db.transaction('rw', db.siteState, async () => {
      this.id = await db.siteState.put(this)
    })
  }
}

export class Country implements CountryContract {
  alpha2Code: string
  alpha3Code: string
  altSpellings: string[]
  area: number
  borders: string[]
  callingCodes: number[]
  capital: string
  cioc: any
  currencies: object[]
  demonym: string
  flag: string
  gini: number
  languages: string[]
  latlng: number[]
  name: string
  nativeName: string
  numericCode: number
  population: number
  region: number
  regionalBlocs: number
  subregion: number
  timezones: string[]
  topLevelDomain: string[]
  translations: { [key: string]: string }

  constructor(alpha2Code: string, alpha3Code: string, altSpellings: string[], area: number, borders: string[], callingCodes: number[], capital: string, cioc: any, currencies: object[], demonym: string, flag: string, gini: number, languages: string[], latlng: number[], name: string, nativeName: string, numericCode: number, population: number, region: number, regionalBlocs: number, subregion: number, timezones: string[], topLevelDomain: string[], translations: { [key: string]: string }, id?: number) {
    this.alpha2Code = alpha2Code
    this.alpha3Code = alpha3Code
    this.altSpellings = altSpellings
    this.area = area
    this.borders = borders
    this.callingCodes = callingCodes
    this.capital = capital
    this.cioc = cioc
    this.currencies = currencies
    this.demonym = demonym
    this.flag = flag
    this.gini = gini
    this.languages = languages
    this.latlng = latlng
    this.name = name
    this.nativeName = nativeName
    this.numericCode = numericCode
    this.population = population
    this.region = region
    this.regionalBlocs = regionalBlocs
    this.subregion = subregion
    this.timezones = timezones
    this.topLevelDomain = topLevelDomain
    this.translations = translations
    if (id) this.id = id
  }

  save() {
    return db.transaction('rw', db.countries, async () => {
      this.id = await db.countries.put(this)
    })
  }
}

class VueGeoselectDatabase extends Dexie {
  countries: Dexie.Table<Country, number>
  siteState: Dexie.Table<SiteState, number>
  userInfo: Dexie.Table<UserInfo, number>

  constructor(databaseName) {
    super(databaseName)

    var db = this

    db.version(1).stores({
      countries: `++id, ${Object.getOwnPropertyNames(new Country()).join()}`,
      siteState: `++id, ${Object.getOwnPropertyNames(new SiteState()).join()}`,
      userInfo: `++id, ${Object.getOwnPropertyNames(new UserInfo()).join()}`
    })

    db.countries.mapToClass(Country)
    db.siteState.mapToClass(SiteState)
    db.userInfo.mapToClass(UserInfo)
  }
}

export var db = new VueGeoselectDatabase('vue-geoselect')
