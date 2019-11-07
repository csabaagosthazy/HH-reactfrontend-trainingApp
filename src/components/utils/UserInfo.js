import React from "react";
import Snackbar from "@material-ui/core/Snackbar";

const SnackBarUse = (open = false, message, duration = 3000) => {
  return <Snackbar open={open} autoHideDuration={duration} message={message} />;
};

export default SnackBarUse;
