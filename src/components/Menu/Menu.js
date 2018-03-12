import React from 'react';
import './Menu.css';

import { NavLink, Link } from 'react-router-dom';
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Input, Label } from 'reactstrap';

class Home extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      templates: [],
      modal: false
    };

    this.loadState = this.loadState.bind(this);
    this.saveState = this.saveState.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.saveTemplate = this.saveTemplate.bind(this);
  }

  componentDidMount(){
    this.loadState();
  }

  loadState(){
    if( localStorage.getItem('templates') ){
      console.log('loading templates from localStorage');
      this.setState({
        templates: JSON.parse( localStorage.getItem('templates') )
      });
    }
  }

  saveState(templates?){
    console.log('saving templates to localStorage', templates ? templates : this.state);

    localStorage.setItem('templates', JSON.stringify(templates ? templates : this.state.templates) );
  }

  toggleModal() {
    this.setState({
      modal: !this.state.modal
    });
  }

  saveTemplate(){
    let templateName = document.getElementById('templateName').value;

    let template = {
      name: templateName,
      margins: [],
      boxes: [],
      data: '',
      updated: Math.floor(Date.now())
    }

    let newTemplates = [...this.state.templates, template];

    this.setState({
      templates: newTemplates
    });

    // save current state to localStorage
    this.saveState(newTemplates);

    // remove the modal
    this.toggleModal();
  }

  deleteTemplate(index){
    let newTemplates = this.state.templates;
    newTemplates.splice(index, 1);

    this.setState({
      templates: newTemplates
    });

    this.saveState(newTemplates);
  }

  render() {
    return (
      <div className='container'>
        <div className='clearfix'>
          <h1 className='float-left'>Main Menu</h1>
          <Button className='float-right' onClick={this.toggleModal}>Add New Template</Button>
        </div>

        <Table>
          <thead>
            <tr>
              <td>Template Name</td>
              <td>Last Edited</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {
              this.state.templates.map( (template, index) => {
                return (
                  <tr key={index}>
                    <td><NavLink to={'report/' + template.name + '/' + index}>{template.name}</NavLink></td>
                    <td>{ new Date(template.updated).toLocaleString() }</td>
                    <td onClick={() => this.deleteTemplate(index)}><i className='fas fa-trash'></i></td>
                  </tr>
                )
              })
            }
          </tbody>
        </Table>

        <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>New Template</ModalHeader>
          <ModalBody>

          <Form>
            <FormGroup>
              <Label for="templateName">Template Name</Label>
              <Input type="text" name="templateName" id="templateName" placeholder="High School - Sophomore w/ A.P. Classes" />
            </FormGroup>
          </Form>

          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.saveTemplate}>Save</Button>{' '}
            <Button color="dark" onClick={this.toggleModal}>Cancel</Button>
          </ModalFooter>
        </Modal>

        <div className='footer'>
          <p>Need help? Check out the <Link to={process.env.PUBLIC_URL + '/how-to'}>"How To"</Link> page!</p>
        </div>

      </div>
    );
  }
}

export default Home;
