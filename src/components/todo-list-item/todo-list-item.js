import React, { Component } from 'react';
import axios from 'axios';

import './todo-list-item.css';

export default class TodoListItem extends Component {

  state = {
    done: false,
    important: false,
    selectedFile: null,
    filePath: this.props.filePath,
    newFilePath: null
  }

  fileSelectedHandler = event => {
    this.setState({
      selectedFile: event.target.files[0]
    })
  }

  fileUploadedHandler =  async () => {
    const fd = new FormData();
    fd.append('attachment', this.state.selectedFile, this.state.selectedFile.name)
    await axios.put(`http://localhost:3001/projects/${this.props.id}`, fd)
      .then((res) => {
        this.setState({
          newFilePath: `http://localhost:3001${res.data.url}`
       })
    })
  }

  setFilePath(path) {
    if(path === null){
      return this.state.filePath;
    } else {
      return path;
    }
  }

  render() {
    const { label, onDeleted, 
                   onToggleImportant, 
                   onToggleDone,
                   important,
                   done} = this.props;

    const path = this.state.newFilePath;

    let classNames = 'todo-list-item';

    if(done) {
      classNames += ' done';
    }

    if(important) {
      classNames += ' important';
    }
  
    return (
      <span className={classNames}>
        <span
          className="todo-list-item-label"
          onClick={onToggleDone}>
          {label}
        </span>
  
        <button type="button"
                className="btn btn-outline-success btn-sm float-right"
                onClick={onToggleImportant}>
          <i className="fa fa-exclamation" />
        </button>

        <button type="button"
                className="btn btn-outline-danger btn-sm float-right"
                onClick={onDeleted}>
          <i className="fa fa-trash-o" />
        </button>
       
        <div>
        <input type='file' 
               onChange={this.fileSelectedHandler}/> 
        </div>
        <button className='btn btn-primary' style={ { width: '100px' } } onClick={this.fileUploadedHandler}>Upload</button>
        <div>
        <a href={this.setFilePath(path)}>{this.setFilePath(path).split('/').slice(-1)[0]}</a>
        </div>
      </span>
    );
  }
}
