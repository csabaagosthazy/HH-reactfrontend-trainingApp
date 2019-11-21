import React, { Component } from "react";
import Table from "../layout/Table/Table";
import { getDataSet, postData, deleteData, updateData } from "../utils/Database.utils";
import TrainingsData from "../utils/Data/TrainingsData";

import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";

class Trainings extends Component {
  state = {
    selectedColumns: [], // select visible columns (column numbers)
    dataName: "Trainings",
    trainingsLink: "https://customerrest.herokuapp.com/api/trainings",
    customersLink: "https://customerrest.herokuapp.com/api/customers",
    sublink: "content",
    trainingsCustomersLink: "https://customerrest.herokuapp.com/gettrainings",
    trainingsData: {},
    customersData: {},
    trainingsCustomersData: {},
    trainingIsLoading: true,
    customerIsLoading: true,
    trainingsCustomersisLoading: true,
    snackBarOpen: false,
    message: ""
  };

  async componentDidMount() {
    // fetch data and update state
    console.log("Trainings-mounted");
    const { trainingsLink, customersLink, trainingsCustomersLink, sublink } = this.state;
    await getDataSet(trainingsLink, sublink).then(res => {
      this.setState({
        trainingsData: res.data,
        trainingIsLoading: res.isLoading
      });
    });
    await getDataSet(customersLink, sublink).then(res => {
      console.log(res.data);
      this.setState({
        customersData: res.data,
        customerIsLoading: res.isLoading
      });
    });
    await getDataSet(trainingsCustomersLink).then(res => {
      console.log(res.data);
      this.setState({
        trainingsCustomersData: res.data,
        trainingsCustomersisLoading: res.isLoading
      });
    });
  }
  //database functions
  fetchDataSet = async () => {
    const { trainingsLink, customersLink, trainingsCustomersLink, sublink, dataName } = this.state;
    // fetch data and update state
    await getDataSet(trainingsLink, sublink).then(res => {
      console.log(res.data);
      this.setState({
        trainingsData: res.data,
        dataName,
        trainingIsLoading: res.isLoading
      });
    });
    await getDataSet(customersLink, sublink).then(res => {
      console.log(res.data);
      this.setState({
        customersData: res.data,
        customerIsLoading: res.isLoading
      });
    });
    await getDataSet(trainingsCustomersLink).then(res => {
      console.log(res.data);
      this.setState({
        trainingsCustomersData: res.data,
        trainingsCustomersisLoading: res.isLoading
      });
    });
  };

  saveData = async ({ activity, customer: id, date, duration }) => {
    const { trainingsLink } = this.state;
    const saveObj = {
      activity,
      date,
      duration,
      customer: `${this.state.customersLink}/${id}`
    };
    await postData(trainingsLink, saveObj).then(res => {
      if (res.status === 201) {
        this.setState({
          snackBarOpen: true,
          message: `${activity} at ${date} saved successfully`
        });
      } else {
        this.setState({
          snackBarOpen: true,
          message: `${activity} at ${date} couldn't be saved`
        });
      }
    });
    this.fetchDataSet();
  };
  deleteItem = async id => {
    if (window.confirm("Are you sure?")) {
      console.log("delete", id);
      const deleteLink = `${this.state.trainingsLink}/${id}`;
      await deleteData(deleteLink).then(res => {
        if (res.status === 204) {
          this.setState({
            snackBarOpen: true,
            message: `Training deleted`
          });
        } else {
          this.setState({
            snackBarOpen: true,
            message: `Training couldn't be deleted`
          });
        }
      });
      this.fetchDataSet();
    }
  };
  editItem = async (trainingId, { activity, customer: customerId, date, duration }) => {
    const link = `${this.state.trainingsLink}/${trainingId}`;
    const data = {
      activity,
      date,
      duration,
      customer: `${this.state.customersLink}/${customerId}`
    };
    await updateData(link, data).then(res => {
      if (res.status === 200) {
        this.setState({
          snackBarOpen: true,
          message: `${activity} at ${date} modified successfully`
        });
      } else {
        this.setState({
          snackBarOpen: true,
          message: `${activity} at ${date} couldn't be modified`
        });
      }
    });
    this.fetchDataSet();
  };
  handleSnackClose = () => {
    this.setState({ snackBarOpen: false });
  };

  render() {
    const {
      trainingsData,
      customersData,
      trainingsCustomersData,
      trainingIsLoading,
      customerIsLoading,
      trainingsCustomersisLoading,
      dataName,
      selectedColumns,
      snackBarOpen,
      message
    } = this.state;
    let table, tableData, dataSchema;
    if (!trainingIsLoading && !customerIsLoading && !trainingsCustomersisLoading) {
      table = new TrainingsData(
        trainingsData,
        customersData,
        trainingsCustomersData,
        selectedColumns
      );

      tableData = table.getTableData();
      dataSchema = table.getSchema();
    }
    if (trainingIsLoading || customerIsLoading || trainingsCustomersisLoading) {
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
    if (trainingsData.length === 0) return <p>There are no {dataName} in the database} </p>;

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

export default Trainings;
