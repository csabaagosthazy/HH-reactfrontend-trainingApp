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
  constructor(dataSet, rowFilters = {}, columnSelect = {}) {
    this.dataSet = dataSet;
    this.rowFilters = rowFilters;
    this.columnSelect = columnSelect;
  }

  /**
   * Returns an array of filtered data based on the input params
   */
  getFilteredData() {
    //filter column keys
    //filter data
    //filter search
    const data = this.dataSet;
    const keys = Object.keys(this.dataSet[0].data);

    const columnFilter = [];
    keys.map(key => {
      if (Object.entries(this.columnSelect).length === 0) {
        columnFilter.push(key);
      } else if (this.columnSelect[key]) {
        columnFilter.push(key);
      }
    });
    const columnFilteredData = [];
    data.map(item => {
      let returnObject = {};
      let returnData = {};
      Object.entries(item.data).map(entry => {
        const [key, value] = entry;
        if (columnFilter.includes(key)) returnData = { ...returnData, [key]: value };
      });
      returnObject = {
        id: item.id,
        data: returnData
      };
      columnFilteredData.push(returnObject);
    });
    const result = columnFilteredData.filter(item => {
      const match = [];
      for (const [tfEntry, tfValue] of Object.entries(this.rowFilters)) {
        if (tfValue !== "") {
          match.push(
            item.data[tfEntry] === tfValue ||
              item.data[tfEntry] === undefined ||
              moment(item.data[tfEntry]).format("YYYY-MM-DD") === tfValue
          );
        }
      }
      return match.every(m => m === true);
    });
    return result;
  }
  /**
   * Seperates data and id
   */
  _seperateData() {
    const data = this.getFilteredData();
    const result = [];
    data.map(item => {
      result.push(item.data);
    });
    return result;
  }
  /**
   * Returns an array of headers
   */
  getHeaders() {
    const data = this._seperateData();
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
    const data = this._seperateData();
    return Object.keys(data[0]);
  }
  /**
   * Returns an array of object of data of choosen columns
   */
  getTableData() {
    const headers = this.getHeaders();
    const keys = this.getKeys();
    const data = this.getFilteredData();

    const result = {
      headers,
      keys,
      data
    };

    return result;
  }
  /**
   * Returns an array of sets
   */
  getUniqueData() {
    const data = this._seperateData();
    const keys = this.getKeys();

    const result = [];

    keys.map(column => {
      const set = new Set();
      data.map(row => {
        const item = new DataTypeCheck(row[column]);
        const itemDate = moment(row[column]);
        if (!item.isNumber() && itemDate.isValid()) {
          set.add(itemDate.format("YYYY-MM-DD"));
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
   * For comlumn filtering
   */
  getColumns() {
    const keys = this.getKeys();
    let obj = {};

    keys.map((key, i) => {
      obj = { ...obj, [key]: true };
    });
    return obj;
  }
}
