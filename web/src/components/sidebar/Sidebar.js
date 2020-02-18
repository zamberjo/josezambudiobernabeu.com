import React, {Component} from 'react';
import M from 'materialize-css/dist/js/materialize.min.js';
import 'materialize-css/dist/css/materialize.min.css';
import './Sidebar.css';

/**
 * Sidebar Component
 */
class Sidebar extends Component {
  /**
   * Initialize sidenav Materialize
   * @param {Object} props Props of Component
   */
  constructor(props) {
    super(props);
    this.state = {
      sidenavOptions: {
        edge: 'left',
        inDuration: 250,
      },
    };
  }

  /**
   * Initialize Materialize
   */
  componentDidMount() {
    const {sidenavOptions} = this.state;
    if (typeof M !== 'undefined') {
      this.sidenavInst = M.Sidenav.init(this._sidenavEl, sidenavOptions);
    }
  }

  /**
   * Update Sidenav
   */
  componentDidUpdate() {
    const {sidenavOptions} = this.state;
    if (typeof M !== 'undefined') {
      this.sidenavInst.destroy();
      this.sidenavInst = M.Sidenav.init(this._sidenavEl, sidenavOptions);
    }
  }

  /**
   * Component
   * @return {Sidebar} Component
   */
  render() {
    return (
      <header className='Sidebar'>

        <div className='navbar-fixed'>
          <nav id='menu'>
            <div className='nav-wrapper'>
              <a href='/' className='brand-logo valing-wrapper'>Zambu</a>
              <a href='/' data-target='mobile-menu' className='sidenav-trigger'>
                <i className='material-icons'>menu</i>
              </a>
              <ul className='right hide-on-med-and-down'>
                <li><a href='#presentationName'>Home</a></li>
                <li><a href='#aboutme'>Sobre mi</a></li>
                <li><a href='#projects'>Side Projects</a></li>
              </ul>
            </div>
          </nav>
        </div>
        <ul id='mobile-menu' className='sidenav'
          ref={(el) => (this._sidenavEl = el)}>
          <li><a className='scrollspy' href='#header'>Home</a></li>
          <li>
            <a className='scrollspy' href='#projects'>Proyectos personales</a>
          </li>
          <li><a className='scrollspy' href='#aboutme'>Sobre mi</a></li>
        </ul>
      </header>
    );
  }
}

export default Sidebar;
