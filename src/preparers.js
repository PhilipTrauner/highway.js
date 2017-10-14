import { isInt } from './utils.js'
import {
  STRING_TYPE,
  NUMBER_TYPE,
  BOOLEAN_TYPE,
  DICT_TYPE,
  LIST_TYPE,
  BYTES_TYPE
} from './types.js'

import { UnsupportedTypeError } from 'errors.js'

const STRING = 0
const INTEGER = 1
const FLOAT = 2
const BOOLEAN = 3
const LIST = 4
const DICT = 5
const BYTES = 7
const NULL = 8

function prepare (data) {
  var originalDataType = Object.prototype.toString.call(data)
  var dataType

  // Assume data is bytes if no supported data type is found
  if (data === null) {
    data = ''
    dataType = NULL
  } else {
    switch (originalDataType) {
      case STRING_TYPE:
        dataType = STRING
        break
      case NUMBER_TYPE:
        data = String(data)
        if (isInt(data)) {
          dataType = INTEGER
        } else {
          dataType = FLOAT
        }
        break
      case BOOLEAN_TYPE:
        data = String(Number(data))
        dataType = BOOLEAN
        break
      case DICT_TYPE:
        data = JSON.stringify(data)
        dataType = DICT
        break
      case LIST_TYPE:
        data = JSON.stringify(data)
        dataType = LIST
        break
      case BYTES_TYPE:
        dataType = BYTES
        break
      default:
        throw new UnsupportedTypeError(data)
    }
  }
  return [data, dataType]
}

export { prepare, BYTES, UnsupportedTypeError }
