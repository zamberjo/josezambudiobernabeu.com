import React, {Component, Fragment} from 'react';
import M from 'materialize-css/dist/js/materialize.min.js';
import Parallax from '../parallax/Parallax';
import Project from './Project';
import PropTypes from 'prop-types';

import 'materialize-css/dist/css/materialize.min.css';
import './Projects.css';

import data from './projects.json';

/**
 * Projects Component
 */
class Projects extends Component {
  static propTypes = {
    ReactGA: PropTypes.object.isRequired,
  };

  /**
   * Initialize sidenav Materialize
   * @param {Object} props Props of Component
   */
  constructor(props) {
    super(props);
    this.state = {
      scrollOptions: {
        scrollOffset: 64,
      },
    };
  }

  /**
   * Initialize ScrollSpy
   */
  componentDidMount() {
    const {scrollOptions} = this.state;
    if (typeof M !== 'undefined') {
      this.scrollInst = M.ScrollSpy.init(this._scrollEl, scrollOptions);
    }
  }

  /**
   * Update ScrollSpy
   */
  componentDidUpdate() {
    const {scrollOptions} = this.state;
    if (typeof M !== 'undefined') {
      this.scrollInst.destroy();
      this.scrollInst = M.ScrollSpy.init(this._scrollEl, scrollOptions);
    }
  }

  /**
   * Component
   * @return {Projects} Component
   */
  render() {
    const projects = data.projects;
    const ReactGA = this.props.ReactGA;
    return (
      <Fragment>
        <Parallax
          src='1.png'
          name='linusTorvalds'
          alt='Talk is cheap. Show me the code. (Linus Torvalds)'/>
        <div id="projects"
          ref={(el) => (this._scrollEl = el)}
          className="container section scrollspy">
          <div className="row">
            {projects.map((item, key) => {
              return (
                <Project {...item} key={key} ReactGA={ReactGA}/>
              );
            })}
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Projects;
