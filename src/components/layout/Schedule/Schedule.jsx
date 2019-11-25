import React, { Component } from "react";
import "../../styles/Schedule.css";

import InputForm from "../Form/InputForm";
import EditForm from "../Form/EditForm";

import moment from "moment";
import {
  ReactAgenda,
  ReactAgendaCtrl,
  guid,
  getUnique,
  getLast,
  getFirst,
  Modal
} from "react-agenda";

var now = new Date();

var colors = {
  "color-1": "rgba(102, 195, 131 , 1)",
  "color-2": "rgba(242, 177, 52, 1)",
  "color-3": "rgba(235, 85, 59, 1)",
  "color-4": "rgba(70, 159, 213, 1)",
  "color-5": "rgba(170, 59, 123, 1)"
};

export default class Schedule extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      items: [],
      selected: [],
      cellHeight: 60 / 4,
      showModal: false,
      locale: "en",
      rowsPerHour: 4,
      numberOfDays: 4,
      startDate: new Date(),
      addFormOpen: false,
      addFormData: {},
      editFormOpen: false,
      editFormData: {}
    };
    this.zoomIn = this.zoomIn.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
    this.handleEditClose = this.handleEditClose.bind(this);
    this.handleItemEdit = this.handleItemEdit.bind(this);
    this.handleItemSize = this.handleItemSize.bind(this);
    this.handleCellSelection = this.handleCellSelection.bind(this);
    this.handleRangeSelection = this.handleRangeSelection.bind(this);
    this.addNewEvent = this.addNewEvent.bind(this);
    this.removeEvent = this.removeEvent.bind(this);
    this.changeView = this.changeView.bind(this);
    this.handleEditClose = this.handleEditClose.bind(this);
  }

  componentDidMount() {
    console.log("SCHEDULE-MOUNTED");
    this._isMounted = true;
    this.setState({ items: this.props.data });
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("SCHEDULE-UPDATED");
    const { data } = this.props;
    const { items } = this.state;
    if (data !== items) {
      if (this._isMounted) this.setState({ items: data });
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  zoomIn() {
    var num = this.state.cellHeight + 15;
    this.setState({ cellHeight: num });
  }
  zoomOut() {
    var num = this.state.cellHeight - 15;
    this.setState({ cellHeight: num });
  }

  handleEditClose() {
    this.setState({ editFormOpen: false });
  }
  handleItemEdit(item) {
    if (item) {
      const formItem = this.props.trainingsData.filter(i => i.id === item._id);
      const { id, date, activity, duration, customer: c } = formItem[0];

      let dataObj = {
        id,
        data: { date, activity, duration, customer: c.id }
      };
      this.setState({ selected: [item], editFormData: dataObj, editFormOpen: true });
    }
  }
  handleCellSelection(item, openModal) {
    if (this.state.selected && this.state.selected[0] === item) {
      this.setState({ addFormOpen: true, addFormData: { date: item } });
    }
    this.setState({ selected: [item] });
  }

  handleDateRangeChange(startDate) {
    this.setState({ startDate: startDate });
  }

  handleRangeSelection(selected) {
    const [startTime, endTime] = selected;
    let diffMs = new Date(endTime) - new Date(startTime);
    let diffMins = Math.round(diffMs / 60000);
    this.setState({ selected: selected, showCtrl: true });
    this.setState({ addFormOpen: true, addFormData: { date: startTime, duration: diffMins } });
  }

  handleItemChange(items, item) {
    console.log("handleItemChange", item, items);
  }

  handleItemSize(items, item) {
    console.log("handleItemSize", items, this.state.data);
  }

  removeEvent(items, item) {
    this.props.deleteItem(item._id);
  }

  addNewEvent() {
    this.setState({ addFormOpen: true });
  }

  changeView(days, event) {
    this.setState({ numberOfDays: days });
  }
  handleAddFormVisible = e => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const { addFormOpen } = this.state;
    if (addFormOpen) {
      this.setState({ addFormData: {}, selected: [], showCtrl: false, startDate: new Date() });
    }
    this.setState({ addFormOpen: !addFormOpen });
  };

  render() {
    var AgendaItem = function(props) {
      console.log(" item component props", props);
      return (
        <div style={{ display: "block", position: "absolute", background: "#FFF" }}>
          {props.item.name} <button onClick={() => props.edit(props.item)}>Edit </button>
        </div>
      );
    };
    const { dataName, schema, editItem, saveItem } = this.props;
    const { editFormOpen, editFormData, addFormOpen, addFormData } = this.state;
    return (
      <div className="content-expanded ">
        <div className="control-buttons">
          <button className="button-control" onClick={this.zoomIn}>
            {" "}
            <i className="zoom-plus-icon"></i>{" "}
          </button>
          <button className="button-control" onClick={this.zoomOut}>
            {" "}
            <i className="zoom-minus-icon"></i>{" "}
          </button>
          <button className="button-control" onClick={this.addNewEvent}>
            {" "}
            <i className="schedule-icon"></i>{" "}
          </button>
          <button className="button-control" onClick={this.changeView.bind(null, 30)}>
            {"Monthly"}
          </button>
          <button className="button-control" onClick={this.changeView.bind(null, 7)}>
            {"Weekly"}
          </button>
          <button className="button-control" onClick={this.changeView.bind(null, 1)}>
            {"Daily"}
          </button>
        </div>

        <ReactAgenda
          minDate={new Date(now.getFullYear(), now.getMonth() - 3)}
          maxDate={new Date(now.getFullYear(), now.getMonth() + 3)}
          startDate={this.state.startDate}
          startAtTime={0}
          endAtTime={24}
          cellHeight={this.state.cellHeight}
          locale={this.state.locale}
          items={this.state.items}
          numberOfDays={this.state.numberOfDays}
          headFormat={"ddd DD MMM"}
          rowsPerHour={this.state.rowsPerHour}
          itemColors={colors}
          helper={true}
          //itemComponent={AgendaItem}
          view="calendar"
          autoScale={false}
          fixedHeader={true}
          onRangeSelection={this.handleRangeSelection.bind(this)}
          onChangeEvent={this.handleItemChange.bind(this)}
          onChangeDuration={this.handleItemSize.bind(this)}
          onItemEdit={this.handleItemEdit.bind(this)}
          onCellSelect={this.handleCellSelection.bind(this)}
          onItemRemove={this.removeEvent.bind(this)}
          onDateRangeChange={this.handleDateRangeChange.bind(this)}
        />
        <EditForm
          dataName={dataName}
          schema={schema}
          open={editFormOpen}
          data={editFormData}
          handleEditClose={this.handleEditClose}
          handleEditItem={editItem}
        />
        <InputForm
          dataName={dataName}
          schema={schema}
          open={addFormOpen}
          data={addFormData}
          saveData={saveItem}
          handleVisible={this.handleAddFormVisible}
        />
        {/*         {this.state.showModal ? (
          <Modal clickOutside={this._closeModal}>
            <div className="modal-content">
              <ReactAgendaCtrl
                items={this.state.items}
                itemColors={colors}
                selectedCells={this.state.selected}
                Addnew={this.addNewEvent}
                edit={this.editEvent}
              />
            </div>
          </Modal>
        ) : (
          ""
        )} */}
      </div>
    );
  }
}
