import React, {Component} from 'react';
import M from 'materialize-css/dist/js/materialize.min.js';
import Parallax from '../parallax/Parallax';
import Project from './Project';
import 'materialize-css/dist/css/materialize.min.css';
import './Projects.css';

/**
 * Projects Component
 */
class Projects extends Component {
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
   * @return {Projects} Component
   */
  render() {
    return (
      <div>
        <Parallax
          src='1.png'
          alt='Talk is cheap. Show me the code. (Linus Torvalds)'/>
        <section className="container scrollspy" id="projects">
          <div className="row">
            <Project
              src='hesidohackeado.jpg'
              name='HeSidoHackeadoBot'
              description='
                Bot de telegram para uso de la API de
                <a href="https://hesidohackeado.com"
                  target="_blank">www.hesidohackeado.com</a>.
              '
              projectUrl='https://github.com/zamberjo/hesidohackeadobot'/>
            <Project
              src='docker.png'
              name='Home hosted'
              description='
                Home self-hosted services which are built with Open Source.
              '
              projectUrl='https://github.com/zamberjo/home-hosted'/>
            <Project
              src='josezambudiobernabeu.jpg'
              name='josezambudiobernabeu.com'
              description='
                Personal website.
              '
              projectUrl='https://github.com/zamberjo/josezambudiobernabeu.com'/>
            <Project
              src='osint.jpg'
              name='GetInfoSocial'
              description='
                OSINT gathering information bot.
              '
              projectUrl='https://github.com/zamberjo/GetInfoSocial'/>
            <Project
              src='cotos.png'
              name='Cotos - backend'
              description='
                WIP
              '
              projectUrl='https://github.com/zamberjo/cotos_backend'/>
            <Project
              src='cotos.png'
              name='Cotos - web'
              description='
                WIP
              '
              projectUrl='https://github.com/zamberjo/cotos_web'/>
            <Project
              src='cotos.png'
              name='Cotos - IA'
              description='
                WIP
              '
              projectUrl='https://github.com/zamberjo/cotos_ia'/>
          </div>
        </section>
      </div>
    );
  }
}

export default Projects;
