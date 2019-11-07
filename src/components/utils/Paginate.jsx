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
  const leapNum = Math.floor(dataLength / leap);

  for (let i = 0; i < leapNum; i++) {
    if (i * leap < minLeap) {
      result.push(minLeap);
    } else {
      result.push(i * leap);
    }
  }
  if (dataLength >= maxLeap) result.push(maxLeap);
  else result.push(dataLength);

  return result;
};

export default paginate;
