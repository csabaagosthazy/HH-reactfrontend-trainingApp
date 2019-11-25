export const sort = (data, path, order) => {
  const result = [];
  const simpleData = [];
  data.map(item => {
    let obj = {};
    obj = { ...obj, id: item.id, ...item.data };
    simpleData.push(obj);
  });
  if (simpleData.length > 0) {
    let dataSet = simpleData;
    if (typeof simpleData[0][path] === "string") {
      let dataSet = simpleData;
      dataSet.sort((a, b) => {
        let string1 = a[path].toUpperCase();
        let string2 = b[path].toUpperCase();
        if (string1 < string2) {
          return -1;
        }
        if (string1 > string2) {
          return 1;
        }
        return 0;
      });
    } else if (typeof simpleData[0][path] === "date") {
      dataSet.sort((a, b) => new Date([path]) - new Date(b[path]));
    } else {
      dataSet.sort((a, b) => a[path] - b[path]);
    }
    if (order === "desc") {
      dataSet.reverse();
    }
  }
  simpleData.map(item => {
    let id = item.id;
    let resultObj = {
      id,
      data: item
    };

    delete resultObj.data.id;
    result.push(resultObj);
  });
  return result;
};

export default sort;
