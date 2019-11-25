import React from "react";
import { Link } from "react-router-dom";

import navStyles from "../../styles/NavStyle";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import MenuIcon from "@material-ui/icons/Menu";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

export default function NavBar() {
  const classes = navStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              aria-controls="simple-menu"
              aria-haspopup="true"
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
              onClick={handleClick}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>
                <Link to="/customers">Customers</Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link to="/trainings">Trainings</Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link to="/">Home</Link>
              </MenuItem>
            </Menu>
            <Typography variant="h6" className={classes.title}>
              Training App
            </Typography>
            <Button color="inherit">Login</Button>
          </Toolbar>
        </AppBar>
      </div>
    </div>
  );
}
