import { makeStyles } from "@material-ui/core/styles";

export const sideBarStyles = makeStyles(theme => ({
  filters: {
    root: {
      width: 250
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120
    }
  },

  options: {
    root: {
      display: "flex"
    },

    formControl: {
      margin: theme.spacing(3)
    }
  }
}));

export default sideBarStyles;
