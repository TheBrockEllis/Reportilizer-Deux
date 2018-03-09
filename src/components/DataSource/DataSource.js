import React from 'react';
import './DataSource.css';

import Behave from 'behave-js';

class DataSource extends React.Component {

  componentDidMount(){
    let textarea = document.getElementById('dataSource');
    new Behave({
      textarea: textarea
    });
  }

  render() {
    return (
      <div className='dataSource'>
        <textarea id='dataSource'></textarea>
      </div>
    );
  }
}

export default DataSource;
