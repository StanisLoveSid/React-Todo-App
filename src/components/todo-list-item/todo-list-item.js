import React, { Component } from 'react';
import {Motion, spring} from 'react-motion';
import { Draggable } from 'react-beautiful-dnd';
import Progress from '../progress';
import axios from 'axios';

import './todo-list-item.css';

export default class TodoListItem extends Component {

  state = {
    done: false,
    important: false,
    selectedFile: null,
    filePath: this.props.filePath,
    newFilePath: null,
    uploadPercentage: 0
  }

  fileSelectedHandler = event => {
    this.setState({
      selectedFile: event.target.files[0]
    })
  }

  fileUploadedHandler =  async () => {
    const fd = new FormData();
    fd.append('attachment', this.state.selectedFile, this.state.selectedFile.name)
    await axios.put(`http://localhost:3001/projects/${this.props.id}`, fd, {
      onUploadProgress: progressEvent => {
        this.setState({
          uploadPercentage: parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total))
        })

        setTimeout(() => this.setState({uploadPercentage: 0}), 2000);
      }
    })
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

    const finalPath = this.setFilePath(this.state.newFilePath);

    let classNames = 'todo-list-item';

    if(done) {
      classNames += ' done';
    }

    if(important) {
      classNames += ' important';
    }
  
    return (
      <Draggable key={this.props.id} draggableId={this.props.id} index={this.props.index}>
      {(provided) => (
        <div className='list-group-item'
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}>
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
        <div className='mt-2'>
        <button className='btn btn-primary' 
                style={ { width: '100px' } } 
                onClick={this.fileUploadedHandler}>Upload</button>
        </div>
        <div className='mt-2'>
          <Motion style={{currentOpacity: spring(this.state.uploadPercentage === 0 ? 0 : 1, { stiffness: 140, damping: 20 })}}>
              {({currentOpacity}) =>
                  <div style={{opacity: currentOpacity}}>
                      <Progress percentage={this.state.uploadPercentage}/>
                  </div>
              }
          </Motion>
        </div>
        <div className='mt-2'></div>
          { finalPath !== undefined ? finalPath.includes('null') ? 
            null : 
            <a href={finalPath} target='_blank'>{finalPath.split('/').slice(-1)[0]}</a> : null }
        
      </span>
      </div>
       )}
    </Draggable>
    );
  }
}
