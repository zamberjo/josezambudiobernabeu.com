import React, {Component} from 'react';
import PropTypes from 'prop-types';

import 'materialize-css/dist/css/materialize.min.css';

/**
 * Project Component
 */
class Project extends Component {
  static propTypes = {
    src: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    projectUrl: PropTypes.string.isRequired,
    categoryGA: PropTypes.string.isRequired,
    actionGA: PropTypes.string.isRequired,
    ReactGA: PropTypes.object.isRequired,
  };

  /**
   * Component
   * @return {Project} Component
   */
  render() {
    const ReactGA = this.props.ReactGA;
    return (
      <article className='col s12 m6 l4'>
        <div className='card small'>
          <div className='card-image waves-effect waves-block waves-light'>
            <img className='activator'
              src={'assets/img/projects/' + this.props.src}
              alt={this.props.name}/>
          </div>
          <div className='card-content'>
            <span className='card-title activator grey-text text-darken-4'>
              {this.props.name}
              <i className='material-icons right'>more_vert</i>
            </span>
          </div>
          <div className='card-reveal'>
            <span className='card-title grey-text text-darken-4'>
              {this.props.name}
              <i className='material-icons right'>close</i>
            </span>
            <p>{ this.props.description }</p>
            <a
              className='waves-effect waves-teal btn-flat teal lighteen-5 right'
              href={this.props.projectUrl}
              target='_blank'
              onClick={
                ReactGA.event({
                  category: this.props.categoryGA,
                  action: this.props.actionGA,
                })}
              rel="noopener noreferrer">
                Proyecto
            </a>
          </div>
        </div>
      </article>
    );
  }
}

export default Project;
