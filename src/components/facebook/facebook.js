import React, { Component } from 'react'
import FacebookLogin from 'react-facebook-login';
import axios from 'axios';

export default class Facebook extends Component {
  
  state = {
    userId: '',
    name: '',
    email: '',
    picture: ''
  }

  responseFacebook = async response => {
    console.log(response)
    this.setState({
      userID: response.userID,
      name: response.name,
      picture: response.picture.data.url
    });
    const fd = new FormData();
    fd.append('email', response.email)
    await axios.post("http://localhost:3001/facebook_login", fd, { withCredentials: true }).then((res) => {
      this.props.handleLogin(res.data)
    })
    this.props.setUserEmail(this.state.email);
  };

  componentClicked = () => console.log("clicked");

  render() {
    let fbContent;

    if(this.state.isLoggedIn) {
      fbContent = (
        <div
          style={{
            width: "400px",
            margin: "auto",
            background: "#f4f4f4",
            padding: "20px"
          }}>

          <img src={this.state.picture} alt={this.state.name} />
          <h2>Welcome {this.state.name}</h2>
        </div>
      );
    } else {
      fbContent = (
        <FacebookLogin
          appId="1457601917724880"
          autoLoad={false}
          fields="name,email,picture"
          callback={this.responseFacebook}
        />
      )
    }

    return(
      <div className="container h-100 mt-2">
      <div className='row h-100 justify-content-center align-items-center'>
       { fbContent } 
      </div>
      </div>
    )
  }
}