import React, {Component} from 'react';
import PropTypes from 'prop-types';

import 'materialize-css/dist/css/materialize.min.css';
import './WorkExperience.css';

/**
 * Experience Component
 */
class WorkExperience extends Component {
  static propTypes = {
    image: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    jobTitle: PropTypes.string.isRequired,
    company: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    description: PropTypes.array.isRequired,
  };

  /**
   * Component
   * @return {WorkExperience} Component
   */
  render() {
    return (
      <li className='hoverable collection-item'>
        <div className='row'>
          <div className='col s2 l1'>
            <img className='responsive-img circle'
              src={'assets/img/work/' + this.props.image}
              alt={this.props.alt}/>
          </div>
          <div className='col s10 l11'>
            <div className='row'>
              <div className='col m2 l1 job-title hide-on-small-only'>
                Puesto:
              </div>
              <div className='col s6 m2 l3 job'>
                {this.props.jobTitle}
              </div>
              <div className='col m2 l1 company-title hide-on-small-only'>
                Compañía:
              </div>
              <div className='col s6 m2 l3 company'>
                {this.props.company}
              </div>
              <div className='col m2 l1 duration-title hide-on-small-only'>
                Duración:
              </div>
              <div className='col s6 m2 l3 duration'>
                {this.props.duration}
              </div>
            </div>
          </div>
          <div className='col s10 l11 content right'>
            <ul>
              {this.props.description.map((item, key) => {
                return <li key={key}>{item}</li>;
              })}
            </ul>
          </div>
        </div>
      </li>
    );
  }
}

export default WorkExperience;
