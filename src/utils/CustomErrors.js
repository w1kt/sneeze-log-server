export class NoRecordFoundError extends Error {
  constructor(message = "No record found") {
    super(message);
    Error.captureStackTrace(this, NoRecordFoundError)
  }
}
