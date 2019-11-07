//notes
//this class made for creating table data which can be used in table component
//it gets a dataset

//functions

/*
    datacheck function loop through the data 
    and create different layers, based on data types and return an array of 
    data in each levels
*/
/*
    getHeaders function gets the data and take the headers in each level
    and return an array of objects of headers by levels
*/
/*
    getKeys function gets the data and take the keys in each level
    and return an array of objects of keys by levels
*/
/*
    getTableData is the main public function which return the usable data for tables,
    based on the request of layers and rows.
    If there are more layers, it can be displayed only in one level, 
    it will return the concenated arrays of layers and filter the columns based on the final array.
*/

import DataTypeCheck from "./DataTypeCheck";
import moment from "moment";

export default class TableData {
  constructor(dataSet, selectedColumns = 0) {
    this.dataSet = dataSet;
    this.selectedColumns = selectedColumns;
  }

  /**
   * Returns separate the primitive and object types for table
   * @param {array} data data to check
   * @return an object of arrays, useable and unuseable data for table
   */
  _dataCheck(data) {
    //usable and unusable(object) data for table
    let result = {
      useable: [],
      unuseable: []
    };
    let prim = {};
    if (Array.isArray(data)) {
      data.map(item => {
        const entries = Object.entries(item);
        for (const [entry, value] of entries) {
          let type = new DataTypeCheck(value);
          let { convertible, to } = type.isStringConvertible();
          if (type.isNull() || type.isUndefined()) {
            console.log(typeof value);
          }
          if (convertible && to === "Date") {
            prim = { ...prim, [entry]: moment(value).format("DD-MM-YYYY HH:mm") };
          }
          if (type.isPrimitive() && !(convertible && to === "Date")) {
            prim = { ...prim, [entry]: value };
          } else {
            result.unuseable.push(item[entry]);
          }
        }

        result.useable.push(prim);
      });
    } else {
      console.log(data);
      console.log(typeof data);
    }

    return result;
  }

  /**
   * Create table data based on the selected columns
   */
  _createTableData() {
    const data = this._dataCheck(this.dataSet);
    const columns = this.selectedColumns;
    let result = {
      tableData: [],
      unusable: data.unuseable
    };
    data.useable.map(item => {
      const entries = Object.entries(item);
      let returnObject = {};

      if (columns === 0 || (Array.isArray(columns) && columns.length === 0)) {
        result.tableData.push(item);
      } else {
        for (let key of columns) {
          if (entries[key - 1] !== undefined) {
            const [entry, value] = entries[key - 1];
            returnObject = { ...returnObject, [entry]: value };
          }
        }
        result.push(returnObject);
      }
    });

    return result;
  }

  /**
   * Returns an array of headers
   */
  getHeaders() {
    const { tableData: data } = this._createTableData();
    const keys = Object.keys(data[0]);
    const headers = [];
    keys.map(key => {
      headers.push(key.charAt(0).toUpperCase() + key.slice(1));
    });
    return headers;
  }

  /**
   * Returns an array of keys
   */
  getKeys() {
    const { tableData: data } = this._createTableData();
    return Object.keys(data[0]);
  }
  /**
   * Returns an array of object of data of choosen columns
   */
  getTableData() {
    const headers = this.getHeaders();
    const keys = this.getKeys();
    const { tableData: data, unusable: unused } = this._createTableData();

    const result = {
      headers,
      keys,
      data,
      unused
    };

    return result;
  }
  /**
   * Returns an array of sets
   */
  getUniqueData() {
    const { tableData: data } = this._createTableData();
    const keys = this.getKeys();

    const result = [];

    keys.map(column => {
      const set = new Set();
      data.map(row => {
        const item = new DataTypeCheck(row[column]);
        const itemDate = moment(row[column]);
        if (!item.isNumber() && itemDate.isValid()) {
          set.add(itemDate.format("DD-MM-YYYY"));
        } else {
          set.add(row[column]);
        }
      });
      result.push([...set]);
    });

    return result;
  }
  /**
   * Returns an object of keys
   */
  getFilterKeys() {
    const keys = this.getKeys();
    let obj = {};
    keys.map(key => {
      obj = { ...obj, [key]: "" };
    });
    return obj;
  }
  /**
   * Returns an object of column keys and a boolean (true)
   */
  getColumns() {
    const keys = this.getKeys();
    let obj = {};

    keys.map((key, i) => {
      obj = { ...obj, [key]: true };
    });
    return obj;
  }
  /**
   * Returns an array of filtered data based on the input params
   */
  getFilteredData(rowFilters, columnSelect) {
    //filter column keys
    //filter data
    //filter search
    const { tableData: data } = this._createTableData();
    const keys = this.getKeys();

    const columnFilter = [];
    keys.map(key => {
      if (columnSelect[key]) {
        columnFilter.push(key);
      }
    });

    const columnFilteredData = [];
    data.map(item => {
      let returnObject = {};
      Object.entries(item).map(entry => {
        const [key, value] = entry;
        if (columnFilter.includes(key)) returnObject = { ...returnObject, [key]: value };
      });
      columnFilteredData.push(returnObject);
    });

    const result = columnFilteredData.filter(item => {
      const match = [];
      for (const [tfEntry, tfValue] of Object.entries(rowFilters)) {
        if (tfValue !== "") {
          match.push(
            item[tfEntry] === tfValue ||
              item[tfEntry] === undefined ||
              moment(item[tfEntry]).format("DD-MM-YYYY") === tfValue
          );
        }
      }
      return match.every(m => m === true);
    });

    return result;
  }
}
