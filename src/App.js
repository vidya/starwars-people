import React, { Component } from 'react';
import './App.css';
import People from './People/People'

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>People in Star Wars </h1>
        <People />
      </div>
    );
  }
}

export default App;
