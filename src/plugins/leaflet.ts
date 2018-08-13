import * as L from 'leaflet'

const LeafletPlugin = {
  install: (vm, options) => {
    Object.defineProperty(vm.prototype, '$leaflet', {
      value: new Proxy(L.Map, {
        get: (target, prop, receiver) => {
          if (prop in target) {
            return target[prop]
          }
        }
      })
    })
  }
}

export default LeafletPlugin
