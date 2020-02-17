import React, {Component} from 'react';
import PropTypes from 'prop-types';

import 'materialize-css/dist/css/materialize.min.css';
import './Study.css';

/**
 * Study Component
 */
class Study extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    center: PropTypes.string.isRequired,
    dateFrom: PropTypes.string.isRequired,
    dateUntil: PropTypes.string.isRequired,
  };

  /**
   * Component
   * @return {Study} Component
   */
  render() {
    return (
      <div className='col s12 Study'>
        <div className="row">
          <div className='col s12 title'>
            {this.props.title}
          </div>
          <div className='col s12 center'>
            {this.props.center}
          </div>
          <div className='col s12 dates'>
            {this.props.dateFrom} - {this.props.dateUntil}
          </div>
        </div>
      </div>
    );
  }
}

export default Study;
