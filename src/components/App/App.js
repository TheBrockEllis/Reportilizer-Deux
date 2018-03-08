import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';

import Menu from '../Menu/Menu';
import Report from '../Report/Report';
import HowTo from '../HowTo/HowTo';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src='https://fillmurray.com/50/50' alt='Reportilizer Logo' />
          <a href={process.env.PUBLIC_URL + '/'}><h1>Reportilizer</h1></a>
        </header>
        <Router>
          <div className='App-pages'>
            <Route exact path={process.env.PUBLIC_URL + '/'} component={Menu} />
            <Route path={process.env.PUBLIC_URL + '/how-to'} component={HowTo} />
            <Route path={process.env.PUBLIC_URL + '/report/:name/:id'} component={Report} />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
