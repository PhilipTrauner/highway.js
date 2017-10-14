import {
  META_ROUTE_INDEX,
  META_ROUTE,
  createExchangeRoutes,
  metaRoute
} from './routing.js'

import { reverseDict } from './utils.js'
import {
  packMessage,
  unpackHeader
} from './header.js'

import { convert } from './converters.js'

import { UnsupportedTypeError } from './errors.js'

import { INTERNAL_ERROR } from './close_reasons.js'

export class Highway {
  constructor (address, routes, debug = false) {
    /*
    if (new.target === Highway) {
      throw new TypeError('Cannot construct Highway instances directly')
    }
    */
    this.address = address
    this.routes = routes
    this.debug = debug

    this.webSocket = null

    this.routes['meta'] = metaRoute

    this.exchangeRoutes = createExchangeRoutes(this.routes)
    this.reverseExchangeRoutes = reverseDict(this.exchangeRoutes)
    // Peer routes have not been received yet. As per convention the meta route
    // has to exist and we need it for our first send to succeed (otherwise it
    // would fail during route lookup).
    this.peerExchangeRoutes = {[META_ROUTE_INDEX]: META_ROUTE}
    this.peerReverseExchangeRoutes = reverseDict(this.peerExchangeRoutes)
  }

  start () {
    this.webSocket = new WebSocket(this.address)
    this.webSocket.binaryType = 'arraybuffer'

    this.webSocket.onmessage = this.onMessage.bind(this)
    /*
    this.webSocket.onclose = this.onClose
    this.webSocket.onerror = this.onError
    */
  }

  onMessage (message) {
    var rawData = new Int8Array(message.data)
    var metadata = unpackHeader(rawData)

    var dataType = metadata[0]
    var mRoute = metadata[1]

    if (mRoute in this.exchangeRoutes) {
      var route = this.exchangeRoutes[mRoute]
      var data = convert(message.data.slice(4, message.data.length), dataType)

      if (this.debug) {
        console.log(`Received '${dataType}' on route '${route}'`)
        console.log(data)
      }
      this.routes[route](data, this)
    } else {
      console.error(`Received message with non-existing route ('${mRoute}')`)
    }
  }

  send (data, route) {
    if (route in this.peerReverseExchangeRoutes) {
      if (this.debug) {
        console.log(`Sending on route '${route}'`)
        console.log(data)
      }
      try {
        var packedMessage = packMessage(data,
          this.peerReverseExchangeRoutes[route], this.debug)

        this.webSocket.send(packedMessage)
      } catch (e) {
        if (e instanceof UnsupportedTypeError) {
          this.close(INTERNAL_ERROR.code, INTERNAL_ERROR.reason)
        }
      }
    } else {
      console.error(`'${route}' is not a valid peer route.`)
    }
  }

  close (code = 1000, reason = '') {
    this.webSocket.close(code, reason)
  }

  onOpen () {

  }

  onClose () {

  }

  onError (error) {
    throw error
  }

  onReady () {

  }
}
