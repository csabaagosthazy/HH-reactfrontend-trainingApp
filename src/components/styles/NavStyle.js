import { makeStyles } from "@material-ui/core/styles";

const navStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    color: "yellow"
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
}));

export default navStyles;
