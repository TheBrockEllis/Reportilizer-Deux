import React from 'react';
import './DataSource.css';

import Behave from 'behave-js';

import { fixture_data } from '../../lib/fixture-data';

class DataSource extends React.Component {

  componentDidMount(){
    let textarea = document.getElementById('dataSource');
    new Behave({
      textarea: textarea
    });

    textarea.value = JSON.stringify(fixture_data, null, 2);

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
