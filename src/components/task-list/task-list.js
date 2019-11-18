import React, { Component } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import axios from 'axios';
import {connect} from 'react-redux';
import { pick, values } from 'lodash';
import { fetchTasks } from '../../redux/actions';
 
import Task from '../task';
import './task-list.css';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  
  return result;
};

class TaskList extends Component {

    constructor(props) {
      super(props);
      this.onDragEnd = this.onDragEnd.bind(this);
    }

    componentDidMount() {
      this.props.fetchTasks(this.props.projectTasks)
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
    const { tasks } = this.props;

    return(
        <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}>
            {tasks.map((item, index) => (
            <Task item={item} index={index} 
                  changeDone={this.changeDone}/>
          ))}
          {provided.placeholder}
            </div>
          )}
        </Droppable>
        </DragDropContext>
    )
  }
}

const mapStateToProps = state => {
  return {
    tasks: Object.values(state.entities.tasks)
  }
}

const mapDispatchToProps = {
  fetchTasks: fetchTasks
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskList);
