import React, { Component } from 'react'
import FacebookLogin from 'react-facebook-login';

export default class Facebook extends Component {
  
  state = {
    isLoggedIn: false,
    userId: '',
    name: '',
    email: '',
    picture: ''
  }

  responseFacebook = response => {
    console.log(response)
    this.setState({
      isLoggedIn: true,
      userID: response.userID,
      name: response.name,
      picture: response.picture.data.url
    });
    this.props.setLogIn(this.state.isLoggedIn)
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
          autoLoad={true}
          fields="name,email,picture"
          callback={this.responseFacebook}
        />
      )
    }

    return(
      <div>
       { fbContent } 
      </div>
    )
  }
}