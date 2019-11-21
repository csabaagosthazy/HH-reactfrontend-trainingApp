// checks the data type of input

import moment from "moment";
import upcast from "upcast";

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

  isValidDate(str, format) {
    let date = moment(str);
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

  convertData(name, schema) {
    const value = this.data;
    let result = "";
    Object.keys(schema).map(key => {
      //console.log(key);
      if (key === "date" && this.isValidDate(value, schema[key].formatIn)) {
        result = moment(value).format(schema[key].formatOut);
      } else if (key === name) {
        if (upcast.is(value, schema[key].type)) result = value;
        else {
          result = upcast.to(value, schema[key].type);
        }
      }
    });

    return result;
  }
}
