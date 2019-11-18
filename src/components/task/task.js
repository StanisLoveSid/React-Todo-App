import React, { Component } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import TaskUpdateForm from '../task-update-form';
import CommentList from '../comment-list';
import {connect} from 'react-redux';
import { removeTaskRequest } from '../../redux/actions';

import './task.css';

class Task extends Component {
 
  state = {
    showEditForm: false
  }

  onDeleted = (event) => {
    event.preventDefault()
    this.props.removeTaskRequest(this.props.item.id)
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
                    onClick={this.onDeleted}>
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

const mapDispatchToProps = {
  removeTaskRequest: removeTaskRequest
}

export default connect(null, mapDispatchToProps)(Task);