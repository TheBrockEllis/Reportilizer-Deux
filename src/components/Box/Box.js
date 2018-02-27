import React from 'react';
import './Box.css';

class Box extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    return (
      <div className='draggable box'>
        <p className='currentLocation'>100 x 100</p>
        <p className='box-title' contentEditable={true}>Box</p>
        <div className='box-controls'>
          <span><i className='fas fa-edit' style={{marginRight: '15px'}}></i></span>
          <span><i className='fas fa-trash'></i></span>
        </div>
      </div>
    )
  }
}

export default Box;
