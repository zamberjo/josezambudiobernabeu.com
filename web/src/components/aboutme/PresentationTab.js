import React, {Component} from 'react';
// import M from 'materialize-css/dist/js/materialize.min.js';
import 'materialize-css/dist/css/materialize.min.css';
import './PresentationTab.css';

/**
 * PresentationTab Component
 */
class PresentationTab extends Component {
  /**
   * Initialize sidenav Materialize
   */
  // componentDidMount() {}

  /**
   * Component
   * @return {PresentationTab} Component
   */
  render() {
    return (
      <div className='col s12'>
        <div className='col s12'>
          <div className='row'>
            <div className='col s12 m6 l4'>
              <img id='me'
                className='materialboxed responsive-img z-depth-2'
                src='assets/img/me.jpg'
                alt='Jose Zambudio Bernabeu'/>
            </div>
            <div className='col s12 m6 l8'>
              <p>
                Odoo senior developer con experiencia en multitud de sectores,
                pequeñas como grandes empresas, abarcando campos como Ventas,
                Compras, CRM, MRP, Almacén...
              </p>
              <p>
                Experiencia en Python, PostgreSQL, Linux, Docker, Javascript
                (ES6). Siempre dispuesto a afrontar nuevos retos y a aprender
                nuevas tecnologías que me hagan crecer profesionalmente.
              </p>
              <p>
                A lo largo de mi vida laboral me he dedicado tanto a frontend,
                como backend, habiéndome centrado los últimos años en backend
                pero sin perder nunca la mirada al resto de frameworks.
              </p>
              <p>
                Ingeniero Técnico en Sistemas (plan 2001) en la Universidad de
                Alicante.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PresentationTab;
