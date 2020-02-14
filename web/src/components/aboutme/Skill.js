import React, {Component} from 'react';
// import M from 'materialize-css/dist/js/materialize.min.js';
import 'materialize-css/dist/css/materialize.min.css';

/**
 * Skills Component
 */
class Skill extends Component {
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
      <article className='col s6 m4 l2'>
        <img src='assets/img/skills/{this.props.src}'
          className='skill responsive-img'
          alt='{ this.props.alt }'/>
      </article>
    );
  }
}

export default Skill;
