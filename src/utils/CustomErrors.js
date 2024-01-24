export class NoRecordFoundError extends Error {
  constructor(message = "No record found") {
    super(message);
    Error.captureStackTrace(this, NoRecordFoundError)
  }
}

export class BadRequestError extends Error {
  constructor(message = "Bad Request") {
    super(message);
    Error.captureStackTrace(this, NoRecordFoundError)
  }
}