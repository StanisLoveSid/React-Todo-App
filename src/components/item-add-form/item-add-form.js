import React, { Component } from 'react';
import {connect} from 'react-redux';
import { createProjectRequest } from '../../redux/actions';

import './item-add-form.css'

class ItemAddForm extends Component {

  state = {
    title: ''
  }

  onSubmit = async (e) => {
    e.preventDefault();
    this.props.createProjectRequest(this.state.title, this.props.userId)
    this.setState({
      title: ''
    });
  }

  onLabelChange = (e) => {
    this.setState({
      title: e.target.value
    });
  }

  render() {
    return(
      <form className='item-add-form d-flex'
            onSubmit={this.onSubmit}>
        <input type='text'
               className='form-control'
               onChange={this.onLabelChange}
               placeholder='What needs to be done'
               value={this.state.title}/>
        <button className='btn btn-outline-secondary'>
          Add Item
        </button>
      </form>
    )
  }
}

const mapDispatchToProps = {
  createProjectRequest: createProjectRequest
}

export default connect(null, mapDispatchToProps)(ItemAddForm);
