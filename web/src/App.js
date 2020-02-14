import React from 'react';
import './App.css';
import Sidebar from './components/sidebar/Sidebar';
import Name from './components/name/Name';
import AboutMe from './components/aboutme/Aboutme';
import Projects from './components/projects/Projects';
import Footer from './components/footer/Footer';

/**
 * Page content
 * @return {Component} Component to render.
 */
function App() {
  return (
    <div>
      <Sidebar/>
      <Name/>
      <AboutMe/>
      <Projects/>
      <Footer/>
    </div>
  );
}

export default App;
