import React from 'react';
import './Report.css';
import '../../lib/paper/sheets-of-paper-a4.css';

import VisualEditor from '../VisualEditor/VisualEditor';
import DataSource from '../DataSource/DataSource';

import { TabContent, TabPane, Nav, NavItem, NavLink, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import classnames from 'classnames';

class Report extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      activeTab: '1'
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  render() {
    return (
      <div className='report'>
        <Breadcrumb>
          <BreadcrumbItem><a href="/">Main Menu</a></BreadcrumbItem>
          <BreadcrumbItem active>{ this.props.match.params.id }</BreadcrumbItem>
        </Breadcrumb>

        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' })}
              onClick={() => { this.toggle('1'); }}
            >
              Visual Editor
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => { this.toggle('2'); }}
            >
              Data Source
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <VisualEditor />
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
