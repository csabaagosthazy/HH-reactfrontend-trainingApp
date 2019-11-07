import navStyles from "../styles/NavStyle";

import React from "react";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";

export default function SignedOut() {
  const classes = navStyles();
  return (
    <Toolbar>
      <Button color="inherit" href="/signin">
        Sign in
      </Button>
      <Button color="inherit" href="/signup">
        Sign up
      </Button>
    </Toolbar>
  );
}
