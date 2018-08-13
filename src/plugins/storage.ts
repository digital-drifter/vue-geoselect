import Cookie from 'js-cookie'
import Vue, { PluginFunction, PluginObject, VueConstructor } from 'vue'

const installStorageProxy = function({ storage, key, accessor, mutator }) {
  return new Proxy(storage, {
    get: function(target, prop, receiver) {
      if (prop in target) {
        return target[prop]
      }

      const payload = accessor.call(target, `${key}-${prop}`)

      if (payload) {
        const decoded = JSON.parse(payload)

        return decoded.hasOwnProperty(prop) ? decoded[prop] : null
      }

      return null
    },
    set: function(target, prop, value) {
      if (prop in target) {
        target[prop] = value
      } else {
        const payload = accessor.call(target, key)

        let hash

        if (payload) {
          hash = Object.assign({}, payload, { [prop]: value })
        } else {
          hash = { [prop]: value }
        }

        mutator.call(target, `${key}-${prop}`, JSON.stringify(hash))
      }

      return true
    }
  })
}

const StoragePlugin: PluginObject<any> = {
  install: function(vm: VueConstructor<Vue>, options?: any) {
    let storage: ProxyConstructor

    options.key = options.key || 'app-storage'

    switch (options.storage || 'local') {
      case 'local':
        if (window && window.localStorage) {
          storage = installStorageProxy({
            storage: window.localStorage,
            key: options.key,
            mutator: window.localStorage.setItem,
            accessor: window.localStorage.getItem
          })
        }
        break
      case 'cookie':
        if (navigator && navigator.cookieEnabled) {
          storage = installStorageProxy({
            storage: Cookie,
            key: options.key,
            mutator: Cookie.set,
            accessor: Cookie.get
          })
        }
        break
      case 'session':
        if (window && window.sessionStorage) {
          storage = installStorageProxy({
            storage: window.sessionStorage,
            key: options.key,
            mutator: window.sessionStorage.setItem,
            accessor: window.sessionStorage.getItem
          })
        }
        break
    }

    if (storage) {
      Object.assign(vm.prototype, {
        $storage: storage
      })
    } else {
      throw new Error(`Unsupported storage type: ${options.storage || 'local'}`)
    }
  }
}

export default StoragePlugin
