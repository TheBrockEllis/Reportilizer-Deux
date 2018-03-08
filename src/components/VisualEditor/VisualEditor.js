import React from 'react';
import './VisualEditor.css';
import Box from '../Box/Box';

import update from 'immutability-helper';
import { Button, ButtonGroup, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Input, Label } from 'reactstrap';
import interact from 'interactjs';
import Behave from 'behave-js';

class VisualEditor extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      boxes: [],
      boxIndex: 0,
      editModal: false,
      editBox: {}
    };

    this.addBox = this.addBox.bind(this);
    this.deleteBox = this.deleteBox.bind(this);
    this.updateBox = this.updateBox.bind(this);
    this.saveState = this.saveState.bind(this);
    this.generatePdf = this.generatePdf.bind(this);
    this.toggleEditModal = this.toggleEditModal.bind(this);
    this.dragUpdateState = this.dragUpdateState.bind(this);
    this.resizeUpdateState = this.resizeUpdateState.bind(this);
  }

  componentDidMount(){

    //load template data from localStorage
    let templates = JSON.parse(localStorage.getItem('templates'));
    if(templates[this.props.templateId]){
      this.setState({
        boxes: templates[this.props.templateId].boxes,
        boxIndex: templates[this.props.templateId].boxes.length
      });
    }

    interact('.draggable')
    .draggable({
      // enable inertial throwing
      inertia: false,
      // keep the element within the area of it's parent
      restrict: {
        restriction: "parent",
        endOnly: true,
        elementRect: { top: 1, left: 1, bottom: 1, right: 1 }
      },
      /* snap to a grid */
      snap: {
        targets: [
          interact.createSnapGrid({ x: 10, y: 10 })
        ],
        range: Infinity
      },
      // enable autoScroll
      autoScroll: true,
    })
    .resizable({
      // resize from all edges and corners
      edges: { left: true, right: true, bottom: true, top: true },
      // keep the edges inside the parent
      restrictEdges: {
        outer: 'parent',
        endOnly: true,
      },

      /* snap to a grid */
      snapSize: {
        targets: [
          // snap the width and height to multiples of 100 when the element size
          // is 25 pixels away from the target size
          interact.createSnapGrid({ x: 10, y: 10 })
        ],
        range: Infinity,
        relativePoints: [ { x: 0, y: 0 } ]
      },
      // minimum size
      restrictSize: { min: { width: 50, height: 50 } },
      inertia: true,
    })
    .on({
      resizemove: this.resizeMoveListener,
      resizeend: this.resizeUpdateState,
      dragmove: this.dragMoveListener,
      dragend: this.dragUpdateState
    });

    new Behave({
      textarea: document.getElementById('boxStyle')
    });

    new Behave({
      textarea: document.getElementById('boxContent')
    })
  }

  dragMoveListener(event) {
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
    target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }

  dragUpdateState(event) {
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x'))),
        y = (parseFloat(target.getAttribute('data-y'))),
        boxIndex = target.getAttribute('data-boxindex');

    let newState = update(this.state, {boxes: {[boxIndex]: {x: {$set: x}, y: {$set: y}}}});
    this.setState(newState);
  }

  resizeMoveListener(event){
    var target = event.target,
        x = (parseFloat(target.getAttribute('data-x')) || 0),
        y = (parseFloat(target.getAttribute('data-y')) || 0);

    // update the element's style
    target.style.width  = event.rect.width + 'px';
    target.style.height = event.rect.height + 'px';

    // translate when resizing from top or left edges
    x += event.deltaRect.left;
    y += event.deltaRect.top;

    target.style.webkitTransform = target.style.transform =
        'translate(' + x + 'px,' + y + 'px)';

    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
    target.firstChild.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height);
  }

  resizeUpdateState(event){
    var target = event.target,
        x = parseFloat(target.getAttribute('data-x')),
        y = parseFloat(target.getAttribute('data-y')),
        height = parseInt(target.style.height, 10),
        width = parseInt(target.style.width, 10),
        boxIndex = target.getAttribute('data-boxindex');

    let updatedBox = {
      x: x,
      y: y,
      width: width,
      height: height
    }

    let newState = update(this.state, {boxes: {[boxIndex]: {$merge: updatedBox}}});
    this.setState(newState);
  }

  toggleEditModal(box?) {
    //if this is true, we need to clear out the editing box
    let newState;
    if(this.state.editModal){
      newState = { editBox: {}, editModal: false }
    } else {
      newState = { editBox: box, editModal: true }
    }

    this.setState(newState);
  }

  addBox(){
    // State change will cause component re-render
    let box = {
      boxIndex: this.state.boxIndex,
      name: `Box #${this.state.boxIndex}`,
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      code: '',
      style: ''
    };

    this.setState({
      boxes: [...this.state.boxes, box],
      boxIndex: this.state.boxIndex + 1
    });
  }

  /*
   * the BoxIndex is essentially what number of box has been created,
   * but NOT the true array index in state.boxes
   * this function returns the true array index
  */
  findBoxArrayIndex(box){
    var arrayIndex;
    for (var i=0; i < this.state.boxes.length; i++) {
      if (this.state.boxes[i].boxIndex === box.boxIndex) {
        arrayIndex = i;
        break;
      }
    }

    return arrayIndex;
  }

  deleteBox(box){
    // cut the box out of the state and update state
    var arrayIndex = this.findBoxArrayIndex(box);
    let boxes = this.state.boxes;
    boxes.splice(arrayIndex, 1);
    this.setState({
      boxes: boxes
    })
  }

  updateBox(){
    console.log('Updating box');

    let updatedBox = {
      name: document.getElementById('boxName').value,
      code: document.getElementById('boxCode').value,
      style: document.getElementById('boxStyle').value
    }

    this.setState( update(this.state, {boxes: {[this.state.editBox.boxIndex]: {$merge: updatedBox}}}));

    this.toggleEditModal();
  }

  saveState(){
    // this tells the <Report /> to save all of the boxes and margins
    this.props.onSaveState(this.state);
  }

  generatePdf(){
    // this tells the <Report /> to make a PDF
    this.props.onGeneratePdf(this.state);
  }

  render() {
    return (
      <div className='App-pages visualEditor'>

        <div className='templateControls'>
          <ButtonGroup>
            <Button className='btn btn-sm btn-primary' onClick={this.addBox}>Add Box</Button>
            <Button>Set Margins</Button>
            <Button onClick={this.generatePdf}>Generate PDF</Button>
            <Button onClick={this.saveState}>Save Template</Button>
          </ButtonGroup>
        </div>
        <div className='document'>
          <div className='page' id='page1'>

          {
            this.state.boxes.map( (box, index) => {
                return <Box
                  key={box.boxIndex}
                  box={box}
                  deleteBox={this.deleteBox}
                  toggleEditModal={this.toggleEditModal} />
            })
          }

          </div>
        </div>

        <Modal isOpen={this.state.editModal} toggle={this.toggleEditModal} className={this.props.className}>
          <ModalHeader toggle={this.toggleEditModal}>Edit Box {this.state.editBox.name}</ModalHeader>
          <ModalBody>

            <Form id='boxPropertiesForm'>
              <FormGroup>
                <Label for="boxName">Box Name</Label>
                <Input type="text" name="boxName" id="boxName" placeholder="Grades Block" defaultValue={this.state.editBox.name} />

                <Label for="boxCode">Box Content</Label>
                <textarea name="boxCode" id="boxCode">{this.state.editBox.code}</textarea>

                <Label for="boxStyle">Box Style</Label>
                <textarea name="boxStyle" id="boxStyle">{this.state.editBox.style}</textarea>
              </FormGroup>
            </Form>

          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.updateBox}>Save</Button>{' '}
            <Button color="secondary" onClick={this.toggleEditModal}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default VisualEditor;
