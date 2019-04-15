import React, { Component } from 'react';
import './App.css';

import FullMap from "./Componentes/MapPage";

class App extends Component {
  render() {
    return (
      <div className="App">
        {<FullMap />}
      </div>
    );
  }
}

export default App;
