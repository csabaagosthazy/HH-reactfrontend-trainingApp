import React, { Component } from "react";
import Table from "../layout/Table/Table";

class Customers extends Component {
  state = {
    selectedColumns: [], // select visible columns (column numbers)
    dataName: "Customers",
    link: "https://customerrest.herokuapp.com/api/customers  ",
    sublink: "content"
  };

  componentDidMount() {
    // fetch data and update state
    console.log("Customers_mounted");
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

export default Customers;
