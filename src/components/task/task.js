import React, { Component } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import TaskUpdateForm from '../task-update-form';
import CommentList from '../comment-list';
import './task.css';

export default class Task extends Component {
 
  state = {
    showEditForm: false
  }

  openedForm = (edited) => {
    this.setState({showEditForm: edited})
  }

  render() {
    const { item, index } = this.props;

    return(
      <Draggable key={item.id} draggableId={item.id} index={index}>
        {(provided) => (
          <div className='list-group-item'
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}>
            
            {this.state.showEditForm ? <TaskUpdateForm title={item.title}
                                                   deadline={item.deadline}
                                                   openedForm={this.openedForm}
                                                   id={item.id} 
                                                   onUpdated={this.props.onUpdated}/> 
                                   : 
                                      <span style={item.done ? {textDecorationLine: 'line-through'} : {}} 
                                                   onClick={() => { this.props.changeDone(item.id) } }>
                                                   {item.title} {item.deadline}
                                      </span>}
            
            <button type="button"
                 style={{marginLeft: '10px'}}
                className="btn btn-outline-info btn-sm float-right"
                onClick={() => { this.setState({showEditForm: true}) }}>
             <i className="fa fa-pencil" />
            </button>

            <button type="button"
                    className="btn btn-outline-danger btn-sm float-right"
                    onClick={() => { this.props.deleteTask(item.id) }}>
              <i className="fa fa-trash-o" />
             </button>
            <span>
            <CommentList comments={item.comments}
                         taskId={item.id}/>
            </span>
          </div>
        )}
      </Draggable>
    )
  }
}