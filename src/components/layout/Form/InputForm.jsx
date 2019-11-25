import React from "react";
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
    saveButtonDisabled: true,
    selectValue: "Select...."
  };

  componentDidMount() {
    console.log("Form-Mounted");
    const { schema } = this.props;
    this.createJoiSchema(schema);
    this.createDefaultData(schema);
  }

  componentDidUpdate(prevProps, prevState) {
    const { errors } = this.state;
    const { errors: prevErrors } = prevState;
    const { data: prevData } = prevProps;
    const { data, schema } = this.props;

    if (prevErrors !== errors) {
      console.log("FORM-UPDATED");
      this.validate();
    }
    if (prevData !== data) {
      if (Object.entries(data).length === 0) {
        this.createDefaultData(schema);
      } else {
        let dataObj = { ...this.state.data };
        dataObj = { ...dataObj, ...data };
        this.setState({ data: dataObj });
      }
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
  createDefaultData = schema => {
    let data = {};
    Object.keys(schema).map((key, i) => {
      data = {
        ...data,
        [key]: ""
      };
    });
    this.setState({ data });
  };

  doSubmit = () => {
    this.props.saveData(this.state.data);
    this.props.handleVisible();
  };

  render() {
    const { saveButtonDisabled } = this.state;
    const { dataName, schema, open, handleVisible } = this.props;
    return (
      <div style={{ margin: 10 }}>
        <Dialog open={open} onClose={handleVisible} aria-labelledby="form-dialog-title">
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
            <Button onClick={handleVisible} color="secondary">
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
