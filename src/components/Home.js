import React, { Component } from "react";
import axios from "axios";
import Facebook from './facebook';

import Registration from "./auth/Registration";
import Login from "./auth/Login";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.handleSuccessfulAuth = this.handleSuccessfulAuth.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
  }

  state = {
    showLogin: false
  }

  handleSuccessfulAuth(data) {
    this.props.handleLogin(data);
  }

  handleLogoutClick() {
    axios
      .delete("http://localhost:3001/logout", { withCredentials: true })
      .then(response => {
        this.props.handleLogout();
      })
      .catch(error => {
        console.log("logout error", error);
      });
  }

  toggleLoginShow = (show) => {
    this.setState({showLogin: !show})
  }

  render() {
    return (
      <div className='mt-5'>
        <div style={ this.state.showLogin ? {display: 'none'} : {display:'block'} }>
          <Registration handleSuccessfulAuth={this.handleSuccessfulAuth}/>
        </div>
        <div style={ this.state.showLogin ? {display:'block'} : {display: 'none'}}>
          <Login handleSuccessfulAuth={this.handleSuccessfulAuth} />
        </div>
        <div className="container h-100">
          <div className='row h-100 justify-content-center align-items-center'>
        <div className='mt-2'>
          <a href='#' onClick={() => { this.toggleLoginShow(this.state.showLogin) }}>
            { this.state.showLogin ? 'Sign up' : 'Sign in' }
          </a>
        </div>
        </div>
        </div>
        <Facebook setUserEmail={this.props.setUserEmail} handleLogin={this.props.handleLogin}/>
      </div>
    );
  }
}