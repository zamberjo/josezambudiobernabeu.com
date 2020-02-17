import React, {Component} from 'react';
import M from 'materialize-css/dist/js/materialize.min.js';
import PropTypes from 'prop-types';
import 'materialize-css/dist/css/materialize.min.css';
import './Parallax.css';

/**
 * Parallax Component
 */
class Parallax extends Component {
  static propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
  };

  /**
   * Initialize sidenav Materialize
   */
  componentDidMount() {
    M.Parallax.init(document.querySelectorAll('.parallax'), {});
  }

  /**
   * Component
   * @return {Parallax} Component
   */
  render() {
    return (
      <div className='parallax-container'>
        <div className='responsive-img parallax'>
          <img src={'assets/img/parallax/' + this.props.src}
            alt={this.props.alt}/>
        </div>
      </div>
    );
  }
}

export default Parallax;
