//General database utils
// link contains id if it is necessary

// Fetching data, get method
/**
 * Get dataset from the database
 * @param {String} link given main link to api call
 * @param {String} sublink sublink in case of reuse
 *
 * @return filtered array of objects based on the given parameters
 */
export const getDataSet = async (link, sublink) => {
  let result = {
    data: [],
    isLoading: true
  };
  await fetch(link)
    .then(response => response.json())
    .then(data => {
      if (sublink !== undefined) {
        result.data = data[sublink];
      } else {
        result.data = data;
      }
      result.isLoading = false;
    })
    .catch(err => console.error(err));

  return result;
};

// Get 1 particular data by id

export const getData = async link => {
  let result = {
    data: [],
    isLoading: true
  };

  await fetch(link)
    .then(response => response.json())
    .then(data => {
      result.data = data;
      result.isLoading = false;
    })
    .catch(err => console.error(err));
  console.log(result);
  return result;
};

// Create new data, post method

export const postData = async (link, data) => {
  let result;
  await fetch(link, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(res => (result = res))
    .catch(err => console.error(err));

  return result;
};

// Modify data by id, put method

export const updateData = async (link, data) => {
  const jString = JSON.stringify(data);
  console.log(data);
  let result;
  await fetch(link, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: jString
  })
    .then(res => (result = res))
    .catch(err => console.error(err));
  return result;
};

export const deleteData = async link => {
  let result;
  await fetch(link, { method: "DELETE" })
    .then(res => (result = res))
    .catch(err => console.error(err));
  return result;
};
