import React from 'react';
import './App.css';
import Sidebar from './components/sidebar/Sidebar';
import Presentation from './components/presentation/Presentation';

/**
 * Page content
 * @return {Component} Component to render.
 */
function App() {
  return (
    <div>
      <Sidebar/>
      <Presentation/>
    </div>
  );
}

export default App;
