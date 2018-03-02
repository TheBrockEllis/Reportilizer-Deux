import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';

import Menu from '../Menu/Menu';
// import Visual from '../Visual/Visual';
import Report from '../Report/Report';
// import Code from '../Code/Code';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src='https://fillmurray.com/50/50' alt='Reportilizer Logo' />
          <a href='/'><h1>Reportilizer</h1></a>
        </header>
        <Router>
          <div className='App-pages'>
            <Route exact path="/" component={Menu} />
            <Route path='/report/:name/:id' component={Report} />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
