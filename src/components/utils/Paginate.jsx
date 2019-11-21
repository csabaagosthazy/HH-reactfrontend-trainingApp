import _ from "lodash";

export const paginate = (items, pageNumber, pageSize) => {
  const startIndex = (pageNumber - 1) * pageSize;

  return _(items)
    .slice(startIndex)
    .take(pageSize)
    .value();
};

export const rowsToShow = dataLength => {
  const result = [];
  const minLeap = 5;
  const maxLeap = 50;
  const leap = 10;

  if (dataLength <= minLeap) {
    result.push(dataLength);
  } else if (dataLength <= maxLeap) {
    result.push(minLeap);
    result.push(dataLength);
  } else {
    result.push(minLeap);
    result.push(maxLeap);
  }
  const leapNum = Math.floor(Math.max(...result) / leap);

  for (let i = 1; i <= leapNum; i++) {
    if (i * leap !== Math.max(...result)) {
      result.push(i * leap);
    }
  }
  result.sort((a, b) => a - b);
  return result;
};

export default paginate;
