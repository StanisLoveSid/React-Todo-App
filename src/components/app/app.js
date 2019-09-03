import React, { Component } from 'react';

import AppHeader from '../app-header';
import SearchPanel from '../search-panel';
import TodoList from '../todo-list';
import ItemStatusFilter from '../item-status-filter';
import ItemAddForm from '../item-add-form';

import './app.css';

export default class App extends Component {
  maxId = 100;

  state = {
    userInpunt: '',
    todoData: [
      this.createItem('Drink Coffee'),
      this.createItem('Make Awesome App'),
      this.createItem('Have a lunch')
    ]
  };

  toggleProperty(arr, id, propName) {
    const idx = arr.findIndex((el) => el.id === id);

    const oldItem = arr[idx];
    const newItem = {
      ... oldItem, [propName]: !oldItem.done
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
    return {
      label: text,
      important: false,
      done: false,
      id: this.maxId++
    }
  }

  addItem = (text) => {
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

  onSearch = (text) => {
    this.setState(() => { 
      return {
        userInpunt: text
      }
    });
  }

  render() {
    const { todoData, userInpunt } = this.state;

    const doneCount = todoData.filter((el) => el.done).length;
    const todoCount = todoData.length - doneCount;
    const filteredData = todoData.filter(
      (el) => el.label.toLowerCase().includes(userInpunt.toLowerCase())
    )
    const foundData = userInpunt ? filteredData : todoData

    return (
      <div className="todo-app">
        <AppHeader toDo={todoCount} done={doneCount} />
        <div className="top-panel d-flex">
          <SearchPanel onSearch={this.onSearch}/>
          <ItemStatusFilter />
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
