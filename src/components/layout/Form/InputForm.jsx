import React, { Component } from "react";
import Form from "./Form";

import Button from "@material-ui/core/Button";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

class InputForm extends Form {
  state = {
    data: {},
    joiSchema: {},
    errors: {},
    isErrorAtField: {},
    open: false,
    saveButtonDisabled: true,
    selectValue: "Select...."
  };

  componentDidMount() {
    console.log("Form-Mounted");
  }

  componentDidUpdate(prevProps, prevState) {
    const { errors } = this.state;
    const { errors: prevErrors } = prevState;

    if (prevErrors !== errors) {
      console.log("FORM-UPDATED");
      this.validate();
    }
    const { keys, headers, schema } = this.props;
    const { keys: prevKeys } = prevProps;
    if (prevKeys !== keys) {
      console.log("FORM-UPDATED");
      this.createJoiSchema(schema);
    }
  }

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
    this.props.saveData(this.state.data);
    this.handleClose();
  };

  render() {
    const { open, saveButtonDisabled } = this.state;
    const { dataName, schema } = this.props;
    return (
      <div style={{ margin: 10 }}>
        <Button
          style={{ float: "right", margin: "2em" }}
          variant="contained"
          color="primary"
          onClick={this.handleOpen}
        >
          Add new
        </Button>
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
            <Button onClick={this.handleClose} color="secondary">
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

export default InputForm;
