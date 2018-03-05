import React from 'react';
import './Box.css';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

class Box extends React.Component {
  constructor(props){
    super(props);

    this.confirmDelete = this.confirmDelete.bind(this);
    this.deleteBox = this.deleteBox.bind(this);
  }

  confirmDelete(){

    confirmAlert({
      title: 'Delete box',                        // Title dialog
      message: 'Are you sure to do this?',               // Message dialog
      confirmLabel: 'Yes',                           // Text button confirm
      cancelLabel: 'No',                             // Text button cancel
      onConfirm: () => {
        this.deleteBox();
      },
      onCancel: () => {
        alert('Action after Cancel')     // Action after Cancel
      }
    })

  }

  deleteBox(){
    this.props.deleteBox(this.props.box);
  }

  render(){
    return (
      <div className='draggable box' id={`box_${this.props.box.boxIndex}`} data-boxindex={this.props.box.boxIndex} style={ {width: this.props.box.width, height: this.props.box.height, transform: 'translate(' + this.props.box.x + 'px, ' + this.props.box.y + 'px)' } }>
        <p className='currentLocation'>{this.props.box.width} x {this.props.box.height}</p>
        <p className='boxTitle'>{this.props.box.name}</p>
        <div className='boxControls'>
          <span onClick={() => { this.props.toggleEditModal(this.props.box) }}><i className='fas fa-edit' style={{marginRight: '15px'}}></i></span>
          <span onClick={this.confirmDelete}><i className='fas fa-trash'></i></span>
        </div>
      </div>
    )
  }
}

export default Box;
