import React from "react";
import Form from "./Form";

import moment from "moment";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

class EditForm extends Form {
  state = {
    data: {},
    dataId: 0,
    joiSchema: {},
    errors: {},
    isErrorAtField: {},
    saveButtonDisabled: true,
    selectValue: ""
  };

  componentDidMount() {
    console.log("Form-Mounted");
    const { schema } = this.props;
    this.createJoiSchema(schema);
  }

  componentDidUpdate(prevProps, prevState) {
    const { errors } = this.state;
    const { errors: prevErrors } = prevState;

    if (prevErrors !== errors) {
      console.log("FORM-UPDATED");
      this.validate();
    }
    const { data } = this.props;
    const { data: prevData } = prevProps;
    if (prevData !== data && data.data !== undefined) {
      console.log("FORM-UPDATED");
      const changedFormat = this.changeDateFormat(data.data);
      this.setState({ data: changedFormat, dataId: data.id, selectValue: data.data.customer });
    }
  }
  changeDateFormat = data => {
    let obj = {};
    Object.entries(data).map(entry => {
      const [key, value] = entry;
      if (key === "date") {
        obj = { ...obj, [key]: moment(value).format("YYYY-MM-DDTHH:MM") };
      } else {
        obj = { ...obj, [key]: value };
      }
    });
    return obj;
  };

  createJoiSchema = schema => {
    let joiSchema = {};
    Object.keys(schema).map((key, i) => {
      joiSchema = {
        ...joiSchema,
        [key]: schema[key].joi
      };
    });
    this.setState({ joiSchema });
  };

  doSubmit = () => {
    this.props.handleEditItem(this.state.dataId, this.state.data);
    this.props.handleEditClose();
  };

  render() {
    const { saveButtonDisabled } = this.state;
    const { dataName, schema, open, handleEditClose } = this.props;
    return (
      <div style={{ margin: 10 }}>
        <Dialog open={open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">{dataName}</DialogTitle>
          <DialogContent>
            <DialogContentText>Fill information here</DialogContentText>
            {Object.keys(schema).map((key, i) =>
              this.renderTextfield(
                key,
                schema[key].header,
                schema[key].type,
                schema[key].select,
                schema[key].data
              )
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose} color="secondary">
              Cancel
            </Button>
            <Button disabled={saveButtonDisabled} onClick={this.handleSubmit} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default EditForm;
