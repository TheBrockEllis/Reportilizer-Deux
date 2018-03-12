import React from 'react';
import './DataSource.css';

import Behave from 'behave-js';
import { Button } from 'reactstrap';

class DataSource extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      data: ''
    }

    this.initData = this.initData.bind(this);
    this.updateState = this.updateState.bind(this);
    this.saveSourceData = this.saveSourceData.bind(this);
  }

  componentDidMount(){
    let textarea = document.getElementById('dataSource');
    new Behave({
      textarea: textarea
    });

    this.initData();
  }

  initData(){
    //load template data from localStorage
    let templates = JSON.parse(localStorage.getItem('templates'));
    if(templates[this.props.templateId]){
      console.log('Loading data', templates[this.props.templateId].data)
      this.setState({data: templates[this.props.templateId].data });
    }
  }

  updateState(event){
    this.setState({data: event.target.value})
  }

  saveSourceData(){
    this.props.saveSourceData(document.getElementById('dataSource').value)
  }

  render() {
    return (
      <div className='dataSource'>

        <div className='templateControls'>
          <Button onClick={this.saveSourceData}>Save Data</Button>
        </div>

        <textarea id='dataSource' value={this.state.data} onChange={this.updateState}></textarea>

      </div>
    );
  }
}

export default DataSource;
