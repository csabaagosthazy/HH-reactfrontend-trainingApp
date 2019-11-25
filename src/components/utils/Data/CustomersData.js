//notes
//this class made for creating table data which can be used in customers table component
//it gets a dataset

//functions

/*
    Create customers data based on the API documentation
*/
/*
    Interface, create an array of objects
*/

/*
    Data details:
    id (long)
    firstname (String)
    lastname (String)
    streetaddress (String)
    postcode (String)
    city (String)
    email (String)
    phone (String)

    get trainings:
    /customers/{id}/trainings

    For crud methods:
    update: /customers/{id} endpoint '_links.self.href'
    delete: /customers/{id}  endpoint 

*/

import DataTypeCheck from "./DataTypeCheck";
import Joi from "joi-browser";

export default class CustomersData {
  constructor(dataSet, selectedColumns = 0) {
    this.dataSet = dataSet;
    this.selectedColumns = selectedColumns;
    this.schema = {
      firstname: {
        type: "string",
        header: "Firstname",
        select: false,
        joi: Joi.string()
          .required()
          .label("Firstname")
      },
      lastname: {
        type: "string",
        header: "Lastname",
        select: false,
        joi: Joi.string()
          .required()
          .label("Lastname")
      },
      streetaddress: {
        type: "string",
        header: "Streetaddress",
        select: false,
        joi: Joi.string()
          .required()
          .label("Streetaddress")
      },
      postcode: {
        type: "string",
        header: "Postcode",
        select: false,
        joi: Joi.string()
          .required()
          .label("Postcode")
      },
      city: {
        type: "string",
        header: "City",
        select: false,
        joi: Joi.string()
          .required()
          .label("City")
      },
      email: {
        type: "string",
        header: "Email",
        select: false,
        joi: Joi.string()
          .required()
          .label("Email")
      },
      phone: {
        type: "string",
        header: "Phone",
        select: false,
        joi: Joi.string()
          .required()
          .label("Phone")
      }
    };
  }
  /**
   * Returns separate the primitive and object types for table
   * @param {array} data data to check
   * @return an object of arrays, useable and unuseable data for table
   */
  _dataCheck(dataSet) {
    //usable and unusable(object) data for table
    let result = {
      dataArr: [],
      links: []
    };
    let obj = {};
    let id = 0;
    let resultObj = {};
    if (Array.isArray(dataSet)) {
      dataSet.map(item => {
        const entries = Object.entries(item);
        for (const [entry, value] of entries) {
          let type = new DataTypeCheck(value);
          if (!type.isNull() && !type.isUndefined() && type.isPrimitive()) {
            obj = { ...obj, [entry]: type.convertData(entry, this.schema) };
          } else if (item[entry].length > 0) {
            let links = {};
            item[entry].map(item => {
              const [ref, link] = Object.values(item);
              if (ref === "self") {
                let num = link.replace(/^\D+/g, "");
                id = Number(num);
              }
              links = { ...links, [ref]: link };
            });
            result.links.push(links);
          }
        }
        resultObj = {
          id,
          data: obj
        };
        result.dataArr.push(resultObj);
      });
    } else {
      console.log(dataSet);
      console.log(typeof dataSet);
    }

    return result;
  }
  getLinks() {
    const data = this._dataCheck(this.dataSet);
    return data.links;
  }
  /**
   * Create table data based on the selected columns
   */
  getTableData() {
    const data = this._dataCheck(this.dataSet);
    const columns = this.selectedColumns;
    let result = [];
    data.dataArr.map(item => {
      const entries = Object.entries(item.data);
      let returnData = {};
      let returnObj = {};
      if (columns === 0 || (Array.isArray(columns) && columns.length === 0)) {
        result.push(item);
      } else {
        for (let key of columns) {
          if (entries[key - 1] !== undefined) {
            const [entry, value] = entries[key - 1];
            returnData = { ...returnData, [entry]: value };
          }
        }
        returnObj = {
          id: item.id,
          data: returnData
        };
        result.push(returnObj);
      }
    });
    return result;
  }
  getSchema() {
    return this.schema;
  }
}
