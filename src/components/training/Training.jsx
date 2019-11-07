import React, { Component } from "react";
import Table from "../layout/Table/Table";

class Trainings extends Component {
  state = {
    selectedColumns: [], // select visible columns (column numbers)
    dataName: "Trainings",
    link: "https://customerrest.herokuapp.com/api/trainings ",
    sublink: "content"
  };

  componentDidMount() {
    // fetch data and update state
    console.log("Trainings_mounted");
  }

  render() {
    const { link, sublink, selectedColumns, dataName } = this.state;
    return (
      <div>
        <Table
          link={link}
          sublink={sublink}
          selectedColumns={selectedColumns}
          dataName={dataName}
        />
      </div>
    );
  }
}

export default Trainings;
