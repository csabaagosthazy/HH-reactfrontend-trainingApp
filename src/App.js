import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import NavBar from "./components/layout/NavBar/Navbar";
import SignIn from "./components/auth/Signin";
import SignUp from "./components/auth/SignUp";
import Customers from "./components/customer/Customers";
import Trainings from "./components/training/Training";

const apiLink = "https://customerrest.herokuapp.com/api/";
const traingsLink = "https://customerrest.herokuapp.com/api/profile/trainings";

class App extends Component {
  componentDidMount() {
    console.log("App-Mounted");
  }
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <NavBar />
          <Switch>
            <Route path="/signin" component={SignIn} />
            <Route path="/signup" component={SignUp} />
            <Route path="/customers" component={Customers} />
            <Route path="/trainings" component={Trainings} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
