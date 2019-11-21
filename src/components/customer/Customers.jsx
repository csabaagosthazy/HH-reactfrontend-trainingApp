import React, { Component } from "react";
import Table from "../layout/Table/Table";
import CustomersData from "../utils/Data/CustomersData";
import { getDataSet, postData, deleteData, updateData, getData } from "../utils/Database.utils";

import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";

class Customers extends Component {
  state = {
    selectedColumns: [], // select visible columns (column numbers)
    dataName: "Customers",
    link: "https://customerrest.herokuapp.com/api/customers",
    sublink: "content",
    data: {},
    isLoading: true,
    customer: {},
    snackBarOpen: false,
    message: ""
  };

  async componentDidMount() {
    // fetch data and update state
    console.log("Customers-mounted");
    const { link, sublink } = this.state;
    await getDataSet(link, sublink).then(res => {
      this.setState({
        data: res.data,
        isLoading: res.isLoading
      });
    });
  }

  //database functions
  fetchDataSet = () => {
    const { link, sublink, dataName } = this.state;
    // fetch data and update state
    getDataSet(link, sublink).then(res => {
      console.log(res.data);
      this.setState({
        data: res.data,
        dataName,
        isLoading: res.isLoading
      });
    });
  };

  saveData = async data => {
    const { link } = this.state;
    console.log(data);
    await postData(link, data).then(res => {
      if (res.status === 201) {
        this.setState({
          snackBarOpen: true,
          message: `${data.firstname} ${data.lastname} saved successfully`
        });
      } else {
        this.setState({
          snackBarOpen: true,
          message: `${data.firstname} ${data.lastname} couldn't be saved`
        });
      }
    });
    this.fetchDataSet();
  };
  deleteItem = async id => {
    if (window.confirm("Are you sure?")) {
      console.log("delete", id);
      const deleteLink = `${this.state.link}/${id}`;
      await deleteData(deleteLink).then(res => {
        if (res.status === 204) {
          this.setState({
            snackBarOpen: true,
            message: `Customer deleted`
          });
        } else {
          this.setState({
            snackBarOpen: true,
            message: `Customer couldn't be deleted`
          });
        }
      });
      this.fetchDataSet();
    }
  };
  editItem = async (id, data) => {
    const link = `${this.state.link}/${id}`;
    console.log("edit", link);
    await updateData(link, data).then(res => {
      if (res.status === 200) {
        this.setState({
          snackBarOpen: true,
          message: `${data.firstname} ${data.lastname} modified successfully`
        });
      } else {
        this.setState({
          snackBarOpen: true,
          message: `${data.firstname} ${data.lastname} couldn't be modified`
        });
      }
    });
    this.fetchDataSet();
  };
  handleSnackClose = () => {
    this.setState({ snackBarOpen: false });
  };

  render() {
    const { data, isLoading, dataName, selectedColumns, snackBarOpen, message } = this.state;
    const table = new CustomersData(data, selectedColumns);
    const tableData = table.getTableData();
    const dataSchema = table.getSchema();
    if (isLoading) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh"
          }}
        >
          <CircularProgress />
        </div>
      );
    }
    if (data.length === 0) return <p>There are no {dataName} in the database} </p>;
    return (
      <div>
        <Table
          data={tableData}
          schema={dataSchema}
          dataName={dataName}
          handleSave={this.saveData}
          handleDelete={this.deleteItem}
          handleEditItem={this.editItem}
        />
        <Snackbar
          open={snackBarOpen}
          autoHideDuration={3000}
          onClose={this.handleSnackClose}
          message={message}
        />
      </div>
    );
  }
}

export default Customers;
