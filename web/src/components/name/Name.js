import React, {Component} from 'react';
import M from 'materialize-css/dist/js/materialize.min.js';
import PropTypes from 'prop-types';

import 'materialize-css/dist/css/materialize.min.css';
import './Name.css';

/**
 * Name Component
 */
class Name extends Component {
  static propTypes = {
    ReactGA: PropTypes.object.isRequired,
  };


  /**
   * Initialize scrollspy Materialize
   * @param {Object} props Props of Component
   */
  constructor(props) {
    super(props);
    this.state = {
      'scrollOptions': {
        throttle: 100,
        scrollOfffset: 500,
        activeClass: 'active',
      },
      'activeAction': 'alias',
    };
    this.nameContainerClick = this.nameContainerClick.bind(this);
    this.nameContainerAnima = this.nameContainerAnima.bind(this);
    this.buttonNameAnimation = this.buttonNameAnimation.bind(this);
  }

  /**
   * Click on name animation.
   */
  nameContainerClick() {
    this.props.ReactGA.event({category: 'Social', action: 'linkedin'});
    window.open('https://www.linkedin.com/in/zamberjo');
  }

  /**
   * AnimationEnd name container.
   * @param {Object} event Event animationend
   */
  nameContainerAnima(event) {
    const flagAlias = this._buttonAliasEl.classList.contains('active');
    const flagName = this._buttonNameEl.classList.contains('active');
    const flagSocial = this._buttonSocialEl.classList.contains('active');

    switch (event.animationName) {
      case 'nameContainerAppear':
        this._nameEl.classList.add('showName');
        this._firstLastNameEl.classList.add('showName');
        this._secondLastNameEl.classList.add('showName');
        break;
      case 'nameAliasResetMove':
        this._nameEl.classList.remove('resetAlias');
        this._nameEl.classList.remove('showName');
        this._nameEl.classList.remove('showSocial');
        this._nameEl.classList.remove('showAlias');
        if ( flagName ) {
          this._nameEl.classList.add('showName');
        } else if ( flagSocial ) {
          this._nameEl.classList.add('showSocial');
        } else if ( flagAlias ) {
          this._nameEl.classList.add('showAlias');
        }
        break;
      case 'firstLastNameAliasResetMove':
        this._firstLastNameEl.classList.remove('resetAlias');
        this._firstLastNameEl.classList.remove('showName');
        this._firstLastNameEl.classList.remove('showSocial');
        this._firstLastNameEl.classList.remove('showAlias');
        if ( flagName ) {
          this._firstLastNameEl.classList.add('showName');
        } else if ( flagSocial ) {
          this._firstLastNameEl.classList.add('showSocial');
        } else if ( flagAlias ) {
          this._firstLastNameEl.classList.add('showAlias');
        }
        break;
      case 'secondLastNameAliasResetMove':
        this._secondLastNameEl.classList.remove('resetAlias');
        this._secondLastNameEl.classList.remove('showName');
        this._secondLastNameEl.classList.remove('showSocial');
        this._secondLastNameEl.classList.remove('showAlias');
        if ( flagName ) {
          this._secondLastNameEl.classList.add('showName');
        } else if ( flagSocial ) {
          this._secondLastNameEl.classList.add('showSocial');
        } else if ( flagAlias ) {
          this._secondLastNameEl.classList.add('showAlias');
        }
        break;
      case 'nameSocialResetMove':
        this._nameEl.classList.remove('resetSocial');
        this._nameEl.classList.remove('showName');
        this._nameEl.classList.remove('showSocial');
        this._nameEl.classList.remove('showAlias');
        if ( flagName ) {
          this._nameEl.classList.add('showName');
        } else if ( flagSocial ) {
          this._nameEl.classList.add('showSocial');
        } else if ( flagAlias ) {
          this._nameEl.classList.add('showAlias');
        }
        break;
      case 'firstLastNameSocialResetMove':
        this._firstLastNameEl.classList.remove('resetSocial');
        this._firstLastNameEl.classList.remove('showName');
        this._firstLastNameEl.classList.remove('showSocial');
        this._firstLastNameEl.classList.remove('showAlias');
        if ( flagName ) {
          this._firstLastNameEl.classList.add('showName');
        } else if ( flagSocial ) {
          this._firstLastNameEl.classList.add('showSocial');
        } else if ( flagAlias ) {
          this._firstLastNameEl.classList.add('showAlias');
        }
        break;
      case 'secondLastNameSocialResetMove':
        this._secondLastNameEl.classList.remove('resetSocial');
        this._secondLastNameEl.classList.remove('showName');
        this._secondLastNameEl.classList.remove('showSocial');
        this._secondLastNameEl.classList.remove('showAlias');
        if ( flagName ) {
          this._secondLastNameEl.classList.add('showName');
        } else if ( flagSocial ) {
          this._secondLastNameEl.classList.add('showSocial');
        } else if ( flagAlias ) {
          this._secondLastNameEl.classList.add('showAlias');
        }
        break;
      default:
        break;
    }
  }

  /**
   * Actions name animation
   * @param {Object} event Event click
   */
  buttonNameAnimation(event) {
    if ( ! event.target.classList.contains('active') ) {
      this._buttonNameEl.classList.remove('active');
      this._buttonAliasEl.classList.remove('active');
      this._buttonSocialEl.classList.remove('active');
      event.target.classList.add('active');

      const flagName = this._nameEl.classList.contains('showName');
      const flagAlias = this._nameEl.classList.contains('showAlias');
      const flagSocial = this._nameEl.classList.contains('showSocial');
      this._nameEl.classList.remove('showName');
      this._firstLastNameEl.classList.remove('showName');
      this._secondLastNameEl.classList.remove('showName');
      if ( flagAlias ) {
        this._nameEl.classList.add('resetAlias');
        this._firstLastNameEl.classList.add('resetAlias');
        this._secondLastNameEl.classList.add('resetAlias');
      } else if ( flagName ) {
        const flagButtonAlias = this._buttonAliasEl.classList.contains(
            'active');
        const flagButtonName = this._buttonNameEl.classList.contains(
            'active');
        const flagButtonSocial = this._buttonSocialEl.classList.contains(
            'active');
        if ( flagButtonName ) {
          this._nameEl.classList.add('showName');
          this._firstLastNameEl.classList.add('showName');
          this._secondLastNameEl.classList.add('showName');
        } else if ( flagButtonSocial ) {
          this._nameEl.classList.add('showSocial');
          this._firstLastNameEl.classList.add('showSocial');
          this._secondLastNameEl.classList.add('showSocial');
        } else if ( flagButtonAlias ) {
          this._nameEl.classList.add('showAlias');
          this._firstLastNameEl.classList.add('showAlias');
          this._secondLastNameEl.classList.add('showAlias');
        }
      } else if ( flagSocial ) {
        this._nameEl.classList.add('resetSocial');
        this._firstLastNameEl.classList.add('resetSocial');
        this._secondLastNameEl.classList.add('resetSocial');
      }
    }
  }

  /**
   * Initialize Materialize
   * TODO:: To improve this code.
   */
  componentDidMount() {
    const {scrollOptions} = this.state;
    if (typeof M !== 'undefined') {
      this.scrollInst = M.ScrollSpy.init(this._scrollEl, scrollOptions);
    }
  }

  /**
   * Update ScrollSpy
   */
  componentDidUpdate() {
    const {scrollOptions} = this.state;
    if (typeof M !== 'undefined') {
      this.scrollInst.destroy();
      this.scrollInst = M.ScrollSpy.init(this._scrollEl, scrollOptions);
    }
  }

  /**
   * Render component
   * @return {Presentation} Component
   */
  render() {
    return (
      <section id='presentationName'
        className='scrollspy Presentation'
        ref={(el) => (this._scrollEl = el)}>
        <div id='switch' className='hide-on-small-only'>
          <i id='name-btn'
            className='fas fa-user-tie active'
            ref={(el) => (this._buttonNameEl = el)}
            onClick={this.buttonNameAnimation}></i>
          <i id='alias-btn'
            className='fas fa-user-secret'
            ref={(el) => (this._buttonAliasEl = el)}
            onClick={this.buttonNameAnimation}></i>
          <i id='social-btn'
            className='fas fa-user'
            ref={(el) => (this._buttonSocialEl = el)}
            onClick={this.buttonNameAnimation}></i>
        </div>
        <div id='nameContainer'
          onClick={this.nameContainerClick}
          onAnimationEnd={this.nameContainerAnima}>
          <div id='name'
            ref={(el) => (this._nameEl = el)}>
            <span className='capitalize'>J</span>
            <span className='other'>ose</span>
          </div>
          <div id='firstLastName'
            ref={(el) => (this._firstLastNameEl = el)}>
            <span className='capitalize'>Z</span>
            <span className='other'>ambudio</span>
          </div>
          <div id='secondLastName'
            ref={(el) => (this._secondLastNameEl = el)}>
            <span className='capitalize'>B</span>
            <span className='other'>ernabeu</span>
          </div>
        </div>
        <div id='socialContainer'>
          <a href='https://github.com/zamberjo?tab=contributions&period=monthly'
            onClick={
              this.props.ReactGA.event({
                category: 'Social', action: 'github'})}
            rel='noopener noreferrer'
            target='_blank'>
            <i className='fab fa-github-alt'></i>
          </a>
          <a href='https://twitter.com/Zamberjo'
            onClick={
              this.props.ReactGA.event({
                category: 'Social', action: 'twitter'})}
            rel='noopener noreferrer'
            target='_blank'>
            <i className='fab fa-twitter'></i>
          </a>
          <a href='https://www.linkedin.com/in/zamberjo'
            onClick={
              this.props.ReactGA.event({
                category: 'Social', action: 'linkedin'})}
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
