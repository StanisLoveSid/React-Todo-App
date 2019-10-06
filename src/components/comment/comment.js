import React, { Component } from 'react';
import { Motion, spring } from 'react-motion';
import Progress from '../progress';
import axios from 'axios';

import './comment.css';

export default class Comment extends Component {

  state = {
    selectedFile: null,
    filePath: this.props.filePath,
    newFilePath: null,
    uploadPercentage: 0
  }

  fileSelectedHandler = event => {
    this.setState({
      selectedFile: event.target.files[0]
    })
  }

  fileUploadedHandler =  async () => {
    const fd = new FormData();
    fd.append('attachment', this.state.selectedFile, this.state.selectedFile.name)
    await axios.put(`http://localhost:3001/comments/${this.props.comment.id}`, fd, {
      onUploadProgress: progressEvent => {
        this.setState({
          uploadPercentage: parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total))
        })

        setTimeout(() => this.setState({uploadPercentage: 0}), 2000);
      }
    })
      .then((res) => {
        this.setState({
          newFilePath: `http://localhost:3001${res.data.url}`
       })
    })
  }

  setFilePath(path) {
    if(path === null){
      return this.state.filePath;
    } else {
      return path;
    }
  }

  render(){
    const finalPath = this.setFilePath(this.state.newFilePath);

    return(
        <li className='list-group-item' style={{width: '680px'}}>
          <div> 
          <span>
            {this.props.comment.title}
          </span>
          <button type="button"
                className="btn btn-outline-danger btn-sm float-right"
                onClick={() => { this.props.onDeleted(this.props.comment.id) }}>
         <i className="fa fa-trash-o" />
       </button>
          <div>
          <input type='file' onChange={this.fileSelectedHandler} style={{ width: '270px' }}/> 
          <button className='btn btn-primary' 
                style={ { width: '100px' } } 
                onClick={this.fileUploadedHandler}>Upload</button>
          </div>
          <Motion style={{currentOpacity: spring(this.state.uploadPercentage === 0 ? 0 : 1, { stiffness: 140, damping: 20 })}}>
              {({currentOpacity}) =>
                  <div style={{opacity: currentOpacity}}>
                      <Progress percentage={this.state.uploadPercentage}/>
                  </div>
              }
          </Motion>
          { finalPath !== undefined ? finalPath.includes('null') ? 
            null : 
            <a href={finalPath} target='_blank'>{finalPath.split('/').slice(-1)[0]}</a> : null }
            </div> 
      </li>
    )
  }
}
