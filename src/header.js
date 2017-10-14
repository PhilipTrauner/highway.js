// import { TextEncoder } from 'text-encoding'
import {
  REVERSE_DATA_TYPES
} from './types.js'
import { jspack } from 'jspack'
import {
  prepare,
  BYTES
} from './preparers.js'

const PACK_FORMAT = 'BH'

function packMessage (data, exchangeRoute, debug = false) {
  var preparedData = prepare(data)

  data = preparedData[0]
  var originalDataType = preparedData[1]

  var dataArray = null

  if (originalDataType !== BYTES) {
    dataArray = new TextEncoder().encode(data)
  } else {
    dataArray = data
  }

  var metadataArray = createMetadata(originalDataType, exchangeRoute)

  var packedMessage = new Int8Array(dataArray.length + metadataArray.length)
  packedMessage.set(metadataArray)
  packedMessage.set(dataArray, metadataArray.length)

  return packedMessage
}

function createMetadata (dataType, convertedRoute) {
  convertedRoute = Number(convertedRoute)
  // 256 because that's the maximum value of a struct field with encoding H
  return new Int16Array([dataType, 0, convertedRoute % 256,
    Math.floor(convertedRoute / 256)])
}

function unpackHeader (message) {
  var metadata = jspack.Unpack(PACK_FORMAT, message.slice(0, 4))
  var dataType = REVERSE_DATA_TYPES[metadata[0]]
  var mRoute = metadata[1]

  return [dataType, mRoute]
}

export { packMessage, unpackHeader }
