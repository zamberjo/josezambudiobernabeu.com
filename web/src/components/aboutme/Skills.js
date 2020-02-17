import React, {Component} from 'react';
import Skill from './Skill';

import 'materialize-css/dist/css/materialize.min.css';

import data from './skills.json';

/**
 * Skills Component
 */
class Skills extends Component {
  /**
   * Initialize sidenav Materialize
   */
  // componentDidMount() {}

  /**
   * Component
   * @return {Skills} Component
   */
  render() {
    const skills = data.skills;
    return (
      <div id='skills' className='col s12'>
        <div className='row'>
          {skills.map((item, key) => {
            return <Skill {...item} key={key}/>;
          })}
        </div>
      </div>
    );
  }
}

export default Skills;
