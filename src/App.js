import React, { Component } from 'react';
import './App.css';
import People from './People/People'

class App extends Component {
  render() {
    return (
      <div className="App">
        {/*<header className="App-header">*/}
                  {/**/}
        {/*</header>*/}
        <h1>Star Wars </h1>
        <People />
      </div>
    );
  }
}

export default App;
