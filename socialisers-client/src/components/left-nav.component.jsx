import React, { Component } from 'react'
import { NavLink, withRouter  } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faUser, faUsers, faNewspaper } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux'
import { messengerButton, notificationButton } from '../redux/user/user.actions';

class LeftNav extends Component {
  constructor(){
      super();
      this.state={
          isMobile: window.innerWidth <= 600
      }
  }

  render() {
    const {currentUser, isMobile, notificationButton, messengerButton, history} = this.props
    history.listen((props)=>{
      notificationButton(true)
      messengerButton(true)
    })
    return (
      <nav className="left-nav">
        <ul className="left-nav__list">
          <li className="left-nav__item">
            <NavLink className="left-nav__link" exact to="/">
              {isMobile ? (
                <FontAwesomeIcon icon={faBook} style={{ width: "100%" }} />
              ) : (
                "My Wall"
              )}
            </NavLink>
          </li>
          <li className="left-nav__item">
            <NavLink
              className="left-nav__link"
              exact
              to={`/profile/${currentUser._id}`}
            >
              {isMobile ? (
                <FontAwesomeIcon icon={faUser} style={{ width: "100%" }} />
              ) : (
                "Me"
              )}
            </NavLink>
          </li>
          <li className="left-nav__item">
            <NavLink className="left-nav__link" exact to="/friends">
              {isMobile ? (
                <FontAwesomeIcon icon={faUsers} style={{ width: "100%" }} />
              ) : (
                "Friends"
              )}
            </NavLink>
          </li>
          <li className="left-nav__item">
            <NavLink className="left-nav__link" exact to="/world-news">
              {isMobile ? (
                <FontAwesomeIcon
                  icon={faNewspaper}
                  style={{ width: "100%" }}
                />
              ) : (
                "World News"
              )}
            </NavLink>
          </li>
        </ul>
      </nav>
    );
  }
}

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser
})

const mapDispatchToProps = {
  messengerButton,
  notificationButton,
};



export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LeftNav))