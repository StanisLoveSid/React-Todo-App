import React, { Component } from "react";
import axios from "axios";

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      loginErrors: ""
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit(event) {
    const { email, password } = this.state;

    axios
      .post(
        "http://localhost:3001/sessions",
        {
          user: {
            email: email,
            password: password
          }
        },
        { withCredentials: true }
      )
      .then(response => {
        if (response.data.logged_in) {
          this.props.handleSuccessfulAuth(response.data);
        }
      })
      .catch(error => {
        console.log("login error", error);
      });
    event.preventDefault();
  }

  render() {
    return (
        <div className="container h-100">
          <div className='row h-100 justify-content-center align-items-center'>
          <div className="card text-center" style={{width: '18rem'}}>
          <div className="card-body">
          <h5 class="card-title">Sign in</h5>
          <form onSubmit={this.handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className='form-control mt-2'
              value={this.state.email}
              onChange={this.handleChange}
              required
            />
  
            <input
              type="password"
              name="password"
              placeholder="Password"
              className='form-control mt-2'
              value={this.state.password}
              onChange={this.handleChange}
              required
            />
  
            <button type="submit"
                    className='btn btn-outline-secondary mt-2'>Login</button>
          </form>
          </div>
         </div>
          </div>
        </div>
    );
  }
}