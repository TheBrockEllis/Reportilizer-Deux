import React from 'react';
import './Report.css';
import '../../lib/paper/sheets-of-paper-usletter.css';
import VisualEditor from '../VisualEditor/VisualEditor';
import DataSource from '../DataSource/DataSource';

import { TabContent, TabPane, Nav, NavItem, NavLink, Breadcrumb, BreadcrumbItem, Fade, Alert } from 'reactstrap';
import classnames from 'classnames';
import dot from 'dot';
import juice from 'juice';

class Report extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      activeTab: '1',
      alert: {
        active: false,
        text: ''
      }
    };

    this.toggleTab = this.toggleTab.bind(this);
    this.saveState = this.saveState.bind(this);
    this.saveSourceData = this.saveSourceData.bind(this);
    this.generatePdf = this.generatePdf.bind(this);
    this.updateAlert = this.updateAlert.bind(this);
  }

  toggleTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  saveState(state){
    let templates = JSON.parse(localStorage.getItem('templates'));
    let template = templates[this.props.match.params.id];

    template.updated = Math.floor(Date.now());
    template.boxes = state.boxes;
    template.isLandscape = state.isLandscape;

    templates[this.props.match.params.id] = template;
    localStorage.setItem('templates', JSON.stringify(templates));

    this.updateAlert('Template updated');
  }

  saveSourceData(data){
    //load template data from localStorage
    let templates = JSON.parse(localStorage.getItem('templates'));
    if(templates[this.props.match.params.id]){
      templates[this.props.match.params.id].data = data;
    }

    localStorage.setItem('templates', JSON.stringify(templates));
    this.updateAlert('Source data updated');
  }

  updateAlert(text){
    this.setState({alert: { active: true, text: text} });

    setTimeout(()=> {
      this.setState({alert: { active: false} })
    }, 2000);
  }

  generatePdf(state){
    // create a 'PDF' div that will be hidden from view and used to take a snapshot
    let printablePdf = document.createElement('div');
    printablePdf.id = 'printablePdf';

    if(state.isLandscape){
      printablePdf.style.width = '29.7cm';
      printablePdf.style.minHeight = '21cm';
    } else {
      printablePdf.style.width = '21cm';
      printablePdf.style.minHeight = '29.7cm';
    }

    printablePdf.style.fontSize = '3.52778mm';
    printablePdf.style.padding = '2cm';
    printablePdf.style.margin = 0;
    printablePdf.style.position = 'relative';
    document.getElementsByTagName('body')[0].appendChild(printablePdf);

    state.boxes.forEach(box => {
      let div = document.createElement('div');
      div.style.position = 'absolute';
      div.style.left = (box.x / 3.779528) * window.devicePixelRatio + 'mm';
      div.style.top = (box.y / 3.779528) * window.devicePixelRatio + 'mm';
      div.style.width = (box.width / 3.779528) * window.devicePixelRatio + 'mm';
      div.style.height = (box.height / 3.779528) * window.devicePixelRatio + 'mm';
      if(state.isDebugging) div.style.border = '1px solid #000'; //remove this later

      let templateFunction = dot.template(box.code);
      let html = templateFunction(box.data);

      // inline all of the CSS styles we have
      html = juice.inlineContent(html, box.style, { inlinePseudoElements: true });

      //append that shit to the box
      div.innerHTML = html;

      // console.log(html);
      printablePdf.appendChild(div);
    });

    // send HTTP POST request to server with HTML string to generate a PDF
    let data = {
      "content": printablePdf.outerHTML,
      "orientation": state.isLandscape ? 'landscape' : 'portrait',
      "margins": {
        "left": "2cm",
        "right": "2cm",
        "bottom": "2cm",
        "top": "2cm"
      },
      "name": this.props.match.params.name
    }

    fetch('http://138.197.66.87', {
    	method: 'POST',
      body: JSON.stringify(data),
    	mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
      }
    }).then( response => response.json() )
    .then( response => {
      // console.log(response)
      let iframe = document.getElementById('downloadFrame');
      iframe.src = `http://138.197.66.87/download.php?filename=${response.filename}`;
      this.updateAlert('PDF generated & downloaded');
    });

    printablePdf.parentNode.removeChild(printablePdf);
  }

  render() {
    return (
      <div className='report'>

        <Fade in={this.state.alert.active} className="mt-3">
          <Alert color="primary">
            {this.state.alert.text}
          </Alert>
        </Fade>

        <Breadcrumb>
          <BreadcrumbItem><a href={process.env.PUBLIC_URL + '/'}>Main Menu</a></BreadcrumbItem>
          <BreadcrumbItem>{ this.props.match.params.name }</BreadcrumbItem>
          <BreadcrumbItem active>{ this.state.activeTab === '1' ? 'Visual Editor' : 'Data Source' }</BreadcrumbItem>
        </Breadcrumb>

        <iframe title='Download iFrame' id='downloadFrame' src=''></iframe>

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
            <VisualEditor templateId={this.props.match.params.id} onSaveState={this.saveState} onGeneratePdf={this.generatePdf}/>
          </TabPane>
          <TabPane tabId="2">
            <DataSource templateId={this.props.match.params.id} saveSourceData={this.saveSourceData} />
          </TabPane>
        </TabContent>
      </div>

    );
  }
}

export default Report;
