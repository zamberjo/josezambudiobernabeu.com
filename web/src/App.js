import React from 'react';
import ReactGA from 'react-ga';
import Sidebar from './components/sidebar/Sidebar';
import Name from './components/name/Name';
import AboutMe from './components/aboutme/Aboutme';
import Projects from './components/projects/Projects';
import Footer from './components/footer/Footer';

import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css';

ReactGA.initialize('UA-144711999-1');

/**
 * Page content
 * @return {Component} Component to render.
 */
function App() {
  return (
    <div>
      <Sidebar/>
      <Name ReactGA={ReactGA}/>
      <AboutMe/>
      <Projects/>
      <Footer/>
    </div>
  );
}

export default App;
