import React, { Component } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import axios from 'axios';
 
import Task from '../task';
import './task-list.css';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  
  return result;
};

export default class TaskList extends Component {

    constructor(props) {
      super(props);
      this.onDragEnd = this.onDragEnd.bind(this);
    }

    state = {
      tasks: this.props.tasks
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

    updateComment = async (text, deadline, id) => {
      const fd = new FormData();
      fd.append('title', text);
      fd.append('deadline', deadline);
      await axios.put(`http://localhost:3001/tasks/${id}`, fd).then((res) => {
        this.setState(({ tasks }) => {
          const idx = tasks.findIndex((el) => el.id === id);
  
          const datestring = deadline.getFullYear() + "-" + deadline.getMonth() + "-" + deadline.getDate()   
          const oldItem = tasks[idx];
          const newItem = {
            ... oldItem, title: text, deadline: datestring
          }
      
          const newArray = [
            ... tasks.slice(0,idx),
            newItem,
            ... tasks.slice(idx + 1)
          ];
      
          return {
            tasks: newArray
          }
        });
      })
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

  render() {
    const { tasks } = this.state;

    return(
        <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}>
            {tasks.map((item, index) => (
            <Task item={item} index={index} 
                  changeDone={this.changeDone} 
                  deleteTask={this.deleteTask}
                  onUpdated={this.updateComment}/>
          ))}
          {provided.placeholder}
            </div>
          )}
        </Droppable>
        </DragDropContext>
    )
  }
}