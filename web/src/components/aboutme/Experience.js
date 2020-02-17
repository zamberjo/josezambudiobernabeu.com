import React, {Component} from 'react';
import WorkExperience from './WorkExperience';

import 'materialize-css/dist/css/materialize.min.css';

import data from './experience.json';

/**
 * Experience Component
 */
class Experience extends Component {
  /**
   * Component
   * @return {Experience} Component
   */
  render() {
    const works = data.works;
    return (
      <div id='experience' className='container col s12'>
        <div className='row'>
          <div className='col s12'>
            <ul className='collection'>
              {works.map((item, key) => {
                return <WorkExperience {...item} key={key}/>;
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Experience;
