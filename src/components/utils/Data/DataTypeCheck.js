// checks the data type of input

import moment from "moment";

export default class DataTypeCheck {
  constructor(data) {
    this.data = data;
  }

  isString() {
    return typeof this.data === "string";
  }

  isNumber() {
    return typeof this.data === "number" && isFinite(this.data);
  }
  isBoolean() {
    return typeof this.data === "boolean";
  }

  isSymbol() {
    return typeof this.data === "symbol";
  }

  isPrimitive() {
    return this.data === null || (typeof this.data !== "object" && typeof this.data !== "function");
  }

  isNull() {
    return this.data === null;
  }
  isUndefined() {
    return this.data === "undefined";
  }
  isDate() {
    return this.data instanceof Date;
  }

  isObject() {
    return this.data !== null && typeof this.data === "object";
  }

  objectType() {
    switch (this.data.constructor) {
      case String:
        return "string";
      case Number:
        return "number";
      case Boolean:
        return "boolean";
      case Date:
        return "date";
      case RegExp:
        return "regexp";
      case Error:
        return "error";
      case Array:
        return "array";
      case Object:
        return "object";
      default:
        return "unknown";
    }
  }

  isValidDate(str) {
    let date = moment(str);
    const format = "YYYY-MM-DDTHH:mm:ss.SSSSZ";
    if (date.isValid() && date._f === format) return true;
    return false;
  }
  isStringConvertible() {
    let result = {
      convertible: false,
      to: ""
    };
    if (isFinite(this.data))
      result = {
        convertible: true,
        to: "Finite"
      };
    if (!isFinite(this.data) && this.isValidDate(this.data))
      result = {
        convertible: true,
        to: "Date"
      };
    return result;
  }
}
