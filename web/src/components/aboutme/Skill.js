import React, {Component} from 'react';
import PropTypes from 'prop-types';

import 'materialize-css/dist/css/materialize.min.css';
import './Skill.css';

/**
 * Skills Component
 */
class Skill extends Component {
  static propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
  };

  /**
   * Initialize sidenav Materialize
   */
  // componentDidMount() {}

  /**
   * Component
   * @return {Skill} Component
   */
  render() {
    return (
      <article className='col s6 m4 l2 skill'>
        <div className='skillContainer hoverable'>
          <img src={'assets/img/skills/' + this.props.src}
            className='responsive-img'
            alt={ this.props.alt }/>
        </div>
      </article>
    );
  }
}

export default Skill;
