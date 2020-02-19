import React, {Component} from 'react';
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
class App extends Component {
  /**
   * Initialize website state
   * @param {Object} props Props of Component
   */
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'presentation',
    };
    this.changeActiveTab = this.changeActiveTab.bind(this);
  }

  changeActiveTab(tab) {
    this.setState({
      activeTab: tab,
    })
  }

  /**
   * Component
   * @return {App} Component
   */
  render() {
    return (
      <div>
        <Sidebar changeActiveTab={this.changeActiveTab}/>
        <Name ReactGA={ReactGA}/>
        <AboutMe activeTab={this.state.activeTab}/>
        <Projects ReactGA={ReactGA}/>
        <Footer ReactGA={ReactGA}/>
      </div>
    );
  }
}

export default App;
