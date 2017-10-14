export const STRING_TYPE = Object.prototype.toString.call('')
export const NUMBER_TYPE = Object.prototype.toString.call(0)
export const BOOLEAN_TYPE = Object.prototype.toString.call(false)

export const INTEGER_TYPE = NUMBER_TYPE
export const FLOAT_TYPE = NUMBER_TYPE

export const LIST_TYPE = Object.prototype.toString.call([])
export const DICT_TYPE = Object.prototype.toString.call({})

export const TUPLE_TYPE = LIST_TYPE

export const BYTES_TYPE = Object.prototype.toString.call(new Int8Array())

export const NULL_TYPE = Object.prototype.toString.call(null)

export const REVERSE_DATA_TYPES = {
  0: STRING_TYPE,
  1: INTEGER_TYPE,
  2: FLOAT_TYPE,
  3: BOOLEAN_TYPE,
  4: LIST_TYPE,
  5: DICT_TYPE,
  6: TUPLE_TYPE,
  7: BYTES_TYPE,
  8: NULL_TYPE
}
