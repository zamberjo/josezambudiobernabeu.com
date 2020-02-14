import React, {Component} from 'react';
import M from 'materialize-css/dist/js/materialize.min.js';
import WorkExperience from './WorkExperience';
import 'materialize-css/dist/css/materialize.min.css';

/**
 * Experience Component
 */
class Experience extends Component {
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
   * @return {Experience} Component
   */
  render() {
    return (
      <div className='container col s12'>
        <div className='row'>
          <div className='col s12'>
            <ul className='collection'>
              <WorkExperience
                image="at.png"
                alt="Aures Tic"
                jobTitle="Odoo developer"
                company="Aures Tic"
                duration="Junio 2019 - Actualidad"
                description="
                  <p>
                    Desarrollador de módulos para clientes del ERP Odoo (
                    versiones 7.0 8.0 10.0 11.0)
                  </p>
                "/>
              <WorkExperience
                image="ds.png"
                alt="Diagram Software S.L.U"
                jobTitle="OpenERP / Odoo Developer"
                company="Diagram Software S.L.U"
                duration="Abril 2013 - Junio 2019"
                description="
                  <p>Desarrollador OpenERP / Odoo (v7.0-8.0):</p>
                  <p>
                    Fomación OpenERP / Odoo:
                    - Profesor curso 'PROGRAMACIÓN DE OPENERP/ODOO' (ESCUELA
                    POLITECNICA SUPERIOR DE ALCOY)
                  </p>
                "/>
              <WorkExperience
                image="acceseo.png"
                alt="Acceseo"
                jobTitle="(Colaborador) Backend/Frontend Developer"
                company="Acceseo"
                duration="Mayo 2013 - Enero 2015"
                description="
                  <ul>
                    <li>Desarrollo web services (Symfony 2).</li>
                    <li>Desarrollo plugins WordPress.</li>
                    <li>Modificaciones en módulos de Prestashop.</li>
                    <li>Aplicaciones en Facebook (page tabs incluidas).</li>
                  </ul>
                "/>
              <WorkExperience
                image="adsalsa.png"
                alt="adSalsa"
                jobTitle="Backend developer"
                company="adSalsa"
                duration="Septiembre 2012 - Enero 2013"
                description="
                  <ul>
                    <li>Desarrollo web services (Symfony 2). </li>
                    <li>Desarrollo landings HTML5.</li>
                    <li>Integración de juegos en Facebook. </li>
                    <li>Maquetación web.</li>
                  </ul>
                "/>
              <WorkExperience
                image="elcheOne.png"
                alt="Logo elcheOne"
                jobTitle="Diseñador web, Comunity Manager, Mantenimiento"
                company="elcheOne - Centro de Negocios"
                duration="Junio 2011 - Octubre 2011"
                description="
                  <p>Realización de las prácticas de empresa.</p>
                "/>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Experience;
