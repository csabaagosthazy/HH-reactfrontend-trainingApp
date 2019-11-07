import { makeStyles } from "@material-ui/core/styles";

export const tableNavStyle = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  },

  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 100
  }
}));

export default tableNavStyle;
