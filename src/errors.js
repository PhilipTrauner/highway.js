export class UnsupportedTypeError extends Error {
  constructor (data) {
    super(`Data type of ${data} unsupported`)
    Error.captureStackTrace(this, this.constructor)
  }
}
