import React, {Component} from 'react';
import M from 'materialize-css/dist/js/materialize.min.js';
import 'materialize-css/dist/css/materialize.min.css';
import './Parallax.css';
import first from './img/1.png';
import second from './img/2.jpg';
import third from './img/3.jpg';

const images = {
  '1.png': first,
  '2.jpg': second,
  '3.jpg': third,
}

/**
 * Parallax Component
 */
class Parallax extends Component {
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
    debugger;
    return (
      <div className='parallax-container'>
        <div className='responsive-img parallax'>
          <img src={images[this.props.src]}
            alt={this.props.alt}/>
        </div>
      </div>
    );
  }
}

export default Parallax;
