import React, { Component } from 'react';

import TodoListItem from '../todo-list-item';
import { Droppable } from "react-beautiful-dnd";
import {connect} from 'react-redux';

import { fetchProjectsRequest } from '../../redux/actions';

import './todo-list.css';

class TodoList extends Component {

  componentDidMount = () => {
    this.props.fetchProjectsRequest()
  }

  render(){
    const elements = this.props.todos.map((item, index) => {
      const { id, ... itemProps } = item;
  
      return (
        <li key={id} >
          <TodoListItem {... itemProps}
                        id={id}
                        tasks={item.tasks}
                        index={index}
                        onUpdated={this.props.onUpdated}
                        onDeleted={() => this.props.onDeleted(id)}
                        onToggleImportant={() => this.props.onToggleImportant(id)}
                        onToggleDone={() => this.props.onToggleDone(id)}/>
        </li>
      );
    });

    return (
      <ul className='list-group todo-list list-unstyled' >
              <Droppable droppableId="droppable">
        {(provided) => (
          <div 
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
        { elements } 
        {provided.placeholder}
        </div>
      )}
   </Droppable>  
      </ul>
    );
  }
};

const mapStateToProps = state => {
  return {
    projects: Object.values(state.entities.todos)
  }
}

const mapDispatchToProps = {
  fetchProjectsRequest: fetchProjectsRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoList);
