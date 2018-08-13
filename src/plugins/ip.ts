import Vue, { PluginObject, VueConstructor } from 'vue'
import { db, UserInfo } from '../db'

const plugin: PluginObject<any> = {
  install: (vm: VueConstructor<Vue>, options?: any) => {
    Object.assign(vm.prototype, {
      $ip: {
        geolocation: async () => {
          return fetch('https://ipapi.co/json/')
            .then((res: Response) => res.json())
            .then((res: UserInfo) => {
              return db.userInfo
                .where({ ip: res.ip })
                .first((userInfo: UserInfo) => {
                  if (!userInfo) {
                    db.userInfo.add(res)
                    return res
                  }

                  return userInfo
                })
                .catch(error => {
                  console.error(error)
                })
            })
        },
        address: async () => {
          return fetch('https://api.ipify.org/?format=json').then((res: Response) => res.json())
        },
        lookup: (onNewIP: any) => {
          //  onNewIp - your listener function for new IPs
          var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection //compatibility for firefox and chrome
          var pc = new myPeerConnection({ iceServers: [] }),
            noop = function() {},
            localIPs = {},
            ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
            key

          function ipIterate(ip) {
            if (!localIPs[ip]) onNewIP(ip)
            localIPs[ip] = true
          }
          pc.createDataChannel('') //create a bogus data channel
          pc.createOffer(function(sdp) {
            sdp.sdp.split('\n').forEach(function(line) {
              if (line.indexOf('candidate') < 0) return
              line.match(ipRegex).forEach(ipIterate)
            })
            pc.setLocalDescription(sdp, noop, noop)
          }, noop) // create offer and set local description
          pc.onicecandidate = function(ice) {
            //listen for candidate events
            if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return
            ice.candidate.candidate.match(ipRegex).forEach(ipIterate)
          }
        }
      }
    })
  }
}

export var IPPlugin: PluginObject<any> = plugin
