import React from "react";
import "./App.css";
import Home from "./screens/Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"; // Use Switch and Route
import Login from "./screens/Login";
import Subscription from "./screens/Subscription";
import Myorders from "./screens/Myorders"
import "../node_modules/bootstrap-dark-5/dist/css/bootstrap-dark.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
import Signup from "./screens/Signup";
import Navbar from '../src/components/Navbar';
import Profile from "./screens/Profile";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <Navbar />
      <div>
        <Switch> {/* Use Switch component */}
          <Route exact path="/" component={Home} />
          <Route path="/subscription" component={Subscription} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/myorders" component={Myorders} />
          <Route exact path="/profile" component={Profile} />
        </Switch>

      </div>
      <ToastContainer />
    </Router>
  );
}

export default App;
