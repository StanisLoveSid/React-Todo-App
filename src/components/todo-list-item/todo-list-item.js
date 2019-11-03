import React, { Component } from 'react';
import {Motion, spring} from 'react-motion';
import { Draggable } from 'react-beautiful-dnd';
import Progress from '../progress';
import axios from 'axios';
import DatePicker from "react-datepicker";
import TaskList from '../task-list';
import ItemUpdateForm from '../item-update-form';
 
import "react-datepicker/dist/react-datepicker.css";
import './todo-list-item.css';

export default class TodoListItem extends Component {

  state = {
    showEditForm: false,
    startDate: new Date(),
    label: '',
    done: false,
    important: false,
    selectedFile: null,
    filePath: this.props.filePath,
    newFilePath: null,
    uploadPercentage: 0
  }

  handleChange = date => {
    this.setState({
      startDate: date
    });
  };

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

  onSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    const { label, startDate } = this.state;
    const { id } = this.props;
    fd.append('title', label);
    fd.append('project_id', id);
    fd.append('deadline', startDate);
    await axios.post('http://localhost:3001/tasks', fd).then((res) =>{
      this.setState(({tasks}) => {
        const newArray = [
          ... tasks,
          res.data
        ];

        return {
          tasks: newArray,
          label: ''
        }  
      });
    })
  }

  onLabelChange = (e) => {
    this.setState({
      label: e.target.value
    });
  }

  openedForm = (edited) => {
    this.setState({showEditForm: edited})
  }

  render() {
    const { title, onDeleted,
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

        {this.state.showEditForm ? <ItemUpdateForm title={title}
                                                   openedForm={this.openedForm}
                                                   id={this.props.id} 
                                                   onUpdated={this.props.onUpdated}/> 
                                   :         <span
                                   className="todo-list-item-label"
                                   onClick={onToggleDone}>
                                     {title}
                                 </span>}
  
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

        <button type="button"
                className="btn btn-outline-info btn-sm float-right"
                onClick={() => { this.setState({showEditForm: true}) }}>
          <i className="fa fa-pencil" />
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
      <div>
 
        <TaskList tasks={this.props.tasks}/>

        <form className='item-add-form d-flex'
              onSubmit={this.onSubmit}>

          <input type='text'
                 style={{width: '495px'}}
                 className='form-control'
                 onChange={this.onLabelChange}
                 placeholder='Add Task'
                 value={this.state.label}/>
            <DatePicker style={{width: '20px'}}
                        className='form-control'
                        selected={this.state.startDate}
                        onChange={this.handleChange}/>
          <button className='btn btn-outline-secondary'>
            Add
          </button>
        </form>
      </div>
      </div>
       )}
    </Draggable>
    );
  }
}
