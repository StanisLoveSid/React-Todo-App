import React, { Component } from 'react';
import Comment from '../comment';
import axios from 'axios';

import './comment-list.css';

export default class CommentList extends Component {

  state = {
    label: '',
    showComments: false,
    comments: []
  } 

  componentDidMount() {
    this.setState({
      comments: this.props.comments
    })
  }

  toggleComments = (show) => {
    this.setState({showComments: !show})
  }

  onSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    const { label } = this.state;
    const { taskId } = this.props;
    fd.append('title', label);
    fd.append('task_id', taskId);
    await axios.post('http://localhost:3001/comments', fd).then((res) =>{
      this.setState(({comments}) => {
        const newArray = [
          ... comments,
          res.data
        ];

        return {
          comments: newArray,
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

  updateComment = async (text, id) => {
    const fd = new FormData();
    fd.append('title', text)
    await axios.put(`http://localhost:3001/comments/${id}`, fd).then((res) => {
      this.setState(({ comments }) => {
        const idx = comments.findIndex((el) => el.id === id);

        const oldItem = comments[idx];
        const newItem = {
          ... oldItem, title: text
        }
  
        const newArray = [
          ... comments.slice(0,idx),
          newItem,
          ... comments.slice(idx + 1)
        ];
  
        return {
          comments: newArray
        }
      });
    })
  }

  deleteComment = (id) => {
    this.setState(({ comments }) => {
      axios.delete(`http://localhost:3001/comments/${id}`)

      const idx = comments.findIndex((el) => el.id === id);

      const newArray = [
        ... comments.slice(0,idx),
        ... comments.slice(idx + 1)
      ];

      return {
        comments: newArray
      }
    });
  }
    
  render() {
    return (
        <div>
        <li>
          <a onClick={() => { this.toggleComments(this.state.showComments) }}>
            {this.state.showComments ? 'Hide': 'Show'} comments({this.state.comments.length})
          </a>
        </li>
      <span style={ this.state.showComments ? {display: 'block'} : {display: 'none'}}>
        {this.state.comments.map((comment) =>(
          <Comment comment={comment}
                   onUpdated={this.updateComment}
                   onDeleted={this.deleteComment}/>
        ))}
        <form className='d-flex'
              onSubmit={this.onSubmit}>

          <input type='text'
                 style={{width: '620px', marginRight: '3px', marginTop: '10px'}}
                 className='form-control'
                 onChange={this.onLabelChange}
                 placeholder='Comment'
                 value={this.state.label}/>
          <button className='btn btn-outline-secondary' style={{height: '38px', marginTop: '10px'}}>
            Add
          </button>
        </form>
      </span>
      </div>
    )
  }
}