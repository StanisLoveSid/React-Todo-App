import React from 'react';

import TodoListItem from '../todo-list-item';
import { Droppable } from "react-beautiful-dnd";
import './todo-list.css';

const TodoList = ({ todos, onDeleted, onToggleImportant, onToggleDone}) => {

  const elements = todos.map((item, index) => {
    const { id, ... itemProps } = item;

    return (
      <li key={id} >
        <TodoListItem {... itemProps}
                      id={id}
                      index={index}
                      onDeleted={() => onDeleted(id)}
                      onToggleImportant={() => onToggleImportant(id)}
                      onToggleDone={() => onToggleDone(id)}/>
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
};

export default TodoList;
