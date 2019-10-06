import React, { Component } from 'react';
import {Motion, spring} from 'react-motion';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import Progress from '../progress';
import axios from 'axios';
import DatePicker from "react-datepicker";
import CommentList from '../comment-list';
 
import "react-datepicker/dist/react-datepicker.css";
import './todo-list-item.css';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export default class TodoListItem extends Component {

  constructor(props) {
    super(props);
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  state = {
    startDate: new Date(),
    tasks: [],
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

  componentDidMount() {
    this.setState({
      tasks: this.props.tasks
    })
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

  changeDone = (id) => {
    const { tasks } = this.state;
    const idx = tasks.findIndex((el) => el.id === id);

    const oldItem = tasks[idx];
    const oldItemPropName = !oldItem.done;
    const fd = new FormData();
    fd.append('done', oldItemPropName);
    axios.put(`http://localhost:3001/tasks/${id}`, fd)
    const newItem = {
      ... oldItem, done: oldItemPropName
    }

    const newArray = [
      ... tasks.slice(0,idx),
      newItem,
      ... tasks.slice(idx + 1)
    ];

    console.log(newArray)

    this.setState(({tasks}) => {
      return {
        tasks: newArray
      } 
    });
  }

  deleteTask = (id) => {
    this.setState(({ tasks }) => {
      axios.delete(`http://localhost:3001/tasks/${id}`)
      const idx = tasks.findIndex((el) => el.id === id);

      const newArray = [
        ... tasks.slice(0,idx),
        ... tasks.slice(idx + 1)
      ];

      return {
        tasks: newArray
      }
    });
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

  onDragEnd(result) {
    if (!result.destination) {
      return;
    }

    const tasks = reorder(
      this.state.tasks,
      result.source.index,
      result.destination.index
    );

    const sortedTasks = [];

    tasks.forEach((el, index) => {  
      sortedTasks.push([el.id, index])
    })

    axios.put('http://localhost:3001/update_tasks_position', { positions: sortedTasks })
    this.setState({
      tasks
    });
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
      <div>

      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}>
              {this.state.tasks.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <div className='list-group-item'
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}>
                      <span style={item.done ? {textDecorationLine: 'line-through'} : {}} 
                            onClick={() => { this.changeDone(item.id) } }>
                        {item.title} {item.deadline}
                      </span>
                      <button type="button"
                              className="btn btn-outline-danger btn-sm float-right"
                              onClick={() => { this.deleteTask(item.id) }}>
                        <i className="fa fa-trash-o" />
                       </button>
                      <span>
                      <CommentList comments={item.comments}
                                   taskId={item.id}/>
                      </span>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

        <form className='item-add-form d-flex'
              onSubmit={this.onSubmit}>

          <input type='text'
                 style={{width: '160px'}}
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
