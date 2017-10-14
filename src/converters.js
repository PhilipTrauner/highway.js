import {
  NUMBER_TYPE,
  LIST_TYPE,
  DICT_TYPE,
  BOOLEAN_TYPE,
  NULL_TYPE,
  BYTES_TYPE
} from './types.js'

// mport { TextDecoder } from 'text-encoding'

function convert (data, dataType) {
  try {
    if (dataType !== BYTES_TYPE) {
      data = new TextDecoder('utf-8').decode(data)
      // Data is already String -> No conversion required
      switch (dataType) {
        case NUMBER_TYPE:
          data = Number(data)
          break
        case LIST_TYPE:
        case DICT_TYPE:
          data = JSON.parse(data)
          break
        case BOOLEAN_TYPE:
          data = Boolean(Number(data))
          break
        case NULL_TYPE:
          data = null
          break
      }
    // Data type is bytes -> Wrapping in view
    } else {
      data = new Int8Array(data)
    }
  } catch (err) {
    console.error(`Data conversion failed. (${err.message})`)
    return undefined
  }
  return data
}

export { convert }
