import React, {Component} from 'react';
import M from 'materialize-css/dist/js/materialize.min.js';

import 'materialize-css/dist/css/materialize.min.css';
import './PresentationTab.css';

import me from './img/me.jpg';

/**
 * PresentationTab Component
 */
class PresentationTab extends Component {
  /**
   * Initialize sidenav Materialize
   * @param {Object} props Props of Component
   */
  constructor(props) {
    super(props);
    this.state = {
      imgOptions: {},
    };
  }

  /**
   * Initialize Materialbox
   */
  componentDidMount() {
    const {imgOptions} = this.state;
    if (typeof M !== 'undefined') {
      this.imgInst = M.Materialbox.init(this._imgEl, imgOptions);
    }
  }

  /**
   * Update Materialbox
   */
  componentDidUpdate() {
    const {imgOptions} = this.state;

    if (typeof M !== 'undefined') {
      this.imgInst.destroy();
      this.imgInst = M.Materialbox.init(this._imgEl, imgOptions);
    }
  }

  /**
   * Component
   * @return {PresentationTab} Component
   */
  render() {
    return (
      <section id='presentation' className='col s12'>
        <div className='col s12 m12 l10 offset-l1'>
          <div className='row'>
            <div className='col s12 m3 l4'>
              <img id='me'
                ref={(el) => (this._imgEl = el)}
                className='materialboxed hoverable responsive-img z-depth-2'
                src={me}
                alt='Jose Zambudio Bernabeu'/>
            </div>
            <div className='col s12 m9 l8'>
              <div className="shell-wrap">
                <p className="shell-top-bar">
                  /Users/zambu/Documents/helloWorld/
                </p>
                <ul className="shell-body">
                  <li>cd /Users/zambu/Documents/helloWorld/</li>
                  <li>rm -rf / --no-preserve-root^C</li>
                  <li>
                    echo &quot;Jajaja, no -.-&#39;&#39;&quot;<br/>
                    Jajaja, no -.-&#39;&#39;
                  </li>
                  <li>cat myPresentation.txt<br/>
                    <p>
                      Odoo senior developer con experiencia en multitud de
                      sectores, pequeñas como grandes empresas, abarcando
                      campos como Ventas, Compras, CRM, MRP, Almacén...
                    </p>
                    <p>
                      Experiencia en Python, PostgreSQL, Linux, Docker,
                      Javascript (ES6). Siempre dispuesto a afrontar nuevos
                      retos y a aprender nuevas tecnologías que me hagan crecer
                      profesionalmente.
                    </p>
                    <p>
                      A lo largo de mi vida laboral me he dedicado tanto a
                      frontend, como backend, habiéndome centrado los últimos
                      años en backend pero sin perder nunca la mirada al resto
                      de frameworks.
                    </p>
                    <p>
                      Ingeniero Técnico en Sistemas (plan 2001) en la
                      Universidad de Alicante.
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default PresentationTab;
