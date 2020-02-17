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
   * Initialize Parallax Materialize
   * @param {Object} props Props of Component
   */
  constructor(props) {
    super(props);
    this.state = {
      parallaxOptions: {},
    };
  }

  /**
   * Initialize Materialize
   */
  componentDidMount() {
    const {parallaxOptions} = this.state;
    if (typeof M !== 'undefined') {
      this.parallaxInst = M.Parallax.init(this._parallaxEl, parallaxOptions);
    }
  }

  /**
   * Update Parallax
   */
  componentDidUpdate() {
    const {parallaxOptions} = this.state;
    if (typeof M !== 'undefined') {
      this.parallaxInst.destroy();
      this.parallaxInst = M.Parallax.init(this._parallaxEl, parallaxOptions);
    }
  }

  /**
   * Component
   * @return {Parallax} Component
   */
  render() {
    return (
      <div className='parallax-container'>
        <div className='responsive-img parallax'
          ref={(el) => (this._parallaxEl = el)}>
          <img src={'assets/img/parallax/' + this.props.src}
            alt={this.props.alt}/>
        </div>
      </div>
    );
  }
}

export default Parallax;
