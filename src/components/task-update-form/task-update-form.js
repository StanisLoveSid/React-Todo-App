import React, { Component } from 'react';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import './task-update-form.css'

export default class TaskUpdateForm extends Component {

  state = {
    startDate: new Date(),
    title: this.props.title
  }

  onSubmit = async (e) => {
    e.preventDefault();
    await this.props.onUpdated(this.state.title, this.state.startDate, this.props.id);
    this.props.openedForm(false);
  }

  handleChange = date => {
    this.setState({
      startDate: date
    });
  };

  onLabelChange = (e) => {
    this.setState({
      title: e.target.value
    });
  }

  render() {
    return(
      <form className='item-update-form d-flex'
            onSubmit={this.onSubmit}>
        <input type='text'
               className='form-control'
               style={{width: '80%'}}
               onChange={this.onLabelChange}
               placeholder='What needs to be done'
               value={this.state.title}/>
        <DatePicker style={{width: '100%'}}
            className='form-control'
            selected={this.state.startDate}
            value={this.props.deadline}
            dateForm = "DD.MM.YYYY" 
            onChange={this.handleChange}/>
        <button className='btn btn-outline-secondary' style={{width: '80px', marginBottom: '8px'}}>
          Update
        </button>
        <button className='btn btn-outline-secondary' 
                style={{width: '80px', marginBottom: '8px', marginLeft: '8px'}}
                onClick={() => {this.props.openedForm(false)}}>
          Cancel
        </button>
      </form>
    )
  }
}
