import React, {Component} from 'react';
// import M from 'materialize-css/dist/js/materialize.min.js';
import Skill from './Skill';
import 'materialize-css/dist/css/materialize.min.css';

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
    return (
      <div id='skills' className='col s12'>
        <div className='row'>
          <Skill
            src='odoo.png'
            alt='Logo skill Odoo'/>
          <Skill
            src='docker.png'
            alt='Logo skill Docker'/>
          <Skill
            src='postgresql.png'
            alt='Logo skill PostgreSQL'/>
          <Skill
            src='python.jpg'
            alt='Logo skill Python'/>
          <Skill
            src='js.png'
            alt='Logo skill Javascript'/>
          <Skill
            src='nodejs.png'
            alt='Logo skill NodeJS'/>
          <Skill
            src='mongodb.jpg'
            alt='Logo skill MongoDB'/>
          <Skill
            src='git.png'
            alt='Logo skill Git'/>
          <Skill
            src='wordpress.png'
            alt='Logo skill Wordpress'/>
          <Skill
            src='github.png'
            alt='Logo skill Github'/>
          <Skill
            src='reactjs.png'
            alt='Logo skill ReactJS'/>
          <Skill
            src='webpack.png'
            alt='Logo skill Webpack'/>
          <Skill
            src='materialize.jpeg'
            alt='Logo skill Materialize'/>
        </div>
      </div>
    );
  }
}

export default Skills;
