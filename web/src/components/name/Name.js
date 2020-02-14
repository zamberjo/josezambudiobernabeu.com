import React, {Component} from 'react';
import M from 'materialize-css/dist/js/materialize.min.js';
import 'materialize-css/dist/css/materialize.min.css';
import './Name.css';

/**
 * Name Component
 */
class Name extends Component {
  /**
   * Initialize Materialize
   * TODO:: To improve this code.
   */
  componentDidMount() {
    M.ScrollSpy.init(document.querySelectorAll('.scrollspy'), {
      throttle: 100,
      scrollOfffset: 500,
      activeClass: 'active',
    });

    const $nameContainer = document.getElementById('nameContainer');
    const $name = document.getElementById('name');
    const $firstLastName = document.getElementById('firstLastName');
    const $secondLastName = document.getElementById('secondLastName');
    const $nameButton = document.getElementById('name-btn');
    const $aliasButton = document.getElementById('alias-btn');
    const $socialButton = document.getElementById('social-btn');

    $nameContainer.addEventListener('click', (event) => {
      // ga('send', 'event', 'social', 'click', 'linkedin', '0');
      window.open('https://www.linkedin.com/in/zamberjo');
    });

    $nameContainer.addEventListener('animationend', (event) => {
      const flagAlias = $aliasButton.classList.contains('active');
      const flagName = $nameButton.classList.contains('active');
      const flagSocial = $socialButton.classList.contains('active');

      switch (event.animationName) {
        case 'nameContainerAppear':
          $name.classList.add('showName');
          $firstLastName.classList.add('showName');
          $secondLastName.classList.add('showName');
          break;
        case 'nameAliasResetMove':
          $name.classList.remove('resetAlias');
          $name.classList.remove('showName');
          $name.classList.remove('showSocial');
          $name.classList.remove('showAlias');
          if ( flagName ) {
            $name.classList.add('showName');
          } else if ( flagSocial ) {
            $name.classList.add('showSocial');
          } else if ( flagAlias ) {
            $name.classList.add('showAlias');
          }
          break;
        case 'firstLastNameAliasResetMove':
          $firstLastName.classList.remove('resetAlias');
          $firstLastName.classList.remove('showName');
          $firstLastName.classList.remove('showSocial');
          $firstLastName.classList.remove('showAlias');
          if ( flagName ) {
            $firstLastName.classList.add('showName');
          } else if ( flagSocial ) {
            $firstLastName.classList.add('showSocial');
          } else if ( flagAlias ) {
            $firstLastName.classList.add('showAlias');
          }
          break;
        case 'secondLastNameAliasResetMove':
          $secondLastName.classList.remove('resetAlias');
          $secondLastName.classList.remove('showName');
          $secondLastName.classList.remove('showSocial');
          $secondLastName.classList.remove('showAlias');
          if ( flagName ) {
            $secondLastName.classList.add('showName');
          } else if ( flagSocial ) {
            $secondLastName.classList.add('showSocial');
          } else if ( flagAlias ) {
            $secondLastName.classList.add('showAlias');
          }
          break;
        case 'nameSocialResetMove':
          $name.classList.remove('resetSocial');
          $name.classList.remove('showName');
          $name.classList.remove('showSocial');
          $name.classList.remove('showAlias');
          if ( flagName ) {
            $name.classList.add('showName');
          } else if ( flagSocial ) {
            $name.classList.add('showSocial');
          } else if ( flagAlias ) {
            $name.classList.add('showAlias');
          }
          break;
        case 'firstLastNameSocialResetMove':
          $firstLastName.classList.remove('resetSocial');
          $firstLastName.classList.remove('showName');
          $firstLastName.classList.remove('showSocial');
          $firstLastName.classList.remove('showAlias');
          if ( flagName ) {
            $firstLastName.classList.add('showName');
          } else if ( flagSocial ) {
            $firstLastName.classList.add('showSocial');
          } else if ( flagAlias ) {
            $firstLastName.classList.add('showAlias');
          }
          break;
        case 'secondLastNameSocialResetMove':
          $secondLastName.classList.remove('resetSocial');
          $secondLastName.classList.remove('showName');
          $secondLastName.classList.remove('showSocial');
          $secondLastName.classList.remove('showAlias');
          if ( flagName ) {
            $secondLastName.classList.add('showName');
          } else if ( flagSocial ) {
            $secondLastName.classList.add('showSocial');
          } else if ( flagAlias ) {
            $secondLastName.classList.add('showAlias');
          }
          break;
        default:
          break;
      }
    });

    const buttonNameAnimation = (event) => {
      if ( ! event.target.classList.contains('active') ) {
        $nameButton.classList.remove('active');
        $socialButton.classList.remove('active');
        $aliasButton.classList.remove('active');
        event.target.classList.add('active');

        const flagName = $name.classList.contains('showName');
        const flagAlias = $name.classList.contains('showAlias');
        const flagSocial = $name.classList.contains('showSocial');
        $name.classList.remove('showName');
        $firstLastName.classList.remove('showName');
        $secondLastName.classList.remove('showName');
        if ( flagAlias ) {
          $name.classList.add('resetAlias');
          $firstLastName.classList.add('resetAlias');
          $secondLastName.classList.add('resetAlias');
        } else if ( flagName ) {
          const flagButtonAlias = $aliasButton.classList.contains('active');
          const flagButtonName = $nameButton.classList.contains('active');
          const flagButtonSocial = $socialButton.classList.contains('active');
          if ( flagButtonName ) {
            $name.classList.add('showName');
            $firstLastName.classList.add('showName');
            $secondLastName.classList.add('showName');
          } else if ( flagButtonSocial ) {
            $name.classList.add('showSocial');
            $firstLastName.classList.add('showSocial');
            $secondLastName.classList.add('showSocial');
          } else if ( flagButtonAlias ) {
            $name.classList.add('showAlias');
            $firstLastName.classList.add('showAlias');
            $secondLastName.classList.add('showAlias');
          }
        } else if ( flagSocial ) {
          $name.classList.add('resetSocial');
          $firstLastName.classList.add('resetSocial');
          $secondLastName.classList.add('resetSocial');
        }
      }
    };

    $aliasButton.addEventListener('click', buttonNameAnimation);
    $nameButton.addEventListener('click', buttonNameAnimation);
    $socialButton.addEventListener('click', buttonNameAnimation);
  }

  /**
   * Render component
   * @return {Presentation} Component
   */
  render() {
    return (
      <section className='scrollspy Presentation'>
        <div id='switch' className='hide-on-small-only'>
          <i id='name-btn' className='fas fa-user-tie active'></i>
          <i id='alias-btn' className='fas fa-user-secret'></i>
          <i id='social-btn' className='fas fa-user'></i>
        </div>
        <div id='nameContainer'>
          <div id='name'>
            <span className='capitalize'>J</span>
            <span className='other'>ose</span>
          </div>
          <div id='firstLastName'>
            <span className='capitalize'>Z</span>
            <span className='other'>ambudio</span>
          </div>
          <div id='secondLastName'>
            <span className='capitalize'>B</span>
            <span className='other'>ernabeu</span>
          </div>
        </div>
        <div id='socialContainer'>
          <a href='https://github.com/zamberjo?tab=contributions&period=monthly'
            onClick='ga("send", "event", "social", "click", "github", "0")'
            rel='noopener noreferrer'
            target='_blank'>
            <i className='fab fa-github-alt'></i>
          </a>
          <a href='https://twitter.com/Zamberjo'
            onClick='ga("send", "event", "social", "click", "twitter", "0")'
            rel='noopener noreferrer'
            target='_blank'>
            <i className='fab fa-twitter'></i>
          </a>
          <a href='https://www.linkedin.com/in/zamberjo'
            onClick='ga("send", "event", "social", "click", "linkedin", "0")'
            rel='noopener noreferrer'
            target='_blank'>
            <i className='fab fa-linkedin-in'></i>
          </a>
        </div>
        <div id='motto' className='hide-on-small-only'>
          <blockquote>
            Informático en busca de una idea que os revolucione la vida
            (y me cubra de oro)
          </blockquote>
        </div>
      </section>
    );
  }
}

export default Name;
