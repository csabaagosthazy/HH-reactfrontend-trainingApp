import React, { Component } from "react";
import Joi from "joi-browser";

import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import moment from "moment";

class Form extends Component {
  //gets keys,headers, open from props
  state = {
    joiSchema: {},
    errors: {},
    isErrorAtField: {},
    saveButtonDisabled: true,
    selectValue: ""
  };

  validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.state.data, this.state.joiSchema, options);
    if (!error) {
      this.setState({ saveButtonDisabled: false });
      return null;
    }

    const errors = {};

    for (let item of error.details) errors[item.path[0]] = item.message;
    this.setState({ saveButtonDisabled: true });
    return errors;
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const joiSchema = { [name]: this.state.joiSchema[name] };
    const { error } = Joi.validate(obj, joiSchema);
    if (error) {
      this.setState({ isErrorAtField: { [name]: true } });
      return error.details[0].message;
    } else {
      this.setState({ isErrorAtField: { [name]: false } });
      return null;
    }
  };

  handleSubmit = e => {
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    this.doSubmit();
  };

  handleInputChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    let data = { ...this.state.data };
    data[input.name] = input.value;

    this.setState({ data, errors });
  };

  handleSelectChange = ({ target: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...this.state.data };
    data[input.name] = input.value;

    this.setState({ selectValue: input.value });
    this.setState({ data, errors });
  };

  renderTextfield = (name, label, inputType = "text", select = false, options = []) => {
    const { data } = this.state;
    if (!select) {
      return (
        <TextField
          InputLabelProps={{ shrink: true }}
          key={name}
          error={this.state.isErrorAtField[name]}
          margin="dense"
          type={inputType}
          name={name}
          value={data !== undefined ? data[name] : ""}
          onChange={this.handleInputChange}
          label={label}
          helperText={this.state.errors[name]}
          fullWidth
        />
      );
    } else {
      return (
        <TextField
          key={name}
          error={this.state.isErrorAtField[name]}
          margin="dense"
          select
          value={this.state.selectValue}
          type={inputType}
          name={name}
          onChange={this.handleSelectChange}
          label={label}
          helperText={this.state.errors[name]}
          fullWidth
        >
          {options.map(option => (
            <MenuItem key={option.id} value={option.id}>
              {option.name}
            </MenuItem>
          ))}
        </TextField>
      );
    }
  };
}

export default Form;
