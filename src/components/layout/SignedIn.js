import navStyles from "../styles/NavStyle";

import React from "react";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";

export default function SignedIn() {
  const classes = navStyles();
  return (
    <Toolbar>
      <Button color="inherit">Sign out</Button>
      <Button color="inherit">Profile</Button>
    </Toolbar>
  );
}
