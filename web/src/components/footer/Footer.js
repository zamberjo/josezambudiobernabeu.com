import React, {Component} from 'react';
import 'materialize-css/dist/css/materialize.min.css';
import './Footer.css';

/**
 * Footer Component
 */
class Footer extends Component {
  /**
   * Component
   * @return {Sidebar} Component
   */
  render() {
    return (
      <footer className='page-footer'>
        <div className='container'>
          <div className='row'>
            <div className='col l4 offset-l2 s12'>
              <h5 className='white-text'>Social</h5>
              <ul>
                <li>
                  <a className='grey-text text-lighten-3'
                    target='_blank'
                    rel="noopener noreferrer"
                    href='https://github.com/zamberjo?tab=contributions&period=monthly'>
                    GitHub
                  </a>
                </li>
                <li>
                  <a className='grey-text text-lighten-3'
                    target='_blank'
                    rel="noopener noreferrer"
                    href='https://twitter.com/Zamberjo'>
                    Twitter
                  </a>
                </li>
                <li>
                  <a className='grey-text text-lighten-3'
                    target='_blank'
                    rel="noopener noreferrer"
                    href='https://www.linkedin.com/in/zamberjo'>
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
            <div className='col l4 offset-l2 s12'>
              <h5 className='white-text'>Projects</h5>
              {/* <ul></ul> */}
            </div>
          </div>
        </div>
        <div className='footer-copyright'>
          <div className='container'>
            © 2020 Jose Zambudio Bernabeu
            <a className='grey-text text-lighten-4 right'
              href='/'>JoseZambudioBernabeu.com
            </a>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
