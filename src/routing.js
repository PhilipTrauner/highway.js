import { reverseDict } from './utils.js'
import { INVALID_STATE } from './close_reasons.js'

const META_ROUTE = 'meta'
const META_ROUTE_INDEX = 0

function createExchangeRoutes (routes) {
  var exchangeMap = {[META_ROUTE_INDEX]: META_ROUTE}
  var exchangeId = 1
  for (var route in routes) {
    if (route !== META_ROUTE) {
      exchangeMap[exchangeId] = route
      exchangeId += 1
    }
  }
  return exchangeMap
}

function metaRoute (data, handler) {
  if (typeof data === typeof {}) {
    handler.peerExchangeRoutes = data
    if (handler.debug) {
      console.log(`Received peer exchange routes: ${data}`)
    }
    handler.peerReverseExchangeRoutes = reverseDict(handler.peerExchangeRoutes)
    handler.send(handler.exchangeRoutes, META_ROUTE)

    handler.onReady()
  } else {
    handler.close(INVALID_STATE.code, INVALID_STATE.reason)
  }
}

export { META_ROUTE, META_ROUTE_INDEX, createExchangeRoutes, metaRoute }
