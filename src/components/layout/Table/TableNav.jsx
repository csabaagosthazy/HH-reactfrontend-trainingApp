import React from "react";
import { tableNavStyle } from "../../styles/TableNavStyle";

import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";

const TableNav = props => {
  const classes = tableNavStyle();
  const { toggleDrawer, onSearch, resetTable } = props;
  return (
    <div style={{ width: "100%" }}>
      <Box display="flex" p={1}>
        <Box flexGrow={1} p={1}>
          <Button
            variant="outlined"
            color="primary"
            className={classes.button}
            onClick={toggleDrawer(true, "filters")}
          >
            Filters
          </Button>
          <Button
            variant="outlined"
            color="primary"
            className={classes.button}
            onClick={toggleDrawer(true, "options")}
          >
            Options
          </Button>
          <Button
            variant="outlined"
            color="primary"
            className={classes.button}
            onClick={resetTable}
          >
            Reset
          </Button>
        </Box>
        <Box p={1}>
          <TextField
            id="standard-basic"
            className={classes.textField}
            label="Search..."
            margin="dense"
            onChange={e => onSearch(e)}
          />
        </Box>
      </Box>
    </div>
  );
};

export default TableNav;
