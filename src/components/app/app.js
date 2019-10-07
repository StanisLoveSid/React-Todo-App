import React, { Component } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import axios from 'axios';

import AppHeader from '../app-header';
import ApiService from '../../services/api-service';
import SearchPanel from '../search-panel';
import TodoList from '../todo-list';
import ItemStatusFilter from '../item-status-filter';
import ItemAddForm from '../item-add-form';
import Facebook from '../facebook';

import './app.css';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export default class App extends Component {

  constructor(props) {
    super(props);
    this.onDragEnd = this.onDragEnd.bind(this);
  }
  
  apiService = new ApiService();

  state = {
    loggedIn: false,
    projectId: 0,
    filter: '',
    userInpunt: '',
    todoData: []
  };

  componentDidMount(){
    this.updateTodos();
  }

  async getTodos() {
    const todoData = [];
    const projects = this.apiService.getAllProjects();
    await projects.then((value) => {
      value.forEach((el) => { 
        todoData.push({title: el.title, id: el.id, important: el.important, 
                       position: el.position, tasks: el.tasks,
                       done: el.done, filePath: `http://localhost:3001${el.attachment.url}`}) 
        this.setState({ projectId: el.id })
      })
    })
    return todoData;
  }

  async updateTodos() {
    const todoData = await this.getTodos();
    const sortedData = todoData.sort((a,b) => {
      return a.position - b.position
    })
    console.log(sortedData)
    this.setState({ todoData: sortedData })
  }

  toggleProperty(arr, id, propName) {
    const idx = arr.findIndex((el) => el.id === id);

    const oldItem = arr[idx];
    const oldItemPropName = propName === 'done' ? !oldItem.done : !oldItem.important; 
    this.apiService.updateProject(id, propName, oldItemPropName);
    const newItem = {
      ... oldItem, [propName]: oldItemPropName
    }

    return [
      ... arr.slice(0,idx),
      newItem,
      ... arr.slice(idx + 1)
    ];
  }

  onToggleImportant = (id) => {
    this.setState(({todoData}) => {
      return {
        todoData: this.toggleProperty(todoData, id, 'important')
      } 
    });
  }

  onToggleDone = (id) => {
    this.setState(({todoData}) => {
      return {
        todoData: this.toggleProperty(todoData, id, 'done')
      } 
    });
  }

  createItem(text) {
    const{ projectId } = this.state;
    // onsole.log(projectId)
    return {
      label: text,
      important: false,
      done: false,
      id: projectId+1
    }
  }

  async fetchProject(text) {
    const fd = new FormData();
    fd.append('title', text)
     await axios.post('http://localhost:3001/projects', fd).then((res) =>{
      console.log(res)
      this.setState(({todoData}) => {
        const newArray = [
          ... todoData,
          res.data
        ];
  
        return {
          todoData: newArray,
          projectId: res.data.id
        }  
      });
    })
  }

  addItem = (text) => {
    this.fetchProject(text);
  }

  async fetchUpdatedItem(text, id) {

  }

  updateItem = async (text, id) => {
    const fd = new FormData();
    fd.append('title', text)
    await axios.put(`http://localhost:3001/projects/${id}`, fd).then((res) => {
      this.setState(({ todoData }) => {
        const idx = this.state.todoData.findIndex((el) => el.id === id);

        const oldItem = todoData[idx];
        const newItem = {
          ... oldItem, title: text
        }
  
        const newArray = [
          ... todoData.slice(0,idx),
          newItem,
          ... todoData.slice(idx + 1)
        ];
  
        return {
          todoData: newArray
        }
      });
    })
  }

  setLogIn = (logged) => {
    this.setState({loggedIn: logged})
  }

  deleteItem = (id) => {
    this.setState(({ todoData }) => {
      this.apiService.deleteProject(id);

      const idx = todoData.findIndex((el) => el.id === id);

      const newArray = [
        ... todoData.slice(0,idx),
        ... todoData.slice(idx + 1)
      ];

      return {
        todoData: newArray
      }
    });
  }

  onSearch = (userInpunt) => {
    this.setState({ userInpunt })
  }

  onChangeFilter = (filter) => {
    this.setState({ filter })
  }

  sortTodos(filter, array) {
    switch(filter) {
      case 'all':
        return array;
      case 'done':
        return array.filter((el) => el.done);
      case 'active':
        return array.filter((el) => !el.done);
      default:
        return array;
    }
  }

  onDragEnd(result) {
    if (!result.destination) {
      return;
    }

    const todoData = reorder(
      this.state.todoData,
      result.source.index,
      result.destination.index
    );

    const sortedData = [];

    todoData.forEach((el, index) => {  
      sortedData.push([el.id, index])
    })

    axios.put('http://localhost:3001/update_position', { positions: sortedData })
    this.setState({
      todoData
    });
  }

  render() {
    const { todoData, userInpunt, filter } = this.state;

    const doneCount = todoData.filter((el) => el.done).length;
    const todoCount = todoData.length - doneCount;
    const sortedData = this.sortTodos(filter, todoData)
    const filteredData = sortedData.filter(
      (el) => el.title.toLowerCase().includes(userInpunt.toLowerCase())
    )
    const foundData = userInpunt ? filteredData : sortedData

    return (
      <div className="todo-app">
        <div style={ this.state.loggedIn ? {display: 'block'} : {display: 'none'} }>
        <Facebook setLogIn={this.setLogIn}/>
        <AppHeader toDo={todoCount} done={doneCount} />
        <div className="top-panel d-flex">
          <SearchPanel onSearch={this.onSearch}/>
          <ItemStatusFilter onChangeFilter={this.onChangeFilter} filter={filter}/>
        </div>
        <DragDropContext onDragEnd={this.onDragEnd}>
        <TodoList todos={foundData}
                  onUpdated={this.updateItem} 
                  onDeleted={this.deleteItem}
                  onToggleDone={this.onToggleDone}
                  onToggleImportant={this.onToggleImportant}/>
        </DragDropContext>

        <ItemAddForm  onAdded={this.addItem}/>
        </div>
      </div>
    );
  }
};
