import React from "react";

import sideBarStyles from "../../../styles/SideBarStyle";

import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import FormHelperText from "@material-ui/core/FormHelperText";

const SideBarFilters = props => {
  const classes = sideBarStyles();
  const { toggleDrawer, open, handleFilter, headers, keys, data, filters } = props;
  return (
    <Drawer className={classes.filters.root} open={open} onClose={toggleDrawer(false, "filters")}>
      <Typography variant="h5">Filters</Typography>
      <Divider />
      {data.map((select, i) => (
        <FormControl key={headers[i]} className={classes.filters.formControl}>
          <InputLabel id={keys[i]}>{headers[i]}</InputLabel>
          <Select
            id={keys[i]}
            name={keys[i]}
            value={filters[keys[i]]}
            onChange={e => handleFilter(e)}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {select.map((item, j) => (
              <MenuItem key={i * 10 + j} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ))}
      <Divider />
      <FormHelperText>Click outside to close or press escape</FormHelperText>
    </Drawer>
  );
};

export default SideBarFilters;
