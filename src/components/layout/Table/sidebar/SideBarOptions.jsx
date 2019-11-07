import React from "react";

import sideBarStyles from "../../../styles/SideBarStyle";

import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import { FormGroup } from "react-bootstrap";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";

const SideBarOptions = props => {
  const classes = sideBarStyles();
  const { toggleDrawer, open, columnSelect, handleChange } = props;
  return (
    <Drawer className={classes.options.root} open={open} onClose={toggleDrawer(false, "options")}>
      <Typography variant="h5">Options</Typography>
      <Divider />
      <FormHelperText>Select columns</FormHelperText>
      <FormControl component="fieldset" className={classes.options.formControl}>
        <FormGroup>
          <Grid container direction="column" justify="center" alignItems="center">
            {Object.keys(columnSelect).map((key, i) => (
              <FormControlLabel
                key={key}
                control={
                  <Checkbox checked={columnSelect[key]} onChange={handleChange(key)} value={key} />
                }
                label={key.charAt(0).toUpperCase() + key.slice(1)}
              />
            ))}
          </Grid>
        </FormGroup>
      </FormControl>
      <Divider />
      <FormHelperText>Click outside to close or press escape</FormHelperText>
    </Drawer>
  );
};

export default SideBarOptions;
