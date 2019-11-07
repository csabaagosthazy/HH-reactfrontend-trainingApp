//General database utils
// link contains id if it is necessary

import TableData from "./Data/TableData";
import React, { useState } from "react";
import axios from "axios";
import validate from "react-joi-validation";

//Validate data for put and post method

// Fetching data, get method
/**
 * Get dataset from the database
 * @param {String} link given main link to api call
 * @param {String} sublink sublink in case of reuse
 * @param {Boolean} autofilter true: returns only primitive values from the data rows
 *    false: returns all values
 * @param {Array.<number>} selectedColumns selected columns from database,
 *    ignored if autofilter is true
 *    if 0 return all data
 *
 * @return filtered array of objects based on the given parameters
 */
export const getDataSet = async (link, sublink, autofilter = true, selectedColumns = []) => {
  let result = {
    data: [],
    isLoading: true
  };
  try {
    await axios.get(link).then(res => {
      result.data = res.data[sublink];
      result.isLoading = false;
    });
  } catch (e) {
    console.log(e);
  }

  return result;
};

// Get data and return object keys

export const getDataKeys = data => {
  console.log(data);
};

// Get 1 particular data by id

export const getData = async link => {
  const response = await axios.get(link);
};

// Create new data, post method

export const postData = async (link, data) => {
  const response = await axios.post(link, data);
  console.log(response);
};

// Modify data by id, put method

export const updateData = async (link, data) => {
  const response = await axios.put(link, data);
  console.log(response);
};

export const deleteData = async link => {
  try {
    const response = await axios.delete(link);
    console.log(response);
  } catch (e) {
    console.log(e);
  }
};
