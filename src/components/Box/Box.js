import React from 'react';
import './Box.css';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

class Box extends React.Component {
  constructor(props){
    super(props);

    this.deleteBox = this.deleteBox.bind(this);
  }

  deleteBox(){

    confirmAlert({
      title: 'Delete box',                        // Title dialog
      message: 'Are you sure to do this?',               // Message dialog
      confirmLabel: 'Yes',                           // Text button confirm
      cancelLabel: 'No',                             // Text button cancel
      onConfirm: () => {
        // remove box from the page1
        alert('Removing box');
        //tell the VisualEditor, that tracks all of the boxes, to remove this one
      },
      onCancel: () => {
        alert('Action after Cancel')     // Action after Cancel
      }
    })

  }

  render(){
    return (
      <div className='draggable box'>
        <p className='currentLocation'>100 x 100</p>
        <p className='boxTitle' contentEditable={true}>Box</p>
        <div className='boxControls'>
          <span><i className='fas fa-edit' style={{marginRight: '15px'}}></i></span>
          <span onClick={this.deleteBox}><i className='fas fa-trash'></i></span>
        </div>
      </div>
    )
  }
}

export default Box;
