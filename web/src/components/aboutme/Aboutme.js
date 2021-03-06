import React, {Component, Fragment} from 'react';
import M from 'materialize-css/dist/js/materialize.min.js';
import PropTypes from 'prop-types';

import Parallax from '../parallax/Parallax';
import PresentationTab from './PresentationTab';
import ExperienceTab from './ExperienceTab';
import Skills from './Skills';
import Studies from './Studies';

import 'materialize-css/dist/css/materialize.min.css';
import './Aboutme.css';

/**
 * AboutMe Component
 */
class AboutMe extends Component {
  static propTypes = {
    activeTab: PropTypes.string.isRequired,
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
      tabsOptions: {
        swipeable: true,
      },
    };
  }

  /**
   * Initialize ScrollSpy && Tabs Materialize
   */
  componentDidMount() {
    const {scrollOptions, tabsOptions} = this.state;
    if (typeof M !== 'undefined') {
      this.scrollInst = M.ScrollSpy.init(this._scrollEl, scrollOptions);
      this.tabsInst = M.Tabs.init(this._tabsEl, tabsOptions);
      this.tabsInst.select(this.props.activeTab);
    }
  }

  /**
   * Update ScrollSpy && Tabs Materialize
   */
  componentDidUpdate() {
    if (typeof M !== 'undefined') {
      this.tabsInst.select(this.props.activeTab);
    }
  }

  /**
   * Destroy ScrollSpy && Tabs Materialize
   */
  componentWillUnmount() {
    if (typeof M !== 'undefined') {
      this.tabsInst.destroy();
      this.scrollInst.destroy();
    }
  }

  /**
   * Component
   * @return {Sidebar} Component
   */
  render() {
    return (
      <Fragment>
        <Parallax
          src='2.jpg'
          alt='Snippet of code'/>
        <section className='scrollspy' id='aboutme'
          ref={(el) => (this._scrollEl = el)}>
          <div className='row'>
            <div className='col s12'>
              <ul className='tabs tabs-fixed-width'
                ref={(el) => (this._tabsEl = el)}>
                <li className='tab col s3'>
                  <a className='active' href='#presentation'>
                  Presentacion
                  </a>
                </li>
                <li className='tab col s3'>
                  <a href='#experience'>Experiencia</a>
                </li>
                <li className='tab col s3'>
                  <a href='#skills'>Skills</a>
                </li>
                <li className='tab col s3'>
                  <a href='#studies'>Estudios</a>
                </li>
              </ul>
            </div>
          </div>

          <div className='row'>
            <PresentationTab/>
            <ExperienceTab/>
            <Skills/>
            <Studies/>
          </div>
        </section>
      </Fragment>
    );
  }
}

export default AboutMe;
