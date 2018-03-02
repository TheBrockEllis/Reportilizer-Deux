import React from 'react';
import './Report.css';
import '../../lib/paper/sheets-of-paper-a4.css';
import VisualEditor from '../VisualEditor/VisualEditor';
import DataSource from '../DataSource/DataSource';

import { TabContent, TabPane, Nav, NavItem, NavLink, Breadcrumb, BreadcrumbItem, Fade, Alert } from 'reactstrap';
import classnames from 'classnames';

class Report extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      activeTab: '1',
      updated: false
    };

    this.toggleTab = this.toggleTab.bind(this);
    this.saveState = this.saveState.bind(this);
  }

  toggleTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  saveState(state){

    // console.log(this.props.match.params.id);
    // console.log('saving state in report');

    let templates = JSON.parse(localStorage.getItem('templates'));
    let template = templates[this.props.match.params.id];

    template.updated = Math.floor(Date.now());
    template.boxes = state.boxes;

    templates[this.props.match.params.id] = template;
    localStorage.setItem('templates', JSON.stringify(templates));

    this.setState({updated: true});

    setTimeout(()=> {
      this.setState({updated: false})
    }, 2000)
  }

  render() {
    return (
      <div className='report'>

        <Fade in={this.state.updated} className="mt-3">
          <Alert color="primary">
            Template saved
          </Alert>
        </Fade>

        <Breadcrumb>
          <BreadcrumbItem><a href="/">Main Menu</a></BreadcrumbItem>
          <BreadcrumbItem>{ this.props.match.params.name }</BreadcrumbItem>
          <BreadcrumbItem active>{ this.state.activeTab === '1' ? 'Visual Editor' : 'Data Source' }</BreadcrumbItem>
        </Breadcrumb>

        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' })}
              onClick={() => { this.toggleTab('1'); }}
            >
              Visual Editor
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => { this.toggleTab('2'); }}
            >
              Data Source
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <VisualEditor templateId={this.props.match.params.id} onSaveState={this.saveState} />
          </TabPane>
          <TabPane tabId="2">
            <DataSource />
          </TabPane>
        </TabContent>
      </div>

    );
  }
}

export default Report;
