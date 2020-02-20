import React, {Component} from 'react';
import PropTypes from 'prop-types';

import 'materialize-css/dist/css/materialize.min.css';
import './Footer.css';

import data from '../projects/projects.json';
/**
 * Footer Component
 */
class Footer extends Component {
  static propTypes = {
    ReactGA: PropTypes.object.isRequired,
  };

  /**
   * Component
   * @return {Sidebar} Component
   */
  render() {
    const projects = data.projects;
    return (
      <footer className='page-footer'>
        <div className='container'>
          <div className='row'>
            <div className='col s6 l4 offset-l2'>
              <h5 className='white-text'>Social</h5>
              <ul>
                <li>
                  <a className='grey-text text-lighten-3'
                    target='_blank'
                    rel="noopener noreferrer"
                    onClick={
                      this.props.ReactGA.event({
                        category: 'Social', action: 'github'})}
                    href='https://github.com/zamberjo?tab=contributions&period=monthly'>
                    GitHub
                  </a>
                </li>
                <li>
                  <a className='grey-text text-lighten-3'
                    target='_blank'
                    rel="noopener noreferrer"
                    onClick={
                      this.props.ReactGA.event({
                        category: 'Social', action: 'twitter'})}
                    href='https://twitter.com/Zamberjo'>
                    Twitter
                  </a>
                </li>
                <li>
                  <a className='grey-text text-lighten-3'
                    target='_blank'
                    rel="noopener noreferrer"
                    onClick={
                      this.props.ReactGA.event({
                        category: 'Social', action: 'linkedin'})}
                    href='https://www.linkedin.com/in/zamberjo'>
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
            <div className='col s6 l4 offset-l2'>
              <h5 className='white-text'>Projects</h5>
              <ul>
                {projects.map((item, key) => {
                  return (
                    <li key={key}>
                      <a className='grey-text text-lighten-3'
                        target='_blank'
                        rel="noopener noreferrer"
                        onClick={
                          this.props.ReactGA.event({
                            category: item.categoryGA,
                            action: item.actionGA,
                          })}
                        href={item.projectUrl}>
                        {item.name}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
        <div className='footer-copyright'>
          <div className='container'>
            <div className='col s12 m6 center-align'>
                © 2020 Jose Zambudio Bernabeu
            </div>
            <div className='col s12 m6 center-align'>
              <a className='grey-text text-lighten-4' href='/'>
                JoseZambudioBernabeu.com
              </a>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
