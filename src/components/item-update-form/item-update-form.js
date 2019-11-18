import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateProjectRequest } from '../../redux/actions';

import './item-update-form.css'

class ItemUpdateForm extends Component {

  state = {
    title: this.props.title
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.props.updateProjectRequest(this.state.title, this.props.id);
    this.props.openedForm(false);
  }

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
               onChange={this.onLabelChange}
               placeholder='What needs to be done'
               value={this.state.title}/>
        <button className='btn btn-outline-secondary' style={{width: '80px', marginBottom: '8px'}}>
          Update
        </button>
        <button className='btn btn-outline-secondary' 
                style={{width: '80px', marginBottom: '8px'}}
                onClick={() => {this.props.openedForm(false)}}>
          Cancel
        </button>
      </form>
    )
  }
}

const mapDispatchToProps = {
  updateProjectRequest: updateProjectRequest
}

export default connect(null, mapDispatchToProps)(ItemUpdateForm);
