import React, { Component } from 'react'
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Home from "../Home";
import Dashboard from "../Dashboard";

export default class Authorization extends Component {
  render() {
      const { props } = this.props;
    return (
        <div className="authorization">
        <BrowserRouter>
          <Switch>
            <Route
              exact
              path={"/"}
              render={ (
                <Home
                  {... props}
                  handleLogin={this.handleLogin}
                  handleLogout={this.handleLogout}
                  loggedInStatus={this.props.loggedInStatus}/>
              )}
            />
            <Route
              exact
              path={"/dashboard"}
              render={ (
                <Dashboard
                  {... props}
                  loggedInStatus={this.props.loggedInStatus}
                />
              )}
            />
          </Switch>
        </BrowserRouter>
      </div>
    )
  }
}
