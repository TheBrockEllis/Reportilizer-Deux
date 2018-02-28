import React from 'react';
import './VisualEditor.css';
import Box from '../Box/Box';

import { Button, ButtonGroup } from 'reactstrap';
import interact from 'interactjs';

class VisualEditor extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      boxes: [],
      boxIndex: 0
    };

    this.addBox = this.addBox.bind(this);
    this.deleteBox = this.deleteBox.bind(this);
  }

  componentDidMount(){

    interact('.draggable')
    .draggable({
      // enable inertial throwing
      inertia: false,
      // keep the element within the area of it's parent
      restrict: {
        restriction: "parent",
        endOnly: true,
        elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
      },
      /* snap to a grid */
      snap: {
        targets: [
          interact.createSnapGrid({ x: 10, y: 10 })
        ],
        range: Infinity,
        relativePoints: [ { x: 0, y: 0 } ]
      },
      // enable autoScroll
      autoScroll: true,

      // call this function on every dragmove event
      onmove: this.dragMoveListener,
      // call this function on every dragend event
      onend: function (event) {
        // var textEl = event.target.querySelector('p');
        //
        // textEl && (textEl.textContent =
        //   'moved a distance of '
        //   + (Math.sqrt(Math.pow(event.pageX - event.x0, 2) +
        //                Math.pow(event.pageY - event.y0, 2) | 0))
        //       .toFixed(2) + 'px');
      }
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
      restrictSize: {
        min: { width: 50, height: 50 },
      },

      inertia: true,
    })
    .on('resizemove', this.resizeMoveListener);
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

  addBox(){
    // State change will cause component re-render
    let box = { boxIndex: this.state.boxIndex, name: `Box #${this.state.boxIndex}`, x: 0, y: 0, width: 100, height: 100, code: '', style: '' };

    this.setState({
      boxes: [...this.state.boxes, box],
      boxIndex: this.state.boxIndex + 1
    });
  }

  deleteBox(box){
    var targetIndex;
    for (var i=0; i < this.state.boxes.length; i++) {
      if (this.state.boxes[i].boxIndex === box.boxIndex) {
        targetIndex = i;
      }
    }

    let box_id = `box_${box.boxIndex}`;

    // remove all interactjs listeners from the element
    console.log(`Unsetting ${box_id}`);
    // interact(`#${box_id}`).unset()

    // remove the component from the DOM
    // let mountNode = ReactDOM.findDOMNode(document.getElementById(box_id));
    // ReactDOM.unmountComponentAtNode(mountNode);

    // cut the box out of the state and update state
    let boxes = this.state.boxes;
    boxes.splice(targetIndex, 1);
    this.setState({
      boxes: boxes
    })
  }

  render() {
    return (
      <div className='App-pages visualEditor'>

        <div className='templateControls'>
          <ButtonGroup>
            <Button className='btn btn-sm btn-primary' onClick={this.addBox}>Add Box</Button>
            <Button>Set Margins</Button>
            <Button>Generate PDF</Button>
          </ButtonGroup>
        </div>
        <div className='document'>
          <div className='page' id='page1'>

          {
            this.state.boxes.map( (box, index) => {
                return <Box key={box.boxIndex} box={box} deleteBox={this.deleteBox} />
            })
          }

          </div>
        </div>
      </div>
    );
  }
}

export default VisualEditor;
