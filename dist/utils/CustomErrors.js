"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NoRecordFoundError = void 0;

class ExtendableError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
  }

}

class NoRecordFoundError extends Error {
  constructor(message) {
    super(message || "Client sent a bad request", 400);
    Object.setPrototypeOf(this, NoRecordFoundError.prototype);
  }

}

exports.NoRecordFoundError = NoRecordFoundError;