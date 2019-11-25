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
    input:
        date (Date), format: yyyy-m-d
        duration in minutes (int)
        activity (String)
        Customer (customer.id)

    get customer:
    /trainings/{id}/customer

    For crud methods:
    update: /trainings/{id} endpoint '_links.self.href'
    delete: /trainings/{id}  endpoint 

*/

import DataTypeCheck from "./DataTypeCheck";
import Joi from "joi-browser";

export default class TrainingData {
  constructor(trainingsDataSet, customersDataSet, trainingsCustomersData, selectedColumns = 0) {
    this.trainingsDataSet = trainingsDataSet;
    this.customersDataSet = customersDataSet;
    this.trainingsCustomersData = trainingsCustomersData;
    this.selectedColumns = selectedColumns;
    this.schema = {
      date: {
        type: "datetime-local",
        header: "Date",
        select: false,
        joi: Joi.date()
          .required()
          .label("Date"),
        formatIn: "YYYY-MM-DDTHH:mm:ss.SSSSZ",
        formatOut: "YYYY.MM.DD hh:mm"
      },
      duration: {
        type: "number",
        header: "Duration",
        select: false,
        joi: Joi.number()
          .required()
          .label("Duration")
      },
      activity: {
        type: "string",
        header: "Activity",
        select: false,
        joi: Joi.string()
          .required()
          .label("Activity")
      },
      customer: {
        type: "string",
        header: "Customer",
        select: true,
        joi: Joi.number()
          .required()
          .label("Customer"),
        data: this.getCustomersData()
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
          if (!type.isNull() && !type.isUndefined()) {
            if (type.isPrimitive()) {
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
          const customer = this.getTrainingCustomer(id);
          obj = { ...obj, customer };
          resultObj = {
            id,
            data: obj
          };
        }
        result.dataArr.push(resultObj);
      });
    } else {
      console.log(dataSet);
      console.log(typeof dataSet);
    }
    this.getCustomersData();
    return result;
  }

  getTrainingCustomer(trainingId) {
    const data = this.trainingsCustomersData;
    let result = "";
    data.map(training => {
      if (training.id === trainingId) {
        result = `${training.customer.firstname} ${training.customer.lastname}`;
      }
    });
    return result;
  }
  getCustomersData() {
    const data = this.customersDataSet;
    let result = [];
    data.map(customer => {
      const name = `${customer.firstname} ${customer.lastname}`;
      let id = 0;
      customer.links.map(item => {
        const [ref, link] = Object.values(item);
        if (ref === "self") {
          let num = link.replace(/^\D+/g, "");
          id = Number(num);
        }
      });
      result.push({ name, id });
    });
    return result;
  }
  getLinks() {
    const data = this._dataCheck(this.trainingsDataSet);
    return data.links;
  }
  /**
   * Create table data based on the selected columns
   */
  getTableData() {
    const data = this._dataCheck(this.trainingsDataSet);
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
