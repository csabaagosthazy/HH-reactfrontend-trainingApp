class ScheduleData {
  constructor(dataSet) {
    this.dataSet = dataSet;
  }
  createData = () => {
    const data = this.dataSet;
    let result = [];
    data.map(item => {
      let obj = {};
      let id = item.id;

      let name = `type: ${item.activity} name: ${item.customer.firstname} ${item.customer.lastname}`;
      let date = new Date(item.date);
      let startDateTime = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes()
      );
      let endDateTime = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes() + item.duration
      );

      let classes = "";
      switch (true) {
        case 0 <= item.duration && item.duration < 20:
          classes = "color-1";
          break;
        case 20 <= item.duration && item.duration < 40:
          classes = "color-4";
          break;
        case 40 <= item.duration && item.duration < 60:
          classes = "color-2";
          break;
        case 60 <= item.duration && item.duration < 80:
          classes = "color-5";
          break;
        case 80 <= item.duration:
          classes = "color-3";
          break;
      }

      obj = {
        ...obj,
        ...{ _id: id, name, startDateTime, endDateTime, classes }
      };

      result.push(obj);
    });

    return result;
  };
}

export default ScheduleData;
