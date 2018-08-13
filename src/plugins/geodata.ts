import { parse, stringify } from 'qs'
import Vue, { PluginObject, VueConstructor } from 'vue'
import * as VueGeoselect from '../../types'
import Geodata = VueGeoselect.Geodata

class GeodataWrapper {
  public revocable: any

  private readonly options: Map<PropertyKey, any>

  constructor(options: Geodata.Options) {
    this.options = new Map()

    Object.keys(options).forEach((key: string) => {
      this.options.set(key, options[key])
    })
  }
  public async fetchListData(params?: Geodata.Requests.List.Params) {
    const { list } = this.options.get('endpoints')

    params = params || list.params

    return fetch(this.createUrl(list.path, params))
      .then((res: Response) => res.json())
      .then((res: any) => {
        return Object.keys(res.result).map(key => {
          return {
            code: key,
            name: res.result[key]
          }
        })
      })
  }
  private createUrl(path: string, params?: object): string {
    return [this.options.get('baseUrl'), path, stringify(params)].join('')
  }
}

const GeodataPlugin: PluginObject<any> = {
  install: function(vm: VueConstructor<Vue>, options: Geodata.Options) {
    const geodata: GeodataWrapper = new GeodataWrapper(options)
    const proxy: ProxyConstructor = new Proxy<GeodataWrapper>(geodata, {
      get: function<T extends GeodataWrapper>(target: T, prop: PropertyKey, receiver?: any) {
        if (prop in target) {
          return target[prop]
        }

        return target.options.has(prop) ? target.options.get(prop) : false
      },
      set: function<T extends GeodataWrapper>(target: T, prop: PropertyKey, value: any) {
        if (prop in target) {
          target[prop] = value
        } else {
          let payload: any

          if (target.options.has(prop)) {
            let current = target.options.get(prop)

            payload = typeof current === 'object' ? Object.assign({}, current, { ...value }) : value
          } else {
            payload = value
          }

          target.options.set(prop, payload)
        }

        return true
      }
    })

    Object.defineProperty(vm.prototype, '$geodata', {
      value: proxy
    })
  }
}

export default GeodataPlugin
