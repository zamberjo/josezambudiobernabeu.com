import React, {Component} from 'react';
import M from 'materialize-css/dist/js/materialize.min.js';
import PropTypes from 'prop-types';
import 'materialize-css/dist/css/materialize.min.css';

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
    description: PropTypes.string.isRequired,
  };

  /**
   * Initialize sidenav Materialize
   */
  componentDidMount() {
    M.ScrollSpy.init(document.querySelectorAll('.scrollspy'), {
      throttle: 100,
      scrollOfffset: 500,
      activeClass: 'active',
    });
  }

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
              src='assets/img/{ this.props.image }'
              alt='{ this.props.alt }'/>
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
          <div className='col s12 l11 content'>
            {this.props.description}
          </div>
        </div>
      </li>
    );
  }
}

export default WorkExperience;
