import React, {Component} from 'react';
import M from 'materialize-css/dist/js/materialize.min.js';
import Parallax from '../parallax/Parallax';
import Project from './Project';
import 'materialize-css/dist/css/materialize.min.css';
import './Projects.css';
import data from './projects.json';

/**
 * Projects Component
 */
class Projects extends Component {
  /**
   * Initialize sidenav Materialize
   * @param {Object} props Props of Component
   */
  constructor(props) {
    super(props);
    this.state = {
      scrollOptions: {
        throttle: 100,
        scrollOfffset: 500,
        activeClass: 'active',
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
    return (
      <div>
        <Parallax
          src='1.png'
          alt='Talk is cheap. Show me the code. (Linus Torvalds)'/>
        <section id="projects"
          ref={(el) => (this._scrollEl = el)}
          className="container scrollspy">
          <div className="row">
            {projects.map((item, key) => {
              return (
                <Project {...item} key={key}/>
              );
            })}
          </div>
        </section>
      </div>
    );
  }
}

export default Projects;
