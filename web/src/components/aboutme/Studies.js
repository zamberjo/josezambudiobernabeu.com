import React, {Component} from 'react';
import Study from './Study.js';

import 'materialize-css/dist/css/materialize.min.css';

import data from './studies.json';

/**
 * Studies Component
 */
class Studies extends Component {
  /**
   * Initialize sidenav Materialize
   */
  // componentDidMount() {}

  /**
   * Component
   * @return {Studies} Component
   */
  render() {
    const studies = data.studies;
    return (
      <div id='studies' className='col s12'>
        <div className='container'>
          <div className='row'>
            {studies.map((item, key) => {
              return <Study {...item} key={key}/>;
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default Studies;
