import React, { Component } from "react";
import M from "materialize-css/dist/js/materialize.min.js";
import "materialize-css/dist/css/materialize.min.css";
import './Sidebar.css';

class Sidebar extends Component {
  componentDidMount() {
    const elem = document.querySelector(".sidenav");
    M.Sidenav.init(elem, {
        edge: "left",
        inDuration: 250
    });
  }

  render() {
    return (
      <header className="Sidebar">

        <div className="navbar-fixed">
          <nav id="menu">
            <div className="nav-wrapper">
              <a href="#" className="brand-logo valing-wrapper">Zambu</a>
              <a href="#" data-target="mobile-menu" className="sidenav-trigger">
                <i className="material-icons">menu</i>
              </a>
              <ul className="right hide-on-med-and-down">
                <li><a href="#header">Home</a></li>
                <li><a href="#aboutme">Sobre mi</a></li>
                <li><a href="#projects">Proyectos personales</a></li>
                 {/* <li><a href="#contact">Contact</a></li> */}
              </ul>
            </div>
          </nav>
        </div>
        
        <ul className="sidenav" id="mobile-menu">
          <li><a className="scrollspy" href="#header">Home</a></li>
          <li><a className="scrollspy" href="#projects">Proyectos personales</a></li>
          <li><a className="scrollspy" href="#aboutme">Sobre mi</a></li>
          {/* <li><a className="scrollspy" href="#contact">Contact</a></li> */}
        </ul>
      
      </header>
    );
  }
}

export default Sidebar;