import React, { Component } from 'react';

import AppHeader from '../app-header';
import ApiService from '../../services/api-service';
import SearchPanel from '../search-panel';
import TodoList from '../todo-list';
import ItemStatusFilter from '../item-status-filter';
import ItemAddForm from '../item-add-form';

import './app.css';

export default class App extends Component {
  
  apiService = new ApiService();

  state = {
    projectId: 0,
    filter: '',
    userInpunt: '',
    todoData: []
  };

  componentDidMount(){
    this.updateTodos();
  }

  updateTodos() {
    const todoData = [];
    const projects = this.apiService.getAllProjects();
    projects.then((value) => {
      value.forEach((el) => { 
        todoData.push({label: el.title, id: el.id, important: el.important, done: el.done}) 
      })
    })
    this.setState({ todoData })
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
    console.log(projectId)
    return {
      label: text,
      important: false,
      done: false,
      id: projectId
    }
  }

  async fetchProject(text) {
    await this.apiService.postProject(text).then((projectId) => {
      this.setState({ projectId })
    })
  }

  addItem = (text) => {
    this.fetchProject(text)
    const newItem = this.createItem(text);

    this.setState(({todoData}) => {
      const newArray = [
        ... todoData,
        newItem
      ];

      return {
        todoData: newArray
      }  
    });
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

  render() {
    const { todoData, userInpunt, filter } = this.state;

    const doneCount = todoData.filter((el) => el.done).length;
    const todoCount = todoData.length - doneCount;
    const sortedData = this.sortTodos(filter, todoData)
    const filteredData = sortedData.filter(
      (el) => el.label.toLowerCase().includes(userInpunt.toLowerCase())
    )
    const foundData = userInpunt ? filteredData : sortedData

    return (
      <div className="todo-app">
        <AppHeader toDo={todoCount} done={doneCount} />
        <div className="top-panel d-flex">
          <SearchPanel onSearch={this.onSearch}/>
          <ItemStatusFilter onChangeFilter={this.onChangeFilter} filter={filter}/>
        </div>
  
        <TodoList todos={foundData} 
                  onDeleted={this.deleteItem}
                  onToggleDone={this.onToggleDone}
                  onToggleImportant={this.onToggleImportant}/>

        <ItemAddForm  onAdded={this.addItem}/>
      </div>
    );
  }
};
