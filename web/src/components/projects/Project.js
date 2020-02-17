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
  };

  /**
   * Component
   * @return {Project} Component
   */
  render() {
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
            <a href='{this.props.projectUrl}'
              className='waves-effect waves-teal btn-flat teal lighteen-5 right'
              target='_blank'>Proyecto
            </a>
          </div>
        </div>
      </article>
    );
  }
}

export default Project;
