import React, { Component } from 'react';

import './item-add-form.css'

export default class ItemAddForm extends Component {

  state = {
    title: ''
  }

  onSubmit = async (e) => {
    e.preventDefault();
    await this.props.onAdded(this.state.title)
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
