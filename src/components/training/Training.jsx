import React, { Component } from "react";
import moment from "moment";
import Table from "../layout/Table/Table";
import { getDataSet, postData, deleteData, updateData } from "../utils/Database.utils";
import TrainingsData from "../utils/Data/TrainingsData";
import Schedule from "../layout/Schedule/Schedule";
import ScheduleData from "../utils/Data/ScheduleData";

import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";

import Nav from "react-bootstrap/Nav";
import TabContainer from "react-bootstrap/TabContainer";
import TabContent from "react-bootstrap/TabContent";
import TabPane from "react-bootstrap/TabPane";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ScrollArea from "react-scrollbar";

class Trainings extends Component {
  _isMounted = false;
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

  componentDidMount() {
    this._isMounted = true;
    // fetch data and update state
    console.log("Trainings-mounted");
    this.fetchDataSet();
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  //database functions
  fetchDataSet = async () => {
    if (this._isMounted) {
      const { trainingsLink, customersLink, trainingsCustomersLink, sublink } = this.state;
      // fetch data and update state
      await getDataSet(trainingsLink, sublink).then(res => {
        if (this._isMounted) {
          this.setState({
            trainingsData: res.data,
            trainingIsLoading: res.isLoading
          });
        }
      });
      await getDataSet(customersLink, sublink).then(res => {
        if (this._isMounted) {
          this.setState({
            customersData: res.data,
            customerIsLoading: res.isLoading
          });
        }
      });
      await getDataSet(trainingsCustomersLink).then(res => {
        if (this._isMounted) {
          this.setState({
            trainingsCustomersData: res.data,
            trainingsCustomersisLoading: res.isLoading
          });
        }
      });
    }
  };

  saveData = async ({ activity, customer: id, date, duration }) => {
    const { trainingsLink } = this.state;
    const saveObj = {
      activity,
      date: moment(date).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
      duration,
      customer: `${this.state.customersLink}/${id}`
    };
    await postData(trainingsLink, saveObj).then(res => {
      if (res.status === 201) {
        if (this._isMounted) {
          this.setState({
            snackBarOpen: true,
            message: `${activity} at ${date} saved successfully`
          });
        }
      } else {
        if (this._isMounted) {
          this.setState({
            snackBarOpen: true,
            message: `${activity} at ${date} couldn't be saved`
          });
        }
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
          if (this._isMounted) {
            this.setState({
              snackBarOpen: true,
              message: `Training deleted`
            });
          }
        } else {
          if (this._isMounted) {
            this.setState({
              snackBarOpen: true,
              message: `Training couldn't be deleted`
            });
          }
        }
      });
      this.fetchDataSet();
    }
  };
  editItem = async (trainingId, { activity, customer: customerId, date, duration }) => {
    const link = `${this.state.trainingsLink}/${trainingId}`;
    const data = {
      activity,
      date: moment(date).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
      duration,
      customer: `${this.state.customersLink}/${customerId}`
    };
    await updateData(link, data).then(res => {
      if (res.status === 200) {
        if (this._isMounted) {
          this.setState({
            snackBarOpen: true,
            message: `${activity} at ${date} modified successfully`
          });
        }
      } else {
        if (this._isMounted) {
          this.setState({
            snackBarOpen: true,
            message: `${activity} at ${date} couldn't be modified`
          });
        }
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
    let table, tableData, dataSchema, schedule, scheduleData;
    if (!trainingIsLoading && !customerIsLoading && !trainingsCustomersisLoading) {
      table = new TrainingsData(
        trainingsData,
        customersData,
        trainingsCustomersData,
        selectedColumns
      );

      tableData = table.getTableData();
      dataSchema = table.getSchema();

      schedule = new ScheduleData(trainingsCustomersData);
      scheduleData = schedule.createData();
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
      <div style={{ margin: "10px" }}>
        <ScrollArea>
          <TabContainer id="left-tabs-example" defaultActiveKey="first">
            <Row>
              <Col sm={2}>
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link eventKey="first">Trainings</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="second">Schedule</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
              <Col sm={10}>
                <TabContent>
                  <TabPane eventKey="first">
                    <Table
                      data={tableData}
                      schema={dataSchema}
                      dataName={dataName}
                      handleSave={this.saveData}
                      handleDelete={this.deleteItem}
                      handleEditItem={this.editItem}
                    />
                  </TabPane>
                  <TabPane eventKey="second">
                    <Schedule
                      data={scheduleData}
                      dataName={dataName}
                      schema={dataSchema}
                      trainingsData={trainingsCustomersData}
                      editItem={this.editItem}
                      saveItem={this.saveData}
                      deleteItem={this.deleteItem}
                    />
                  </TabPane>
                </TabContent>
              </Col>
            </Row>
          </TabContainer>
        </ScrollArea>
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
